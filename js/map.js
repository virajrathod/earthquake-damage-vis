/**
 * Loads earthquake damage map visualization showing and overview or
 * specific view of earthquake damage in San Francisco. 
 * Displays color coded heatmap to show damage severity, labels for specific structural damage data,
 * and dropdown options to change data displayed by heat map.
 * Hovering over bubbles shows geographic location indicated by that bubble.
 * Map APIS used are from Google, OpenStreetMap and MapBox.
 */
class mapClass {
    /**
     * Stores 20,000 building data objects from file and draws the
     * dropdown menu option
     * @param {*} data 
     * @param {*} updateHighlight 
     */
    constructor(data,updateHighlight) {
        let usDataSample = data.filter(function (d, i) {
            return i < 20000;
        });
        this.dropdown(data,usDataSample);
        this.mapoverlay(usDataSample);
        this.updateHighlight=updateHighlight;
        this.data=data;
    }

    /**
     * Transforms RGB to hex value
     * @param {*} rgb 
     */
    rgbToHex (rgb) {
        let hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    /**
     * Returns a full color hex value
     * @param {*} r 
     * @param {*} g 
     * @param {*} b 
     */
    fullColorHex (r, g, b) {

        let red = this.rgbToHex(r);
        let green = this.rgbToHex(g);
        let blue = this.rgbToHex(b);
        return red + green + blue;

    };

    /**
     * Draws dropdown menu for map legend
     * @param {*} data 
     * @param {*} usDataSample 
     */
    dropdown(data,usDataSample) {
        let dropdownWrap = d3.select('#floating-panelM'); //.append('div').classed('dropdown-wrapper', true);
        let yWrap = dropdownWrap.append('div').classed('dropdown-block', true);

        yWrap.append('div').classed('c-labelM', true)
            .append('text')
            .text('Color coding by:');

        yWrap.append('div').attr('id', 'dropdown_m').classed('dropdownM', true).append('div').classed('dropdown-contentM', true)
            .append('select').attr('id','DropDownMap');

        let that = this;

        for (let key in data) {
            if (key === 'length' || !data.hasOwnProperty(key)) continue;
            var dropData = data[key];

        }

        let dropC = dropdownWrap.select('#dropdown_m').select('.dropdown-contentM').select('select');

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

    /**
     * Draws the map by making API calls for geographical data
     * @param {*} data 
     */
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

        let code='DamageRatio';
        let pointsGroup = L.markerClusterGroup({
            disableClusteringAtZoom:16,
            spiderfyOnMaxZoom: false}).on('clustermouseover', function (a) {

        });
        data.forEach(function (d) {

            let circle=L.shapeMarker([d.Latitude, d.Longitude], {
                shape:'triangle-down',
                color: 'black',
                fillColor: ('#' + that.fullColorHex(255, Math.round(255 - d[code] * 255), 0)),
                fillOpacity: 0.9,
                achieve: d[code],
                radius: 8,
                className: 'C'+d['BuildingId'],
                bId:d['BuildingId'],
                weight: 0,
                rotationAngle: 45
            }).bindPopup(code+': '+d[code]).on("mouseover" ,function(ev) {
                circle.setStyle({
                    weight: 2,
                    radius: 20,
                });
                ev.target.openPopup();
            }).on("click" ,function(d) {

                let tmp2=(data.filter(function (d, i) {
                    return d['BuildingId']==circle.options.bId;
                }));
                that.updateHighlight(tmp2[0])
            })

                .on("mouseout",function(ev) {
                    circle.setStyle({
                        weight: 0,
                        radius: 8
                    });
                    ev.target.closePopup();
                })
                .addTo(pointsGroup);
        });
        let heatPoints=Array();
        for (let i = 0; i < data.length; ++i) {
            heatPoints.push([data[i].Latitude, data[i].Longitude, data[i][code]])
        }
        let heat = L.heatLayer(
            heatPoints

            , {radius: 20,
                max: 1
                // minOpacity: 0.2
            });

        let layerLabels = L.esri.basemapLayer('DarkGray');


        this.map = L.map("mapDiv", {
            center: [37.81, -122.45],
            zoomSnap: 0.5,
            zoom: 11.5,
            layers: [layerLabels, pointsGroup,heat]
        });

        let baseLayers = {
            "Dark Gray": layerLabels,
            "USGS": layer1,
            "Satellite": googleSat,
        }
        let subLayers = {"Points": pointsGroup,
            'Heatmap': heat
        };


        let layerControl=L.control.layers(baseLayers, subLayers, {position: "topright"}).addTo(this.map);

        let pulsingIcon = L.icon.pulse({iconSize:[30,30],color:'red'})
        let marker = L.marker([37.9055, -122.3194],{icon: pulsingIcon}).addTo(this.map);
        marker.bindPopup('M7.0 Earthquake <br/>Epicenter')
        marker.on("mouseover" ,function(ev) {
            ev.target.openPopup();        })
        marker.on("mouseout" ,function(ev) {
            ev.target.closePopup();        })

        document.getElementById("defView").addEventListener("click", function () {
            that.map.setView([37.81, -122.45], 11.5);
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
        this.heat=heat;
        this.layerControl=layerControl;

    }

    /**
     * Updates labels and heat points of the map to only display for the 
     * passed in building data
     * @param {*} data 
     */
    updateMap(data){
        console.log("updating map", data)
        let e = document.getElementById("DropDownMap");
        let code=e.options[e.selectedIndex].value;
        this.map.removeLayer(this.pointsGroup);
        this.map.removeLayer(this.heat);
        this.layerControl.removeLayer(this.pointsGroup);
        this.layerControl.removeLayer(this.heat);
        let that=this;
        let pointsGroup = L.markerClusterGroup({
            disableClusteringAtZoom:16,
            spiderfyOnMaxZoom: false});
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
                    className: 'C'+d['BuildingId'],
                    weight: 0,
                    bId:d['BuildingId'],

                    rotationAngle: 45
                }).bindPopup(code+': '+d[code]).on("mouseover" ,function(ev) {
                    circle.setStyle({
                        weight: 2,
                        radius: 20,
                    });
                    ev.target.openPopup();
                }).on("click" ,function(d) {

                    let tmp2=(data.filter(function (d, i) {
                        return d['BuildingId']==circle.options.bId;
                    }));
                    that.updateHighlight(tmp2[0])
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
                    className: 'C'+d['BuildingId'],
                    bId:d['BuildingId'],

                    weight: 0,
                    rotationAngle: 45
                }).bindPopup(code+': '+d[code]).on("mouseover" ,function(ev) {
                    circle.setStyle({
                        weight: 2,
                        radius: 20,
                    });
                    ev.target.openPopup();
                }).on("click" ,function(d) {

                    let tmp2=(data.filter(function (d, i) {
                        return d['BuildingId']==circle.options.bId;
                    }));
                    that.updateHighlight(tmp2[0])
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
        let heatPoints=Array();
        for (let i = 0; i < data.length; ++i) {
            heatPoints.push([data[i].Latitude, data[i].Longitude, data[i][code]])
        }

        let heat = L.heatLayer(
            heatPoints

            , {radius: 20,
                max: 1*code_max
            });

        if (code=='SafetyTag'){
            d3.select('#legText1').text(code+': Unsafe');
            d3.select('#legText2').text(code+': Safe');
        } else{
            d3.select('#legText1').text(code+': '+d3.max(data, d => +d[code]));
            d3.select('#legText2').text(code+': '+d3.min(data, d => +d[code]));
        }


        pointsGroup.addTo(this.map);
        heat.addTo(this.map);

        this.pointsGroup=pointsGroup;
        this.heat=heat;
        this.layerControl.addOverlay(pointsGroup , "Points");
        this.layerControl.addOverlay(heat , "Heatmap");
    }

    /**
     * Focuses view on map to a specific latitude and longitude location
     * @param {*} point 
     */
    Map_focus(point){
        let that=this;
        that.map.setView([point.Latitude, point.Longitude], 16);
    }

}

