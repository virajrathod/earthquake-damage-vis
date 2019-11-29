
d3.csv("data/EQ_data_updated-2.csv").then( data => {

    // Create hierarchy dataset for Sunburst Zoom (Natalia)
    const sunburst = new Sunburst(data);
    const hierarchy = sunburst.createHierarchy();
    sunburst.drawChart(hierarchy);

    // Setup data for Scatterplot (Viraj)

    // drawPlot(data)
    // updatePlot()
    // drawDropDown()
    // tooltipRender()

    // Setup data for Map (Reza)

function filterMap(data){
    maP.updateMap(data)
}
    function updateHighlight(point){
        if (point==null){
            d3.selectAll('.leaflet-interactive').classed('SClass',false);
            d3.selectAll('.SC_circles').classed('SClass',false);
        } else{
            maP.Map_focus(point);
            d3.selectAll('.leaflet-interactive').classed('SClass',false);
            function myfunction(){d3.selectAll('.C'+point['BuildingId']).classed('SClass',true);}
            setTimeout(myfunction, 1000);
            d3.selectAll('.SC_circles').classed('SClass',false);
            d3.select('#SC'+point['BuildingId']).classed('SClass',true);
        }
    }
    const scatter=new GapPlot(data,updateHighlight,filterMap);
    const maP=new mapClass(data,updateHighlight);
    // const mapPlot=map.mapoverlay();

    document.addEventListener("click", function() {
        maP.updateMap(data)
        updateHighlight(null)
    }, true);
});



