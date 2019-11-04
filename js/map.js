async function mapoverlay(data) {
    async function googleMap(data) {



        let options = {
            zoom: 0,
            center: {
                lat: 37.76,
                lng: -122.45,
            },
            mapTypeId: 'roadmap',
            minFTZoomLevel: 10

        };


        let map = new google.maps.Map(d3.select("#mapDiv").node(), options);

         let   tileListener = google.maps.event.addListener(map,'tilesloaded',fixMyPageOnce);

        function fixMyPageOnce(){
            for (let i = 0; i < 13; ++i) {
                map.setZoom(i)        }
            console.log('hi')
            google.maps.event.removeListener(tileListener);
        }
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

        let overlay = new google.maps.OverlayView();





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

                    let circleScale = d3.scaleLinear()
                        .domain([d3.min(usDataSample, d => d.Stories),
                            d3.max(usDataSample, d => d.Stories)])
                        .range([3, 13*(Math.pow(map.zoom/12,2))]);
                    function marker_plot_zoom (){ let marker = layer.selectAll('svg')
                        .data(usDataSample.filter(function (d) {
                            return (d.Longitude > map.getBounds().ka.g && d.Longitude < map.getBounds().ka.h && d.Latitude > map.getBounds().oa.g && d.Latitude < map.getBounds().oa.h);
                        }));

                        let markerEnter = marker.enter().append("svg");

                        markerEnter.append("circle");

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

                        marker.select("circle")
                            .attr("r", d => circleScale(d.Stories))
                            .attr("cx", padding)
                            .attr("cy", padding)
                            .attr("stroke", 'black')
                            .attr("stroke-width", 1)
                            .style('opacity', .8)
                            .attr('fill', d => '#' + fullColorHex(255, Math.round(255 - d.DamageRatio * 255), 0))
                    }

                    function heatmap_plot_zoom (){
                        let tooltip = layer2.selectAll('svg')
                            .data(usDataSample.filter(function(d){
                                return (d.Longitude>map.getBounds().ka.g && d.Longitude<map.getBounds().ka.h && d.Latitude>map.getBounds().oa.g && d.Latitude<map.getBounds().oa.h);
                            }));

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
                        heatmap_plot_zoom()
                        marker_plot_zoom()

                    }
                    else if (map.zoom>15.5){
                        marker_plot_zoom()

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
                            .style("top", (d.y - padding) + "px");
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



