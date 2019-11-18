function drawPlot(data){

    console.log("Test");

   //width and height
	const width = 932;
	let padding = 40;
		let w = width-padding;
		let h = width-padding;


	const svg = d3.select("#dataviz-scatterplot").append("svg");
		svg.attr("viewBox", [0, 0, width, width])
		.style("margin", "2rem")
		.style("font", "10px sans-serif");

		// scale function
		let xScale = d3.scaleLinear()
					//.domain(["Alabama","Alaska","Arizona","Arkansas","California"])
					.domain([0, d3.max(data, function(d) { return d.DamageRatio; })])
					//.range([padding, w-padding * 2]);
					.range([padding, w  ]);

		let yScale = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return d['Area(m2)']; })])
					//.range([padding, w-padding * 2]);
					.range([h - padding, padding]);

		let xAxis = d3.axisBottom().scale(xScale).ticks(5);

		let yAxis = d3.axisLeft().scale(yScale).ticks(5);




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



		     /* This is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#dataviz-scatterplot').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

};