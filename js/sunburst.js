const numStoriesNames = {
    '1': '1 Story',
    '2': '2 Story',
    '3': '3 Story',
    '4-9': '4-9 Stories',
    '10-29': '10-29 Stories',
    '30-49': '30-49 Stories',
    '50Plus': '50+ Stories',
}

class Sunburst {
    constructor(data) {
        this.data = cleanup(data);

        function cleanup(data) {
            return data.map(item => (
                {
                    BuildingId: item.BuildingId,
                    StructType: item.StructType,
                    Occupancy: item.Occupancy,
                    Stories: item.Stories,
                    YearBuilt: item.YearBuilt,
                    SafetyTag: item.SafetyTag,
                    RepairCost: item["RepairCost($)"],
                    Downtime: item["Downtime(day)"],
                }
            ));
        }
    }

    createHierarchy() {

        // console.log(this.data)
        let hierarchy =
        {
            name: "StructType", 
            children:[]
        };

        let currRoot = hierarchy;
        
        // Assign Struct Type children
        const structTypeChildren = filter(this.data, "StructType");
        hierarchy.children = structTypeChildren;

        // Assign Occupancy children (6)
        currRoot = hierarchy.children;
        for (let structTypeChild of currRoot) {
            const temp = filter(structTypeChild.children, "Occupancy");
            structTypeChild.children = temp;
        }

        // Assign # of Stories
        for (let structTypeChild of currRoot) {
            let currOccupancyArray = structTypeChild.children;
            for (let occupancyChild of currOccupancyArray) {
                const temp = filter(occupancyChild.children, "Stories");
                // console.log(temp)
                temp.value = 2; // delete later
                occupancyChild.children = temp;
            }
        }

        console.log('hierarchy before structtype', hierarchy);

        // TODO Assign Years Built
        for (let structTypeChild of currRoot) {
            let currOccupancyArray = structTypeChild.children;
            for (let occupancyChild of currOccupancyArray) {
                let currStoriesArray = occupancyChild.children;
                // console.log(currStoriesArray, occupancyChild.children)
                for (let storiesChild of currStoriesArray) {
                    const temp = filterYearBuilt(storiesChild.children, this);
                    // const temp = filter(storiesChild.children);
                    // storiesChild.children = temp;
                }
            }
        }

        function filterYearBuilt(dataset, that) {
            const intervalObj = that.getYearBuiltInterval();
        }

        // Get Repair Cost Value
        // for (let structTypeChild of currRoot) {
        //     let currOccupancyArray = structTypeChild.children;
        //     for (let occupancyChild of currOccupancyArray) {
        //         let currStoriesArray = occupancyChild.children;
        //         for (let storiesChild of currStoriesArray) {
        //             let currYearBuiltArray = storiesChild.children;
        //             for (let yearBuiltChild of currYearBuiltArray) {
        //                 const temp = getRepairCosts(yearBuiltChild.children, "RepairCost");
        //                 yearBuiltChild.children = temp;
        //             }
        //         }
        //     }
        // }

        function getRepairCosts(dataset, newFilter) {
            const costSums = dataset.reduce((acc, item) => {
                if (acc.filter(obj => obj.name === item[newFilter]).length === 0) {
                    acc.push({name: item[newFilter], value: item.RepairCost});
                }
                else {
                    const idx = acc.findIndex(val => val.name == item[newFilter]);
                    acc[idx].value += item.RepairCost;
                }
                return acc;
            }, []);

            // console.log(costSums)
        }

        // function filterByStories(that, dataset) {
            // const storyIntervals = {1: [], 2: [], 3: [], 4: [], 5:[], 6: []}
            // for (let currMin = 1; currMin <= d3.max(dataset, (row) => row.Stories); i++) {
                // for (currMin 
            // }
            // console.log("Filtering for: Stories");
            // console.log(d3.max(that.data, (row) => row.Stories));
            // return dataset.reduce((acc, item) => {
            //     if (acc.filter(obj => obj.name === item[newFilter]).length === 0)
            //         acc.push({name: item[newFilter], children: [item]});
            //     else {
            //         const idx = acc.findIndex(val => val.name == item[newFilter]);
            //         acc[idx].children.push(item);
            //     }
            //     return acc;
            // }, []);
        // }

        function filter(dataset, newFilter) {
            return dataset.reduce((acc, item) => {
                let name = newFilter === 'Stories' ? getStoriesName(item[newFilter]) : item[newFilter];
                if (acc.filter(obj => obj.name === name).length === 0) {
                    // TODO Replace with actual value of repair costs (stories is second to last hierarchy)
                    // if (newFilter !== 'Stories') 
                    acc.push({name: name, value: 1, children: [item]});
                    // else {
                    //     // console.log(item, newFilter, getStoriesName(item[newFilter]))
                    //     acc.push({name: name, children: [item]})
                    // };
                }
                else {
                    // let idx;
                    // if (newFilter === 'Stories') idx = acc.findIndex(val => val.name === name);
                    // else 
                    let idx = acc.findIndex(val => val.name === name);
                    // if (newFilter === 'Stories') console.log(acc, name)
                    acc[idx].children.push(item);
                }
                return acc;
            }, []);
        }
  
        function getStoriesName(numStories) {
            if (numStories === 1) return numStoriesNames['1']
            else if (numStories === 2) return numStoriesNames['2']
            else if (numStories === 3) return numStoriesNames['3']
            else if (numStories >= 4 && numStories < 10) return numStoriesNames['4-9']; 
            else if (numStories >= 10 && numStories < 30) return numStoriesNames['10-29'];
            else if (numStories >= 30 && numStories < 50) return numStoriesNames['30-49'];
            else return numStoriesNames['50Plus'];
        }

        console.log('final hierarchy', hierarchy);
        return hierarchy;
    }

    getYearBuiltInterval() {
        const NUM_YEAR_NODES = 6;
        this.minYear = d3.min(this.data, d => d.YearBuilt);
        this.maxYear = d3.max(this.data, d => d.YearBuilt);
        const difference = this.maxYear - this.minYear;
        this.yearInterval = difference / NUM_YEAR_NODES;
    }

    getYearBuiltName(num) {
        if (num >= this.minYear && num < this.minYear+this.yearInterval) {
            // beg to beg+27
        }
        else if (num >= this.minYear+this.yearInterval && num < this.minYear+(2*this.yearInterval)) {
            // beg+27 to beg+27*2
        }
        else if (num >= this.minYear+(2*this.yearInterval) && num < this.minYear+(3*this.yearInterval)) {

        }
    }

        
    // Sunburst Chart 

    drawChart = (data) => {

        const partition = data => {
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])
                (root);
        }
    
        const color = d3.scaleOrdinal(d3.quantize(d3.interpolateInferno, data.children.length + 1))
        const format = d3.format(",d")
        const width = 932;
        const radius = width / 6
    
        const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

        const root = partition(data);
        root.each(d => d.current = d);
        const svg = d3.select("#dataviz-sunburst").append("svg");
        svg.attr("viewBox", [0, 0, width, width])
            .style("margin", "2rem")
            .style("font", "10px sans-serif");
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2},${width / 2})`);
        const path = g.append("g")
        .selectAll("path")
        .data(root.descendants().slice(1))
        .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("d", d => arc(d.current));
    
        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);
    
        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    
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

    // const dummydata = ({name: "one",
    //         children: [
    //         {name: "two-1", children: [
    //                             {name:"three-1-1", children: [{name: "four-1-1", value: 20
    //                         }]}, 
    //                             {name: "three-1-2", children: [{name: "four-1-2", value: 2}]}
    //                         ]
    //         },
    //         {name: "two-2", children: [{name: "three-2-1", value: 66}, {name: "four-2-1", value: 1},
    //                                     {name: "three-2-1", value: 100}
    //                                     ]
    //         },
    //         {name: "two-3", value: 23, children: [{name: "three-3-1", value: 50}]},
    //         {name: "two-4", children: [{name: "three-4-1", value: 5}]},
    //         {name: "two-5", children: [{name: "three-5-1", value: 60}]},
    //         ]
    //     });

}