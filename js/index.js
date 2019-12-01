d3.csv("data/EQ_data_updated-2.csv").then( data => {

    // Setup data for Map (Reza)

    function filterMap(data){
        map.updateMap(data)
    }
    function updateHighlight(point){
        if (point==null){
            d3.selectAll('.leaflet-interactive').classed('SClass',false);
            d3.selectAll('.SC_circles').classed('SClass',false);
        } else{
            map.Map_focus(point);
            d3.selectAll('.leaflet-interactive').classed('SClass',false);
            function myfunction(){d3.selectAll('.C'+point['BuildingId']).classed('SClass',true);}
            setTimeout(myfunction, 1000);
            d3.selectAll('.SC_circles').classed('SClass',false);
            d3.select('#SC'+point['BuildingId']).classed('SClass',true);
        }
    }
    const scatter=new GapPlot(data,updateHighlight,filterMap);
    const map=new mapClass(data,updateHighlight);

    document.addEventListener("click", function() {
        // map.updateMap(data)
        updateHighlight(null)
    }, true);

    // Create hierarchy dataset for Sunburst Zoom (Natalia)
    const sunburst = new Sunburst(data, map);
});



