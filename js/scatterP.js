class GapPlot {


    constructor(data,updateHighlight,filterMap) {
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 600 - this.margin.left - this.margin.right;
        this.height = 550 - this.margin.top - this.margin.bottom;
        this.data = data;

        for (let key in data) {
            if (key === 'length' || !data.hasOwnProperty(key)) continue;
            var dropData = data[key];
        }
        this.dropData=dropData;
        // console.log(dropData);
        let maxvals0 = Array();
        for (let i = 0; i < dropData.length; ++i) {
            maxvals0[dropData[i]]=((d3.max(data, d => +d[dropData[i]])))
        }
        let minvals0 = Object();
        for (let i = 0; i < dropData.length; ++i) {
            minvals0[dropData[i]]=( d3.min(data, d => +d[dropData[i]]))
        }
        this.updateHighlight=updateHighlight;
        this.filterMap=filterMap;
        this.data=data;
        this.maxvals0 = maxvals0;
        this.minvals0 = minvals0;

        this.drawPlot()

    }
    drawPlot(){
        d3.select('#dataviz-scatterplot').append('div').attr('id', 'chart-view');
        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .style("margin", "2rem")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        // d3.select('#chart-view')
        //     .append('div')
        //     .attr("class", "tooltip")
        //     .style("opacity", 0);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        svgGroup.append('g').attr('id', 'axesX');
        svgGroup.append('g').attr('id', 'axesY');
        svgGroup.append('text').attr('id', 'axesXlabel').attr('x',0).attr('y',0)
        svgGroup.append('text').attr('id', 'axesYlabel').attr('x',0).attr('y',0)

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

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
            .attr('transform', 'translate(0, 0)');
        this.updatePlot('DamageRatio', 'GroundAcceleration(m/s2)', 'Stories')

        this.drawDropDown('DamageRatio', 'GroundAcceleration(m/s2)', 'Stories')


    }

    updatePlot(xIndicator, yIndicator, circleSizeIndicator){
        let circleSizer = function (d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);

            return cScale(d);
        };

        let maxvals = [this.maxvals0[circleSizeIndicator], this.maxvals0[xIndicator], this.maxvals0[yIndicator]];
        let minvals = [this.minvals0[circleSizeIndicator], this.minvals0[xIndicator], this.minvals0[yIndicator]];
        let minSize = minvals[0];
        let maxSize = maxvals[0];

        this.drawLegend(minSize, maxSize);

        let xScale = d3.scaleLinear()
            .domain([0, maxvals[1]])
            .range([this.margin.left, this.width+this.margin.left]);


        let xAxis = d3.axisBottom();
        xAxis.scale(xScale);

        let svg9 = d3.select('#axesX').attr("transform", "translate(0,"+(this.height+this.margin.top)+") scale(1,1)");
        svg9.exit().remove();
        svg9 = svg9.enter().merge(svg9);
        svg9.call(xAxis);

        d3.select('#axesXlabel').text(xIndicator.toUpperCase()).attr("transform", "translate("+(this.margin.left+this.width/2)+","+(this.height+this.margin.top+40)+") scale(1,1)");
        d3.select('#axesYlabel').text(yIndicator.toUpperCase()).attr("transform", "translate(20,"+(this.height/2) +") rotate(-90)");


        let yScale = d3.scaleLinear()
            .domain([0, maxvals[2]])
            .range([this.height+this.margin.top, this.margin.top]);


        let yAxis = d3.axisLeft();
        yAxis.scale(yScale);

        let svg10 = d3.select('#axesY').attr("transform", "translate("+this.margin.left+",0) scale(1,1)");
        svg10.exit().remove();
        svg10 = svg10.enter().merge(svg10);
        svg10.call(yAxis);

        let that = this;

        let svgcircle = d3.select('#chart-view').select('.plot-svg').select('.wrapper-group');
        let svgcircle2 = svgcircle.selectAll('circle').data(this.data);
        svgcircle2.exit().remove();

        let svgcircle2Enter = svgcircle2
            .enter().append('circle');

        svgcircle2 = svgcircle2Enter.merge(svgcircle2);

        var plotTooltip = d3.select("body")
        .append("div")
        .attr("class", "sunburst-tooltip")
        .style("visibility", "hidden")
        
        var colorScale = d3.scaleOrdinal(d3.quantize(d3.interpolateSinebow, 5))

        svgcircle2
            .attr("cx", d => +d[xIndicator] / maxvals[1] * this.width)
            .attr("cy", d => +d[yIndicator] / maxvals[2] * this.height)
            // .attr('class',d=>('SC_circles '+d.StructType))
            .style("fill", d => colorScale(d.StructType))
            .attr('id',d=>'SC'+d['BuildingId'])
            .attr("r", d => circleSizer(+d[circleSizeIndicator])).attr("transform", "translate("+this.margin.left+","+(this.height+this.margin.top)+") scale(1,-1)");
        // let tooltip = d3.select('.tooltip');
        svgcircle2.on("mouseover", function(d){
            return plotTooltip.style("visibility", "visible")
                .style("width", "fit-content")
                .style("height", "fit-content")
                .style("border-radius", "10px")
                .style("display", "flex")
                .style("flex-direction", "column")
                .style("justify-content", "center")
                .html(that.tooltipRender(d,circleSizeIndicator) + "<br/>")
            })
            .on("mousemove", function(d){return plotTooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return plotTooltip.style("visibility", "hidden");});
        
        
        // .on('mouseover', function(d, i) {
        //     //show tooltip
        //     tooltip.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        //     tooltip.html(that.tooltipRender(d,circleSizeIndicator) + "<br/>")
        //         .style("left", (d3.event.pageX) + "px")
        //         .style("top", (d3.event.pageY - 238) + "px");

        // });

        //hover function for country selection
        // svgcircle2.on("mouseout", function(d) {
        //     tooltip.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        // });
        svgcircle2.on('click', (d) => {
            that.updateHighlight(d)
        });

        const brushGroup = d3.select('.plot-svg').insert('g',":first-child").classed("brush", true);

        const brush = d3
            .brush()
            .extent([[this.margin.left, this.margin.top], [this.width+this.margin.left , this.height+this.margin.top]])
            .on("start", () => {
                console.log("Brushing started");
            })
            .on("end", function () {
                const selection = d3.brushSelection(this);
                const selectedIndices = [];
                if (selection) {
                    const [[left, top], [right, bottom]] = selection;
                    that.data.forEach((d, i) => {

                        if (
                            xScale(d[xIndicator]) >= left &&
                            xScale(d[xIndicator]) <= right &&
                            yScale(d[yIndicator]) >= top &&
                            yScale(d[yIndicator]) <= bottom
                        ) {
                            selectedIndices.push(i);
                        }
                    });
                }
                svgcircle2.classed("highlight", false);

                if (selectedIndices.length > 0) {
                    svgcircle2
                        .filter((_, i) => {
                            return selectedIndices.includes(i);
                        })
                        .classed("highlight", true);
                    that.filterMap(that.data.filter((_, i) => {
                        return selectedIndices.includes(i);
                    }))
                } else {
                    that.filterMap(that.data)
                }
            })
            .on("brush", function () {
                const selection = d3.brushSelection(this);
                const selectedIndices = [];
                if (selection) {
                    const [[left, top], [right, bottom]] = selection;
                    that.data.forEach((d, i) => {

                        if (
                            xScale(d[xIndicator]) >= left &&
                            xScale(d[xIndicator]) <= right &&
                            yScale(d[yIndicator]) >= top &&
                            yScale(d[yIndicator]) <= bottom
                        ) {
                            selectedIndices.push(i);
                        }
                    });
                }
                svgcircle2.classed("highlight", false);

                if (selectedIndices.length > 0) {
                    svgcircle2
                        .filter((_, i) => {
                            return selectedIndices.includes(i);
                        })
                        .classed("highlight", true);
                }
            });
        brushGroup.call(brush);

    }

    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');

        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(this.dropData.filter((d,i)=>[0,1,2,8,9,11,12].includes(i)));


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d);

        optionsCEnter.append('text')
            .text((d, i) => d);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter((d,i) =>
            d=== circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function (d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            // console.log( xValue, yValue, cValue)

            that.updatePlot(xValue, yValue, cValue);
        });

        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(this.dropData.filter((d,i)=>[0,1,2,8,9,11,12].includes(i)));

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d);

        optionsXEnter.append('text')
            .text((d, i) => d);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d === xIndicator)
            .attr('selected', true);

        dropX.on('change', function (d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            // console.log( xValue, yValue, cValue)
            that.updatePlot( xValue, yValue, cValue);
        });

        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(this.dropData.filter((d,i)=>[0,1,2,8,9,11,12].includes(i)));

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d);

        let selectedY = optionsY.filter(d => d === yIndicator)
            .attr('selected', true);

        dropY.on('change', function (d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            // console.log( xValue, yValue, cValue)

            that.updatePlot(xValue, yValue, cValue);
        });

    }

    drawLegend(min, max) {

        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').attr('width', 250).select('g');

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
    }
        tooltipRender(data,txt) {
            let text = "<h3>" + txt+":"+data[txt] + "</h3>";
            return text;
        }
}