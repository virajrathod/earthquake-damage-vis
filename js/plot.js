function drawPlot(data){

    console.log("Test");
   //width and height
		var w = 600;
		var h = 400;
		var padding = 40;

			//data.forEach(function(d) {
			//dataset.push(d.precipitation);
			return {
				//max: d.Maximum,
				//min: d.Minimum,
				//month: d.Month,
				// precipitation: d.Precipitation
				//speed: d.Speed,
				//state: d.State,
				//year: d.Year
			};
		// }, function(d) {
		// 	dataset.push(d.precipitation);
		// });



		var temp;
		var string;
		for(var i = 0; i < numBars; i++) {
			string = dataset.get(i);
			state = states.get(i);
			temp = {state: string};
			dataset.push(temp);
		}

		//var dataset = data.slice(0, numBars + 1);
		//max vs min

		//scale function
		var xScale = d3.scaleLinear()
			//.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
			.domain([0, d3.max(dataset, function(d) { return d[0]; })])
			//.range([padding, w-padding * 2]);
			.range([padding, w - padding * 2]);

		var yScale = d3.scaleLinear()
			.domain([0, d3.max(dataset, function(d) { return d[1]; })])
			//.range([padding, w-padding * 2]);
			.range([h - padding, padding]);

		var xAxis = d3.axisBottom().scale(xScale).ticks(5);

		var yAxis = d3.axisLeft().scale(yScale).ticks(5);

		//create svg element
		var svg = d3.select(".scatterplot")
					.append("svg")
					.attr("width", w)
					.attr("height", h)

		// svg.selectAll(".scatterplot")
		// 	.data(data)
		// 	.enter()
		// 	.append("circle")
		// 	.attr("cx", function(d) {
		// 		return xScale(d[0]);
		// 	})
		// 	.attr("cy", function(d) {
		// 		return h - yScale(d[1]);
		// 	})
		// 	.attr("r", 5)
		// 	.attr("fill", "green");

		//x axis
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h - padding) + ")")
			.call(xAxis);

		//y axis
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + padding + ", 0)")
			.call(yAxis);

};