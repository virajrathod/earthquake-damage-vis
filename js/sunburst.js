/**----CONSTANTS---- */
const numStoriesNames = {
    '1': '1 Story',
    '2': '2 Story',
    '3': '3 Story',
    '4-9': '4-9 Stories',
    '10-29': '10-29 Stories',
    '30-49': '30-49 Stories',
    '50Plus': '50+ Stories',
}
/**-------- */

const yearBuiltName = {
    '-1874': 'Built On/Before: 1848-1874',
    '1875-1901': 'Built Between: 1875-1901',
    '1902-1928': 'Built Between: 1902-1928',
    '1929-1955': 'Built Between: 1929-1955',
    '1956-1982': 'Built Between: 1956-1982',
    '1983-': 'Built On/After: 1983-2010',
}
/**-------- */

const dataCols = {
    "StructType" : "StructType",
    "RepairCost" : "RepairCost($)",
    "Occupancy" : "Occupancy",
    "Stories" : "Stories",
    "YearBuilt" : "YearBuilt", 
    "Downtime" : "Downtime(days)",
    "GroundAcceleration" : "GroundAcceleration(m/s2)"
}
/**-------- */

const wedgeTypes = [
    {name: "Total Number of Buildings", id: "Number of Buildings"},
    {name: "Repair Cost ($)", id : dataCols.RepairCost},
    {name: "Downtime (days)", id : dataCols.Downtime }, 
    {name: "Ground Acceleration (m/s2)", id : dataCols.GroundAcceleration}
];

/**
 * Controls the Sunburst data visualization
 */
class Sunburst {
    /**
     * Stores the earthquake damage data and the original sunburst wedge/node size type
     * as well as a reference to the map.
     * Creates an initial hierarchy of data based on the number of buildings and draws
     * the sunburst.
     */ 

    constructor(data, map) {
        this.data = data;
        this.valueType = wedgeTypes[0].id;
        this.map = map;
        this.hierarchy = this.createHierarchy(this);
        this.drawSunburst();
    }

    /**
     * Updates HTML DOM elements to refresh the sunburst visual
     */
    drawSunburst() {
        // Remove old elements
        d3.select(".viz-header").remove(); // remove old header
        d3.select(".dataviz-element").remove(); // remove old header
         // Insert HTML elements
         const container = d3.select(".dataviz-elements");
         const header = container.append("div")
             .attr("class", "dataviz-element")
             .attr("id", "dataviz-sunburst")
             .append("div")
             .attr("class", "viz-header");
         header.append("div")
             .attr("class", "viz-header__text")
             .text("Click a node to zoom in, or the center to zoom out.");
         header.append("div").attr("class", "dropdown");

        this.drawChart(this.hierarchy, this);
        this.createDropdown();
    }
    
    /**
     * Creates dropdown that controls the wedge size
     */
    createDropdown() {
        const that = this;
        const createHierarchy = this.createHierarchy;
        const drawChart = this.drawChart;
        const dropdownDiv = d3.select(".dropdown");
        dropdownDiv.append("span").attr("id", "selector-text").text("Node Size: ")
        const dropBtn = dropdownDiv.append("select").attr("class", "dropbtn");
        dropBtn.attr("id", "wedgeSelector").selectAll("option")
            .data(wedgeTypes)
            .join("option")
            .text(d => d.name)
            .attr("class", "selector-option")
            .attr("value", (d,i) => d.id)

        d3.select("#wedgeSelector")
            .on("change", function() {
                that.valueType = this.value;
                const newHierarchy = createHierarchy(that);
                drawChart(newHierarchy, that);
            });
    }

    /**
     * Creates a hierarchy of children nodes based on the dropdown selector (current valueType) 
     * @param {*} that : Holds a reference to the Sunburst class object 
     */
    createHierarchy(that) {

        let hierarchy =
        {
            name: "StructType", 
            children:[]
        };

        let currRoot = hierarchy;
        
        // Assign Struct Type children
        const structTypeChildren = filter(that.data, dataCols.StructType);
        hierarchy.children = structTypeChildren;

        // Assign Occupancy children (6)
        currRoot = hierarchy.children;
        for (let structTypeChild of currRoot) {
            const temp = filter(structTypeChild.children, dataCols.Occupancy);
            structTypeChild.children = temp;
        }

        // Assign # of Stories
        for (let structTypeChild of currRoot) {
            let currOccupancyArray = structTypeChild.children;
            for (let occupancyChild of currOccupancyArray) {
                const temp = filter(occupancyChild.children, dataCols.Stories);
                occupancyChild.children = temp;
            }
        }

        // Assign Years Built & Get Repair Costs
        for (let structTypeChild of currRoot) {
            let currOccupancyArray = structTypeChild.children;
            for (let occupancyChild of currOccupancyArray) {
                let currStoriesArray = occupancyChild.children;
                for (let storiesChild of currStoriesArray) {
                    const tempChildren = filter(storiesChild.children, dataCols.YearBuilt);
                    storiesChild.children = tempChildren;
                    for (let child of storiesChild.children) {
                        const yearBuiltChildren = child.children;
                        let avg;
                        if (that.valueType === wedgeTypes[0].id) avg = d3.sum(yearBuiltChildren, d => 1);
                        else avg = d3.sum(yearBuiltChildren, d => d[that.valueType]) / yearBuiltChildren.length;
                        child.value = avg;
                        child.children = undefined;
                    }
                }
            }
        }

        // Filter the items by the parent category
        function filter(dataset, newFilter) {
            return dataset.reduce((acc, item) => {
                // Format name if necessary
                let name;
                if (newFilter === dataCols.Stories) {
                    name = getStoriesName(item[newFilter]);
                }
                else if (newFilter === dataCols.YearBuilt) {
                    name = getYearBuiltName(item[newFilter]);
                }  
                else {
                    name = item[newFilter];
                }

                // If name already exists, push new item into existing array. Otherwise create a new object
                if (acc.filter(obj => obj.name === name).length === 0) {
                    acc.push({name: name, children: [item]});
                }
                else {
                    let idx = acc.findIndex(val => val.name === name);
                    acc[idx].children.push(item);
                }
                return acc;
            }, []);
        }
  
        function getStoriesName(numStories) {
            if (numStories == 1) return numStoriesNames['1']
            else if (numStories == 2) return numStoriesNames['2']
            else if (numStories == 3) return numStoriesNames['3']
            else if (numStories >= 4 && numStories < 10) return numStoriesNames['4-9']; 
            else if (numStories >= 10 && numStories < 30) return numStoriesNames['10-29'];
            else if (numStories >= 30 && numStories < 50) return numStoriesNames['30-49'];
            else if (numStories >= 50) return numStoriesNames['50Plus'];
            else {
                console.debug("FAILED TO GET NUM STORIES NAME for : ", numStories)
            }
        }

        function getYearBuiltName(yearBuilt) {
            if (yearBuilt <= 1874) return yearBuiltName['1848-1874'];
            else if (yearBuilt >= 1875 && yearBuilt <= 1901) return yearBuiltName['1875-1901'];
            else if (yearBuilt >= 1902 && yearBuilt <= 1928) return yearBuiltName['1902-1928'];
            else if (yearBuilt >= 1929 && yearBuilt <= 1955) return yearBuiltName['1929-1955'];
            else if (yearBuilt >= 1956 && yearBuilt <= 1982) return yearBuiltName['1956-1982'];
            else if (yearBuilt >= 1983) return yearBuiltName['1983-'];
        }
        
        // console.log('final hierarchy', hierarchy);
        return hierarchy;
    }

    /**
     * Draws Sunburst Chart given a data hierarchy and a reference to the Sunburst class object 
     */ 
    drawChart = (data, that) => {
        const partition = data => {
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])
                (root);
        }

        function colorScale(d){
            if (d=='Steel'){
                return '#ff12d0';}
            else if (d=='Concrete'){
                return '#ff5c00';
            }else if (d=='Masonry_Type_1'){
                return '#0fc300';
            }else if (d=='Masonry_Type_2'){
                return '#00e7ff';
            }else if (d=='Timber'){
                return '#9300ff';
            }
        }
        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateSinebow, data.children.length + 1));
        const format = d3.format(",.3f")
        const width = 600;
        const radius = width / 6;
    
        const arc = d3.arc()
            .startAngle(d => d.x0)
            .endAngle(d => d.x1)
            .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius(d => d.y0 * radius)
            .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

        const root = partition(data);
        root.each(d => d.current = d);
        d3.select("#sunburst").remove(); // remove old element
        const svg = d3.select("#dataviz-sunburst").append("svg").attr("id", "sunburst");
        svg.attr("viewBox", [0, 0, width*1.2, width*1.2])
            .style("margin", "2rem")
            .style("font", "10px sans-serif");
        const g = svg.append("g")
            .attr("transform", `translate(${width / 1.6},${width / 2}) rotate(-50)`);
        const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return colorScale(d.data.name); })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("d", d => arc(d.current));
    
        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "sunburst-tooltip")
            .style("visibility", "hidden")

        path.on("mouseover", function(d){
            let valueLabel = that.valueType === "Number of Buildings" ? that.valueType : `Avg. ${that.valueType}`;
            return tooltip.style("visibility", "visible")
                .style("width", "10rem")
                .style("height", "fit-content")
                .style("border-radius", "10px")
                .style("display", "flex")
                .style("flex-direction", "column")
                .style("justify-content", "center")
                .text(`${d.ancestors().map(d => d.data.name).reverse().join(",\n")}`)
                .append("text")
                .text(`${valueLabel}: ${format(d.value)}`);
            })
            .on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
            .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    
        const label = g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => d.data.name);
    
        const parent = g.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", clicked);
    
        function clicked(p) {
        parent.datum(p.parent || root);
    
        that.map.updateMap(p.parent ? that.formatMapData(p) : that.formatMapData(null))
        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });
    
        const t = g.transition().duration(750);
    
        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function(d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current));
    
        label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
            }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
        }
        
        function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
        }
    
        function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }
    
        function labelTransform(d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2 * radius;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }

        return svg.node();
    }

    /**
     * Formats a hierarchical structure of the data from the current sunburst back into 
     * an array of objects (like when reading from the csv originally) 
     * 
     * This is necessary because the transformation of data to a sunburst-readable one
     * is not compatible with the data read by the map.
     * @param {*} hData : the hierarchical data to be transformed 
     */ 
    formatMapData(hData) {
        // If the sunburst is currently at the root
        if (hData === null) {
            return this.data;
        }
        else {
            const filters = hData.ancestors().map(d => d.data.name).reverse()
             // sunburst has been filtered by a StructType
            if (filters.length === 2) {
                return this.data.filter(d => {
                    return d[dataCols.StructType] === filters[1]
                })
            }
            // sunburst has been filtered by StructType and Occupancy
            else if (filters.length === 3) {

                return this.data.filter(d => {
                    return d[dataCols.StructType] === filters[1]
                        && d[dataCols.Occupancy] === filters[2]
                })
            }
            // sunburst has been filtered by StructType, Occupancy, and number of stories
            else if (filters.length === 4) {

                return this.data.filter(o => {
                    function hasNumStories(str) {
                        if (str === numStoriesNames["50Plus"]) {
                            return o[dataCols.Stories] >= 50;
                        }
                        else if (str === numStoriesNames["30-49"])
                            return o[dataCols.Stories] >= 30 && o[dataCols.Stories] < 50;
                        else if (str === numStoriesNames["10-29"])
                            return o[dataCols.Stories] >= 10 && o[dataCols.Stories] < 30;
                        else if (str === numStoriesNames["4-9"])
                            return o[dataCols.Stories] >= 4 && o[dataCols.Stories] < 10;
                        else if (str === numStoriesNames["3"])
                            return o[dataCols.Stories] == 3;
                        else if (str === numStoriesNames["2"])
                            return o[dataCols.Stories] == 2;
                        else if (str === numStoriesNames["1"])
                            return o[dataCols.Stories] == 1;
                        else {
                            console.log('fail')
                        }
                    }
                    return o[dataCols.StructType] === filters[1]
                        && o[dataCols.Occupancy] === filters[2]
                        && hasNumStories(filters[3])
                })
            }
            else {
                throw Error();
            }
        }
    }
}
