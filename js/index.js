/**
 * Reads data from CSV file.
 * The file contains 20,000 entries of individual building data that tells information about 
 * the structural damages and costs of a 7.0 magnitude earthquake in San Francisco
 */
d3.csv("data/EQ_data_updated-2.csv").then( data => {

    let currVisualization = "sunburst";

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
        updateHighlight(null)
    }, true);

    // Create hierarchy dataset for Sunburst Zoom (Natalia)
    const sunburst = new Sunburst(data, map);

    // Event listener to switch between data visualizations
    const sunburstTab = d3.select("#sunburst-link");
    const scatterplotTab = d3.select("#scatterplot-link");
    sunburstTab.on("click", drawSunburst);
    scatterplotTab.on("click", drawScatterplot);

    // Helper function that draws sunburst if it isn't drawn already
    function drawSunburst() {
        if (currVisualization === "sunburst") 
            return;
        else {
            sunburst.drawSunburst(); 
            currVisualization = "sunburst";
        }
    }

    // Helper function that draws scaterplot if it isn't drawn already
    function drawScatterplot() {
        if (currVisualization === "scatterplot")
            return;
        else {
            scatter.drawPlot();
            currVisualization = "scatterplot";
        } 
    }
    
});



