d3.csv("data/EQ_data_updated.csv").then( data => {
    console.log(data)

    // Create hierarchy dataset for Sunburst Zoom (Natalia)

    // Setup data for Scatterplot (Viraj)

    drawPlot(data)

    // Setup data for Map (Reza)

    mapoverlay(data)

})
