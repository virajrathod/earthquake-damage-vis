
d3.csv("data/EQ_data_updated-2.csv").then( data => {

    // Create hierarchy dataset for Sunburst Zoom (Natalia)
    const sunburst = new Sunburst(data);
    const hierarchy = sunburst.createHierarchy();
    sunburst.drawChart(hierarchy);
    
    // Setup data for Scatterplot (Viraj)

    drawPlot(data)
    updatePlot()
    drawDropDown()
    tooltipRender()

    // Setup data for Map (Reza)

    const map=new mapClass(data);
    // const mapPlot=map.mapoverlay();


})



