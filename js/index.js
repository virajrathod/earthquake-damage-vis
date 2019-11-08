
d3.csv("data/EQ_data_updated.csv").then( data => {

    // Create hierarchy dataset for Sunburst Zoom (Natalia)
    const sunburst = new Sunburst(data);
    const hierarchy = sunburst.createHierarchy();
    sunburst.drawChart(hierarchy);
    
    // Setup data for Scatterplot (Viraj)

    drawPlot(data)

    // Setup data for Map (Reza)

    mapoverlay(data)

})



