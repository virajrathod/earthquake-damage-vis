function mapoverlay(data) {
    async function googleMap(data) {


        let googleMapStyles = await d3.json("js/mapStyle.json");
        let options = {
            zoom: 7,
            center: {
                lat: 37.76,
                lng: -122.52,
            },
            mapTypeId: 'roadmap',
            styles: googleMapStyles,
            gestureHandling: 'greedy'
        };


        let map = new google.maps.Map(d3.select("#mapDiv").node(), options);

        let   tileListener = google.maps.event.addListener(map,'tilesloaded',fixMyPageOnce);

        function fixMyPageOnce(){
            let cnt=13.5;
            function chng(map,cnt) {
                if (cnt>7){
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


                    let heightScale = d3.scaleLinear()
                        .domain([d3.min(usDataSample, d => +d.Stories),
                            d3.max(usDataSample, d => +d.Stories)])
                        .range([10, 40]);
                    let widthScale = d3.scaleLinear()
                        .domain([d3.min(usDataSample, d => +d['Area(m2)']),
                            d3.max(usDataSample, d => +d['Area(m2)'])])
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
                            .attr("width", d => widthScale(d['Area(m2)']))
                            .attr("x", padding)
                            .attr("y", padding)
                            .attr("stroke", 'black')
                            .attr("stroke-width", 1)
                            .style('opacity', .8)
                            .attr('fill', d => '#' + fullColorHex(255, Math.round(255 - d.DamageRatio * 255), 0))
                    }
                    function precise(x) {
                        return Number.parseFloat(x).toPrecision(2);
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
                            .attr("width", 150)
                            .attr("height", 50)
                            .attr("x", d => widthScale(d['Area(m2)'])+padding)
                            .attr("y", padding)
                            .style('opacity', .8)
                            .attr('fill','white')
                            .attr('stroke','black');


                        tooltip.select(".line1").classed('text_lines',true)
                            .attr("x", d => widthScale(d['Area(m2)'])+20)
                            .attr("y", 23)

                            .text(d=> 'DamageRatio: '+precise(d.DamageRatio));

                        tooltip.select(".line2").classed('text_lines',true)
                            .attr("x", d => widthScale(d['Area(m2)'])+20)
                            .attr("y", 38)
                            .text(d=> 'Stories: '+d.Stories);
                        tooltip.select(".line3").classed('text_lines',true)
                            .attr("x", d => widthScale(d['Area(m2)'])+20)
                            .attr("y", 53)
                            .text(d=> 'Safety Tag: '+ (d.SafetyTag))

                    }

                    if (map.zoom>17.5) {

                        let max_lat=map.getBounds().pa.h
                        let min_lat=map.getBounds().pa.g
                        let max_lng=map.getBounds().ka.h
                        let min_lng=map.getBounds().ka.g
                        let filtered_data=usDataSample.filter(function(d){
                            return (d.Longitude>min_lng && d.Longitude<max_lng && d.Latitude>min_lat && d.Latitude<max_lat);
                        })

                        heatmap_plot_zoom(filtered_data)
                        marker_plot_zoom(filtered_data)
                    }

                    else if (map.zoom>15.5){

                        let max_lat=map.getBounds().pa.h
                        let min_lat=map.getBounds().pa.g
                        let max_lng=map.getBounds().ka.h
                        let min_lng=map.getBounds().ka.g
                        let filtered_data=usDataSample.filter(function(d){
                            return (d.Longitude>min_lng && d.Longitude<max_lng && d.Latitude>min_lat && d.Latitude<max_lat);
                        })

                        marker_plot_zoom(filtered_data)


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
        heatmap_plot();
        document.getElementById("defView").addEventListener("click", function(){
            map.setZoom(12)
            map.setCenter({
                lat: 37.76,
                lng: -122.6,
            },);
        });
        document.getElementById("zoomView").addEventListener("click", function(){
            map.setZoom(18)
            map.setCenter({
                lat: 37.788065,
                lng: -122.403921,
            },);
        });

    }

    googleMap(data);


}




