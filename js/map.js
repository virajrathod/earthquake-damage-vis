function mapoverlay(data) {
    async function googleMap(data) {
        let maxlat=d3.max(data, d => +d.Latitude);
        let maxlng=d3.max(data, d => +d.Longitude);
        let minlat=d3.min(data, d => +d.Latitude);
        let minlng=d3.min(data, d => +d.Longitude);

        let lngs=Array();
        let lats=Array();

        for (let i = 0; i < 20; ++i) {
            lngs.push(minlng+i*(maxlng-minlng)/20);
            lats.push(minlat+i*(maxlat-minlat)/20);
        }

        let googleMapStyles = await d3.json("js/mapStyle.json");
        let options = {
            zoom: 7,
            center: {
                lat: 37.76,
                lng: -122.45,
            },
            mapTypeId: 'roadmap',
            minFTZoomLevel: 10,
            styles: googleMapStyles
        };


        let map = new google.maps.Map(d3.select("#mapDiv").node(), options);

        let   tileListener = google.maps.event.addListener(map,'tilesloaded',fixMyPageOnce);

        function fixMyPageOnce(){
            console.log('load')
            let cnt=12;
            function chng(map,cnt) {
                if (cnt>7){
                    // console.log(cnt)
                    chng(map,cnt-1)
                };
                setTimeout(map.setZoom(cnt-1), 100)
            }
            chng(map,cnt)
            google.maps.event.removeListener(tileListener);
        }
        setTimeout(map.setZoom(7), 1)
        // var infowindow = new google.maps.InfoWindow({
        //     content: 'Change the zoom level',
        //     position: {
        //         lat: 37.76,
        //         lng: -122.45,
        //     }
        // });
        // infowindow.open(map);

        map.addListener('zoom_changed', function() {
            marker_plot()
        });


        let usDataSample = data;

        let heatMapData=Array();
        for (let i = 0; i < usDataSample.length; ++i) {
            heatMapData.push({location: new google.maps.LatLng(usDataSample[i].Latitude, usDataSample[i].Longitude), weight: Math.pow(usDataSample[i].DamageRatio,1)})
        }

        let overlay = await new google.maps.OverlayView();

        function marker_plot(){
            overlay.onAdd = function () {

                let layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                    .attr("class", "marker_div");

                let layer2 = d3.select(this.getPanes().overlayMouseTarget).append("div")
                    .attr("class", "tooltipClass");

                overlay.onRemove = function () {
                    d3.select('.marker_div').remove();
                    d3.select('.tooltipClass').remove();
                };
                overlay.draw = function () {

                    let projection = this.getProjection(),
                        padding = 10;

                    // let circleScale = d3.scaleLinear()
                    //     .domain([d3.min(usDataSample, d => d.Stories),
                    //         d3.max(usDataSample, d => d.Stories)])
                    //     .range([3, 13*(Math.pow(map.zoom/12,2))]);
                    let heightScale = d3.scaleLinear()
                        .domain([d3.min(usDataSample, d => +d.Stories),
                            d3.max(usDataSample, d => +d.Stories)])
                        .range([10, 40]);
                    let widthScale = d3.scaleLinear()
                        .domain([d3.min(usDataSample, d => +d.Area),
                            d3.max(usDataSample, d => +d.Area)])
                        .range([10, 20]);

                    function marker_plot_zoom (filtered_data){

                        let marker = layer.selectAll('svg')
                            .data(filtered_data);
                        let markerEnter = marker.enter().append("svg");

                        markerEnter.append("rect");

                        marker.exit().remove();

                        marker = marker.merge(markerEnter);

                        marker
                            .each(transform)
                            .attr("class", "marker");

                        let rgbToHex = function (rgb) {
                            let hex = Number(rgb).toString(16);
                            if (hex.length < 2) {
                                hex = "0" + hex;
                            }
                            return hex;
                        };
                        let fullColorHex = function (r, g, b) {

                            let red = rgbToHex(r);
                            let green = rgbToHex(g);
                            let blue = rgbToHex(b);
                            return red + green + blue;

                        };

                        marker.select("rect")
                            .attr("height", d => heightScale(d.Stories))
                            .attr("width", d => widthScale(d.Area))
                            .attr("x", padding)
                            .attr("y", padding)
                            .attr("stroke", 'black')
                            .attr("stroke-width", 1)
                            .style('opacity', .8)
                            .attr('fill', d => '#' + fullColorHex(255, Math.round(255 - d.DamageRatio * 255), 0))
                    }

                    function heatmap_plot_zoom (filtered_data){
                        let tooltip = layer2.selectAll('svg')
                            .data(filtered_data);

                        let ttEnter = tooltip.enter().append("svg");

                        ttEnter.append("rect").classed('ttrect',true);
                        ttEnter.append("text").classed('line1',true);
                        ttEnter.append("text").classed('line2',true);
                        ttEnter.append("text").classed('line3',true);

                        tooltip.exit().remove();

                        tooltip = tooltip.merge(ttEnter);

                        tooltip
                            .each(transform)
                            .attr("class", "tooltip");

                        tooltip.select("rect")
                            .attr("width", 100)
                            .attr("height", 50)
                            .attr("x", padding)
                            .attr("y", padding)
                            .style('opacity', .8)
                            .attr('fill','white')
                            .attr('stroke','black');


                        tooltip.select(".line1")
                            .attr("x", 20)
                            .attr("y", 20)
                            .attr('fill','black')
                            .text(d=> 'DamageRatio: '+d.DamageRatio);

                        tooltip.select(".line2")
                            .attr("x", 20)
                            .attr("y", 35)
                            .attr('fill','black')
                            .text(d=> 'Stories: '+d.Stories);
                        tooltip.select(".line3")
                            .attr("x", 20)
                            .attr("y", 50)
                            .attr('fill','black')
                            .text(d=> 'Collapsed: '+ (d.Collapsed==1? 'yes':'no'))

                    }

                    if (map.zoom>17.5) {

                        let max_lat=map.getBounds().oa.h
                        let min_lat=map.getBounds().oa.g
                        let max_lng=map.getBounds().ka.h
                        let min_lng=map.getBounds().ka.g
                        let filtered_data=usDataSample.filter(function(d){
                            return (d.Longitude>min_lng && d.Longitude<max_lng && d.Latitude>min_lat && d.Latitude<max_lat);
                        })

                        heatmap_plot_zoom(filtered_data)
                        marker_plot_zoom(filtered_data)
                    }

                    else if (map.zoom>15.5){

                        let max_lat=map.getBounds().oa.h
                        let min_lat=map.getBounds().oa.g
                        let max_lng=map.getBounds().ka.h
                        let min_lng=map.getBounds().ka.g
                        let filtered_data=usDataSample.filter(function(d){
                            return (d.Longitude>min_lng && d.Longitude<max_lng && d.Latitude>min_lat && d.Latitude<max_lat);
                        })

                        marker_plot_zoom(filtered_data)
                        // var t2 = performance.now();
                        // console.log("drawing" + (t2 - t1) + " milliseconds.");

                        d3.selectAll('.tooltip').remove()
                    }
                    else {
                        d3.selectAll('.marker').remove()
                        d3.selectAll('.tooltip').remove()
                    }


                    function transform(d) {
                        d = new google.maps.LatLng(+d.Latitude, +d.Longitude);
                        d = projection.fromLatLngToDivPixel(d);
                        return d3.select(this)
                            .style("left", (d.x - padding) + "px")
                            .style("top", (d.y - padding) + "px")
                        // .style("width", 50 + "px")
                        // .style("height", 50 + "px");
                    }
                };
            };
            overlay.setMap(map);}


        function heatmap_plot(){
            let heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                dissipating: true,
                opacity: 0.8,
                radius:20
            });
            heatmap.setMap(map);
        }
        heatmap_plot()



    }

    googleMap(data);

}



