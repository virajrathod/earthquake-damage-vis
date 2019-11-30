function drawPlot(data){

    // console.log("Test");

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
            .text('Circle Color');

         cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

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

function updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {

	// console.log(xIndicator, yIndicator)

    /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         *
         * @param d the data value to encode
         * @returns {number} the radius
         */
     let circleSizer = function(d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };

        // ++++++++ BEGIN CUT +++++++++++
        let populationData = this.data.population;
        let that = this;
        this.activeYear = activeYear;

        let tooltip = d3.select('.tooltip');

        let xData = this.data[xIndicator];

        let yData = this.data[yIndicator];

        let sizeData = this.data[circleSizeIndicator];

        let plotData = xData.map(d => {
            // console.log(xData);
            //gets the y value
            //  let yvalue = yData.filter((val) => d.country === val.country)[0][this.activeYear];
            let yValue = yData.find((val) => d.country === val.country) ? yData.find((val) => d.country === val.country)[this.activeYear] : null;

            // Sizes the circle for the plot. Selected from the dropdown
            let circ = sizeData.filter((val) => d.country === val.country);
            let circleSize = circ.length > 0 ? circ[0][this.activeYear] : null;

            //This adds region to the country data
            let reg = populationData.filter(p => d.country === p.country);
            let region = reg.length > 0 ? reg = reg[0].region : null;

            if (yValue != null || region != null) {
                return new PlotData(d.country, d[this.activeYear], yValue, d.geo.toUpperCase(), region, circleSize);
            } else {
                return null;
            }
        });

    plotData = plotData.filter(p => p != null);

	/**
	 * Finds the max for the specified data
	 * @param dataOb
	 * @returns {*|number}
	 */
	function findMax(dataOb) {
		let totalMax = d3.max(dataOb.map(m => {
			let val = Object.values(m).filter(v => typeof v === 'number');
			let max = d3.max(val);
			return max;


		}));
		return totalMax;
	}

	/**
	 * Finds the min for the specified data
	 * @param dataOb
	 * @returns {number | *}
	 */
	function findMin(dataOb) {
		let totalMin = d3.min(dataOb.map(m => {
			let val = Object.values(m).filter(v => typeof v === 'number');
			let min = d3.min(val);
			return min;
		}));
		return totalMin;
	}

	 //Find the max for the X and Y data
        let maxX = findMax(xData);
        let maxY = findMax(yData);

        //Find the min and max size for the circle data
        let maxSize = findMax(sizeData);
        let minSize = findMin(sizeData);

        let xScale = d3.scaleLinear().range([0, this.width]).domain([0, maxX]).nice();
        let yScale = d3.scaleLinear().range([this.height, 0]).domain([0, maxY]).nice();

        let group = d3.select('#chart-view').select('.plot-svg').select('.wrapper-group');

        group.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        let yearBg = group.select('.activeYear-background').text(this.activeYear);

        let axisXLabel = d3.select('.axis-label-x')
            .text((xData[0].indicator_name.toUpperCase()))
            .style("text-anchor", "middle")
            .attr('transform', 'translate(' + (this.width / 2) + ', ' + (this.height + 35) + ')');

        d3.select('.axis-label-y')
            .text((yData[0].indicator_name.toUpperCase()))
            .style("text-anchor", "middle")
            .attr('transform', 'translate(' + -50 + ', ' + (this.height / 2) + ')rotate(-90)');

        //Add the x and y axis
        let xAxis = d3.select('.x-axis')
            .call(d3.axisBottom(xScale));

        let yAxis = d3.select('.y-axis')
            .call(d3.axisLeft(yScale));

        //Add the countries as circles
        let circles = group.selectAll('circle').data(plotData);

        circles.exit().remove();

        let circleEnter = circles
            .enter().append('circle');

        circles = circleEnter.merge(circles);

        //Add the country region as class to color
        circles.attr("class", (d) => d.region)
            .classed('bubble', true);

        circles.attr("r", (d) => circleSizer(d))
            .attr("cx", function(d) {
                return xScale(+d.xVal);
            })
            .attr("cy", function(d) {
                return yScale(+d.yVal);
            });

        //Add the tooltip labels on mouseover
        circles.on('mouseover', function(d, i) {
            //show tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(that.tooltipRender(d) + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        });
        //hover function for country selection
        circles.on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

        //Click function for circle selection
        circles.on('click', (d) => {
            let countryID = { id: d.id, region: d.region };
            that.clearHighlight();
            that.updateCountry(countryID);
        });

        if (this.activeCountry) {
            that.updateHighlightClick(activeCountry);
        }

        this.drawLegend(minSize, maxSize);
        this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);

        // ++++++++ END CUT +++++++++++

    };

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    function drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {
        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

         /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function(d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function(d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function(d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

    };

    function drawLegend(min, max) {

        //This has been done for you but you need to call it in updatePlot()!
        //Draws the circle legend to show size based on health data
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    };

    function tooltipRender(data) {
        let text = "<h2>" + data['country'] + "</h2>";
        return text;
    };