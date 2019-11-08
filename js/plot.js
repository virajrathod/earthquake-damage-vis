function drawPlot(data){

    console.log("Test");
   //width and height
	const width = 932;
	var padding = 40;
		var w = width-padding;
		var h = width-padding;


	const svg = d3.select("#dataviz-scatterplot").append("svg");
		svg.attr("viewBox", [0, 0, width, width])
		.style("margin", "2rem")
		.style("font", "10px sans-serif");
			//data.forEach(function(d) {
			//dataset.push(d.precipitation);
			// return {
				//max: d.Maximum,
				//min: d.Minimum,
				//month: d.Month,
				// precipitation: d.Precipitation
				//speed: d.Speed,
				//state: d.State,
				//year: d.Year
			// };
		// }, function(d) {
		// 	dataset.push(d.precipitation);
		// });



		// var temp;
		// var string;
		// for(var i = 0; i < numBars; i++) {
		// 	string = dataset.get(i);
		// 	state = states.get(i);
		// 	temp = {state: string};
		// 	dataset.push(temp);
		// }

		//var dataset = data.slice(0, numBars + 1);
		//max vs min
		//create svg element

		// const svg = d3.select('#scatterPlot')
		// 			.attr("width", w)
		// 			.attr("height", h);

		// scale function
		var xScale = d3.scaleLinear()
					//.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
					.domain([0, d3.max(data, function(d) { return d.DamageRatio; })])
					//.range([padding, w-padding * 2]);
					.range([padding, w  ]);

		var yScale = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return d['Area(m2)']; })])
					//.range([padding, w-padding * 2]);
					.range([h - padding, padding]);

		var xAxis = d3.axisBottom().scale(xScale).ticks(5);

		var yAxis = d3.axisLeft().scale(yScale).ticks(5);




		let circles = svg.selectAll(".scatterPlot")
			.data(data)
			.enter()
			.append("circle")
			.attr("cx", function(d) {
					return d.DamageRatio*(width-2*padding)+padding;
			})
			.attr("cy", function(d) {
				return d['Area(m2)']/80;
			})
			.attr("transform", "translate(0,"+(width-2*padding)+"),scale(1,-1)")
			.attr("r", 5)
			.attr("fill", "green");
			circles.on('click', (function (d) {
				console.log(d)
			}));

		// x axis
		svg.append("g")
			// console.log("TTT")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h - padding) + ")")
			.call(xAxis);

		//y axis
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis);

};