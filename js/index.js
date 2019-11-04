d3.csv("data/EQ_data_updated.csv").then( data => {
    console.log(data)

    // Create hierarchy dataset for Sunburst Zoom (Natalia)

    // Setup data for Scatterplot (Viraj)

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 860 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 4000])
        .range([ 0, width ]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    //   const svg = d3.select("svg");
    var y = d3.scaleLinear()
        .domain([0, 500])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Latitude); } )
        .attr("cy", function (d) { return y(-(d.Longitude)); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")




    // Setup data for Map (Reza)

    mapoverlay(data)

})
