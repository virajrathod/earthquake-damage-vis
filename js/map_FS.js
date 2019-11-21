class mapClass {
    constructor(data) {
        let usDataSample = data.filter(function (d, i) {
            return i < 1000;
        });
        this.dropdown(data,usDataSample);
        this.mapoverlay(usDataSample);
        // this.map=null;
    }


    rgbToHex (rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    fullColorHex (r, g, b) {

        let red = this.rgbToHex(r);
        let green = this.rgbToHex(g);
        let blue = this.rgbToHex(b);
        return red + green + blue;

    };


    dropdown(data,usDataSample) {
        let dropdownWrap = d3.select('#floating-panel'); //.append('div').classed('dropdown-wrapper', true);
        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Color coding by:');

        yWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let that = this;
        // let dropDownWrapper = d3.select('#floating-panel');

        // let  = [];
        for (let key in data) {
            // console.log(data[key])
            if (key === 'length' || !data.hasOwnProperty(key)) continue;
            var dropData = data[key];
            // let dropData=data[key]
            // console.log(dropData)
        }
// console.log(dropData.filter((d,i)=>[0,1,2,3,6,8,9,10,11,12].includes(i)))
//         console.log(dropData)
        /* CIRCLE DROPDOWN */
        let dropC = dropdownWrap.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData.filter((d,i)=>[0,1,2,8,9,10,11,12].includes(i)));


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d);

        optionsCEnter.append('text')
            .text((d, i) => d);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter((d,i) => i==7)
            .attr('selected', true);

        dropC.on('change', function (d, i) {
            let cValue = this.options[this.selectedIndex].value;
            that.updateMap(usDataSample,cValue);
        });

    }





    mapoverlay(data) {
        let that = this;
        let layer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibXJzaGVpIiwiYSI6ImNrMndybnJxNDA0NzAzZG8zdW16bWZuNjEifQ.MvgZUZVOBhLpdLg3-NtSyQ'
        });

        let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });


        // var marker = L.marker([37.76, -122.45]).addTo(mymap);
//     let circle=Array();
//     for (let i = 0; i < data.length; ++i) {
//     L.circle([data[i].Latitude, data[i].Longitude], {
//
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     // radius: 500
// }).addTo(mymap);
//     }


let code='DamageRatio';
        let pointsGroup = L.layerGroup();
        data.forEach(function (d) {

            let circle=L.shapeMarker([d.Latitude, d.Longitude], {
                shape:'triangle-down',
                color: 'black',
                fillColor: ('#' + that.fullColorHex(255, Math.round(255 - d[code] * 255), 0)),
                fillOpacity: 0.9,
                achieve: d[code],
                radius: 8,
                className: 'circleClass',
                weight: 0,
                rotationAngle: 45
            }).bindPopup(code+': '+d[code]).on("mouseover" ,function(ev) {
                circle.setStyle({
                    weight: 2,
                    radius: 20,
                });
                // circle.setLatLng(circle.getLatLng+0.2)
                // console.log(circle.getLatLng)
                ev.target.openPopup();
            })

                .on("mouseout",function(ev) {
                    circle.setStyle({
                        weight: 0,
                        radius: 8
                    });
                    ev.target.closePopup();
                }).addTo(pointsGroup);

            // binding data to marker object's option
            // L.marker([d.Latitude, d.Longitude], { achieve: d.DamageRatio })
            //     .on("mouseover", onMouseOver)
            //     .on("mouseout", onMouseOut)
            //     .addTo(pointsGroup);
        });
        // let map = L.map('mapDiv').setView(, 12);

        var baseLayers = {
            "USGS": layer1,
            "Satellite": googleSat
            // "thunderforest": layer2
        }
        let subLayers = {"Points": pointsGroup};

        this.map = L.map("mapDiv", {
            center: [37.76, -122.45],
            zoom: 12,
            layers: [layer1, pointsGroup]
        });

        let layerControl=L.control.layers(baseLayers, subLayers, {position: "topright"}).addTo(this.map);
        // layers.remove();
        // layers.removeLayer(layer1)

        document.getElementById("defView").addEventListener("click", function () {
            that.map.setView([37.76, -122.45], 12);
        });

        document.getElementById("zoomView").addEventListener("click", function () {
            that.map.setView([37.76, -122.45], 17);
        });

        let legSvg=d3.select('#mapLegend').append('svg').attr('width','100%').attr('height',"100%")
        legSvg.append('rect')
            .attr('width','100%').attr('height',"100%").attr('fill','black').attr('stroke-width',3)
            .attr('stroke','black').classed('legRect',true);
        legSvg.append('text').text('DamageRatio: '+1.0).attr('transform','translate(30,30)').classed('legText',true).attr('id','legText1');
        legSvg.append('text').text('DamageRatio: '+0.0).attr('transform','translate(30,55)').classed('legText',true).attr('id','legText2');
        legSvg.append('circle').attr('cx',0).attr('cy',0).attr('r',5)
            .attr('fill','#' + that.fullColorHex(255, 0, 0)).attr('transform','translate(20,25)');
        legSvg.append('circle').attr('cx',0).attr('cy',0).attr('r',5)
            .attr('fill','#' + that.fullColorHex(255, 255, 0)).attr('transform','translate(20,50)');
        this.pointsGroup=pointsGroup;
        this.layerControl=layerControl;

    }



    onMouseOver(e) {
        // let that=this;

        // marker.openPopup();
        // var point = this._map.latLngToContainerPoint(e.latlng);
        // var tooltip = d3.select('#mapDiv')
        //     .append("div")
        //     .attr("class", "tooltip")
        //     // Calculating according to marker and tooltip size
        //     // .style({ left: point.x - 40 + "px", top: point.y - 80 - 41 + "px" })
        //     .style("left", point.x - 40 + "px")
        //     .style("top", point.y - 40 - 41 + "px")
        // ;
        // getPie(e.target.options.achieve);
        //
        // function getPie(value) {
        //     var size = 70;
        //     var arc = d3.arc().outerRadius(size / 2).innerRadius(size / 3),
        //         pie = d3.layout.pie().sort(null);
        //
        //     d3.select('.tooltip').append("svg")
        //         .attr('width', size).attr('height', size)
        //         .append("g")
        //         .attr("transform", "translate(" + [size / 2, size / 2] + ")")
        //         .call(function (s) {
        //             s.append("text")
        //                 .text(value)
        //                 .style("font", "14px")
        //                 .attr({"text-anchor": "middle", "alignment-baseline": "central"});
        //         })
        //         .selectAll("path")
        //         .data(pie([value, 1 - value]))
        //         .enter()
        //         .append("path")
        //         .attr({
        //             d: arc,
        //             fill: function (d, i) {
        //                 return i ? "gray" : "red";
        //             }
        //         });
        // }
    }

    onMouseOut(e) {
        // d3.select(".tooltip").remove();
    }





    updateMap(data,code){
        this.map.removeLayer(this.pointsGroup);
        this.layerControl.removeLayer(this.pointsGroup);
        let that=this;
        let layer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoibXJzaGVpIiwiYSI6ImNrMndybnJxNDA0NzAzZG8zdW16bWZuNjEifQ.MvgZUZVOBhLpdLg3-NtSyQ'
        });

        let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        var pointsGroup = L.layerGroup();
        let code_min=(d3.min(data, d => +d[code]));
        let code_max=(d3.max(data, d => +d[code]));

        data.forEach(function (d) {
            if (code=='SafetyTag'){
                let circle=L.shapeMarker([d.Latitude, d.Longitude], {
                    shape:'triangle-down',
                    color: 'black',
                    fillColor: ('#' + that.fullColorHex(255, Math.round(255 -
                    (d[code]=='Safe' ? 0 :1) * 255), 0)),
                    fillOpacity: 0.9,
                    achieve: d[code],
                    radius: 8,
                    className: 'circleClass',
                    weight: 0,
                    rotationAngle: 45
                }).bindPopup(code+': '+d[code]).on("mouseover" ,function(ev) {
                    circle.setStyle({
                        weight: 2,
                        radius: 20,
                    });
                    // circle.setLatLng(circle.getLatLng+0.2)
                    // console.log(circle.getLatLng)
                    ev.target.openPopup();
                })

                    .on("mouseout",function(ev) {
                        circle.setStyle({
                            weight: 0,
                            radius: 8
                        });
                        ev.target.closePopup();
                    }).addTo(pointsGroup);

            } else {
                    let circle=L.shapeMarker([d.Latitude, d.Longitude], {
                        shape:'triangle-down',
                        color: 'black',
                        fillColor: ('#' + that.fullColorHex(255, Math.round(255 -
                            (d[code]-code_min)/
                            (code_max-code_min)
                            * 255), 0)),
                        fillOpacity: 0.9,
                        achieve: d[code],
                        radius: 8,
                        className: 'circleClass',
                        weight: 0,
                        rotationAngle: 45
                    }).bindPopup(code+': '+d[code]).on("mouseover" ,function(ev) {
                        circle.setStyle({
                            weight: 2,
                            radius: 20,
                        });
                        // circle.setLatLng(circle.getLatLng+0.2)
                        // console.log(circle.getLatLng)
                        ev.target.openPopup();
                    })

                        .on("mouseout",function(ev) {
                            circle.setStyle({
                                weight: 0,
                                radius: 8
                            });
                            ev.target.closePopup();
                        }).addTo(pointsGroup);
            }
        });

        var baseLayers = {
            "USGS": layer1,
            "Satellite": googleSat
            // "thunderforest": layer2
        }
        let subLayers = {"Points": pointsGroup};

        // L.map("mapDiv", {
        //     center: [37.76, -122.45],
        //     zoom: 12,
        //     layers: [layer1, pointsGroup]
        // });
// //     console.log(this.layers)
// // this.layers.remove();

if (code=='SafetyTag'){
    d3.select('#legText1').text(code+': Unsafe');
    d3.select('#legText2').text(code+': Safe');
} else{
    d3.select('#legText1').text(code+': '+d3.max(data, d => +d[code]));
    d3.select('#legText2').text(code+': '+d3.min(data, d => +d[code]));
}


        // let that=this;
        pointsGroup.addTo(this.map);

        this.pointsGroup=pointsGroup;
        // this.layerControl.addLayer(subLayers);
        this.layerControl.addOverlay(pointsGroup , "Points");
    }

}
















//
//
//
//
//
//
//
//
//     async function googleMap(data) {
//
//
//         let googleMapStyles = await d3.json("js/mapStyle.json");
//         let options = {
//             zoom: 7,
//             center: {
//                 lat: 37.76,
//                 lng: -122.52,
//             },
//             mapTypeId: 'roadmap',
//             styles: googleMapStyles,
//             gestureHandling: 'greedy'
//         };
//
//
//         let map = new google.maps.Map(d3.select("#mapDiv").node(), options);
//
//         let   tileListener = google.maps.event.addListener(map,'tilesloaded',fixMyPageOnce);
//
//         function fixMyPageOnce(){
//             let cnt=13.5;
//             function chng(map,cnt) {
//                 if (cnt>7){
//                     chng(map,cnt-1)
//                 }
//                 setTimeout(map.setZoom(cnt-1), 100)
//             }
//             chng(map,cnt);
//             google.maps.event.removeListener(tileListener);
//         }
//         setTimeout(map.setZoom(7), 1);
//         // var infowindow = new google.maps.InfoWindow({
//         //     content: 'Change the zoom level',
//         //     position: {
//         //         lat: 37.76,
//         //         lng: -122.45,
//         //     }
//         // });
//         // infowindow.open(map);
//
//         map.addListener('zoom_changed', function() {
//             marker_plot()
//         });
//
//
//         let usDataSample = data;
//
//         let heatMapData=Array();
//         for (let i = 0; i < usDataSample.length; ++i) {
//             heatMapData.push({location: new google.maps.LatLng(usDataSample[i].Latitude, usDataSample[i].Longitude), weight: Math.pow(usDataSample[i].DamageRatio,1)})
//         }
//
//         let overlay = await new google.maps.OverlayView();
//
//
//
//
//
//         function marker_plot(){
//             overlay.onAdd = function () {
//
//                 let layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
//                     .attr("class", "marker_div");
//
//                 let layer2 = d3.select(this.getPanes().overlayMouseTarget).append("div")
//                     .attr("class", "tooltipClass");
//
//                 overlay.onRemove = function () {
//                     d3.select('.marker_div').remove();
//                     d3.select('.tooltipClass').remove();
//                 };
//                 overlay.draw = function () {
//
//                     let projection = this.getProjection(),
//                         padding = 10;
//
//
//                     let heightScale = d3.scaleLinear()
//                         .domain([d3.min(usDataSample, d => +d.Stories),
//                             d3.max(usDataSample, d => +d.Stories)])
//                         .range([10, 40]);
//                     let widthScale = d3.scaleLinear()
//                         .domain([d3.min(usDataSample, d => +d['Area(m2)']),
//                             d3.max(usDataSample, d => +d['Area(m2)'])])
//                         .range([10, 20]);
//
//                     function marker_plot_zoom (filtered_data){
//
//                         let marker = layer.selectAll('svg')
//                             .data(filtered_data);
//                         let markerEnter = marker.enter().append("svg");
//
//                         markerEnter.append("rect");
//
//                         marker.exit().remove();
//
//                         marker = marker.merge(markerEnter);
//
//                         marker
//                             .each(transform)
//                             .attr("class", "marker");
//
//                         let rgbToHex = function (rgb) {
//                             let hex = Number(rgb).toString(16);
//                             if (hex.length < 2) {
//                                 hex = "0" + hex;
//                             }
//                             return hex;
//                         };
//                         let fullColorHex = function (r, g, b) {
//
//                             let red = rgbToHex(r);
//                             let green = rgbToHex(g);
//                             let blue = rgbToHex(b);
//                             return red + green + blue;
//
//                         };
//
//                         marker.select("rect")
//                             .attr("height", d => heightScale(d.Stories))
//                             .attr("width", d => widthScale(d['Area(m2)']))
//                             .attr("x", padding)
//                             .attr("y", padding)
//                             .attr("stroke", 'black')
//                             .attr("stroke-width", 1)
//                             .style('opacity', .8)
//                             .attr('fill', d => '#' + fullColorHex(255, Math.round(255 - d.DamageRatio * 255), 0))
//                     }
//                     function precise(x) {
//                         return Number.parseFloat(x).toPrecision(2);
//                     }
//                     function tooltip_plot_zoom (filtered_data){
//                         let tooltip = layer2.selectAll('svg')
//                             .data(filtered_data);
//
//                         let ttEnter = tooltip.enter().append("svg");
//
//                         ttEnter.append("rect").classed('ttrect',true);
//                         ttEnter.append("text").classed('line1',true);
//                         ttEnter.append("text").classed('line2',true);
//                         ttEnter.append("text").classed('line3',true);
//
//                         tooltip.exit().remove();
//
//                         tooltip = tooltip.merge(ttEnter);
//
//                         tooltip
//                             .each(transform)
//                             .attr("class", "tooltip");
//
//                         tooltip.select("rect")
//                             .attr("width", 150)
//                             .attr("height", 50)
//                             .attr("x", d => widthScale(d['Area(m2)'])+padding)
//                             .attr("y", padding)
//                             .style('opacity', .8)
//                             .attr('fill','white')
//                             .attr('stroke','black');
//
//
//                         tooltip.select(".line1").classed('text_lines',true)
//                             .attr("x", d => widthScale(d['Area(m2)'])+20)
//                             .attr("y", 23)
//
//                             .text(d=> 'DamageRatio: '+precise(d.DamageRatio));
//
//                         tooltip.select(".line2").classed('text_lines',true)
//                             .attr("x", d => widthScale(d['Area(m2)'])+20)
//                             .attr("y", 38)
//                             .text(d=> 'Stories: '+d.Stories);
//                         tooltip.select(".line3").classed('text_lines',true)
//                             .attr("x", d => widthScale(d['Area(m2)'])+20)
//                             .attr("y", 53)
//                             .text(d=> 'Safety Tag: '+ (d.SafetyTag))
//
//                     }
//
//                     if (map.zoom>17.5) {
//
//                         let max_lat=map.getBounds().pa.h;
//                         let min_lat=map.getBounds().pa.g;
//                         let max_lng=map.getBounds().ka.h;
//                         let min_lng=map.getBounds().ka.g;
//                         let filtered_data=usDataSample.filter(function(d){
//                             return (d.Longitude>min_lng && d.Longitude<max_lng && d.Latitude>min_lat && d.Latitude<max_lat);
//                         });
//
//                         tooltip_plot_zoom(filtered_data);
//                         marker_plot_zoom(filtered_data)
//                     }
//
//                     else if (map.zoom>15.5){
//
//                         let max_lat=map.getBounds().pa.h;
//                         let min_lat=map.getBounds().pa.g;
//                         let max_lng=map.getBounds().ka.h;
//                         let min_lng=map.getBounds().ka.g;
//                         let filtered_data=usDataSample.filter(function(d){
//                             return (d.Longitude>min_lng && d.Longitude<max_lng && d.Latitude>min_lat && d.Latitude<max_lat);
//                         });
//
//                         marker_plot_zoom(filtered_data);
//
//
//                         d3.selectAll('.tooltip').remove()
//                     }
//                     else {
//                         d3.selectAll('.marker').remove();
//                         d3.selectAll('.tooltip').remove();
//                     }
//
//
//                     function transform(d) {
//                         d = new google.maps.LatLng(+d.Latitude, +d.Longitude);
//                         d = projection.fromLatLngToDivPixel(d);
//                         return d3.select(this)
//                             .style("left", (d.x - padding) + "px")
//                             .style("top", (d.y - padding) + "px")
//                     }
//                 };
//             };
//             overlay.setMap(map);}
//
//
//         function heatmap_plot(){
//             let heatmap = new google.maps.visualization.HeatmapLayer({
//                 data: heatMapData,
//                 dissipating: true,
//                 opacity: 0.8,
//                 radius:20
//             });
//             heatmap.setMap(map);
//         }
//         heatmap_plot();
//         document.getElementById("defView").addEventListener("click", function(){
//             map.setZoom(12);
//             map.setCenter({
//                 lat: 37.76,
//                 lng: -122.6,
//             },);
//         });
//         document.getElementById("zoomView").addEventListener("click", function(){
//             map.setZoom(18);
//             map.setCenter({
//                 lat: 37.788065,
//                 lng: -122.403921,
//             },);
//         });
//
//     }
//
//     // googleMap(data);
//
//
//     let layer1 =L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
//         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//         maxZoom: 20,
//         id: 'mapbox.streets',
//         accessToken: 'pk.eyJ1IjoibXJzaGVpIiwiYSI6ImNrMndybnJxNDA0NzAzZG8zdW16bWZuNjEifQ.MvgZUZVOBhLpdLg3-NtSyQ'
//     });
//
//     // var marker = L.marker([37.76, -122.45]).addTo(mymap);
// //     let circle=Array();
// //     for (let i = 0; i < data.length; ++i) {
// //     L.circle([data[i].Latitude, data[i].Longitude], {
// //
// //     color: 'red',
// //     fillColor: '#f03',
// //     fillOpacity: 0.5,
// //     // radius: 500
// // }).addTo(mymap);
// //     }
//
//     let usDataSample=data.filter(function(d,i){
//         return i<1000;
//     });
//
//     let rgbToHex = function (rgb) {
//         let hex = Number(rgb).toString(16);
//         if (hex.length < 2) {
//             hex = "0" + hex;
//         }
//         return hex;
//     };
//     let fullColorHex = function (r, g, b) {
//
//         let red = rgbToHex(r);
//         let green = rgbToHex(g);
//         let blue = rgbToHex(b);
//         return red + green + blue;
//
//     };
//     var pointsGroup = L.layerGroup();
//     usDataSample.forEach(function(d){
//         L.circle([d.Latitude, d.Longitude], {
//
//     color: ('#' + fullColorHex(255, Math.round(255 - d.DamageRatio * 255), 0)),
//     fillColor:  ('#' + fullColorHex(255, Math.round(255 - d.DamageRatio * 255), 0)),
//     fillOpacity: 0.5,
//          achieve: d.DamageRatio
//     // radius: 500
//
// }).on("mouseover", onMouseOver)
//
//             .on("mouseout", onMouseOut).addTo(pointsGroup);
//         // binding data to marker object's option
//         // L.marker([d.Latitude, d.Longitude], { achieve: d.DamageRatio })
//         //     .on("mouseover", onMouseOver)
//         //     .on("mouseout", onMouseOut)
//         //     .addTo(pointsGroup);
//     });
//     // let map = L.map('mapDiv').setView(, 12);
//
//     // var baseLayers = {
//     //         "osm": layer1,
//     //         "thunderforest": layer2
//     //     },
//         subLayers = { "USGS": layer1, "Points": pointsGroup };
//
//     var map = L.map("mapDiv", {
//         center: [37.76, -122.45],
//         zoom: 12,
//         layers: [layer1, pointsGroup]
//     });
//
//     L.control.layers(subLayers).addTo(map);
//
//
//
//     function onMouseOver(e){
//         var point = map.latLngToContainerPoint(e.latlng);
//         var tooltip = d3.select('#mapDiv')
//             .append("div")
//             .attr("class", "tooltip")
//             // Calculating according to marker and tooltip size
//             // .style({ left: point.x - 40 + "px", top: point.y - 80 - 41 + "px" })
//                 .style("left", point.x - 40 + "px")
//                 .style("top", point.y - 40 - 41 + "px" )
//             ;
//         getPie(e.target.options.achieve);
//     }
//     function onMouseOut(e){
//         d3.select(".tooltip").remove();
//     }
//     function getPie(value){
//         var size = 70;
//         var arc = d3.arc().outerRadius(size / 2).innerRadius(size / 3),
//             pie = d3.layout.pie().sort(null);
//
//         d3.select('.tooltip').append("svg")
//             .attr('width',size).attr('height',size)
//             .append("g")
//             .attr("transform", "translate(" + [size / 2, size / 2] + ")")
//             .call(function(s){
//                 s.append("text")
//                     .text(d3.format(".2p")(value))
//                     .style("font", "12px")
//                     .attr({ "text-anchor": "middle", "alignment-baseline": "central" });
//             })
//             .selectAll("path")
//             .data(pie([value, 1 - value]))
//             .enter()
//             .append("path")
//             .attr({
//                 d: arc,
//                 fill: function(d,i){ return i ? "gray" : "red"; }
//             });
//     }
//
//
//
//
//
//     // circle.addTo(mymap);
//     // var circle = L.circle([37.76, -122.45], {
//     //
//     //     color: 'red',
//     //     fillColor: '#f03',
//     //     fillOpacity: 0.5,
//     //     // radius: 500
//     // }).addTo(mymap);
//
// }




