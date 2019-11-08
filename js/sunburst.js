class Sunburst {
    constructor(data) {
        this.data = cleanup(data);

        function cleanup(data) {
            return data.map(item => (
                {
                    Id: item.Id,
                    TypeID: item.TypeID,
                    Occupancy: item.Occupancy,
                    Stories: item.Stories,
                    YearBuilt: item.YearBuilt,
                    Collapsed: item.Collapsed,
                    RepairCost: item.RepairCost,
                    Downtime: item.Downtime,
                }
            ));
        }
    }

    createHierarchy() {

        let hierarchy =
        {
            name: "TypeID", 
            children:[]
        };

       console.log(data);
        let currRoot = hierarchy;
        
        // Assign Type ID children
        const typeIdChildren = filter(this.data, "TypeID");
        console.log(typeIdChildren);
        hierarchy.children = typeIdChildren;

        // function filterByTypeIds(that, dataset) {
        //     return that.data.reduce((acc, item) => {
        //         if (acc.filter(obj => obj.name === item.TypeID).length === 0)
        //             acc.push({name: item.TypeID, children: [item]});
        //         else {
        //             const idx = acc.findIndex(val => val.name == item.TypeID);
        //             acc[idx].children.push(item);
        //         }
        //         return acc;
        //     }, []);
        // }
        console.log('filtered by typeId', hierarchy);

        // Assign Occupancy children (6)
        currRoot = hierarchy.children;
        for (let child of currRoot) {
            const temp = filter(child.children, "Occupancy");
            console.log('Children for this sub-filter:', child.children, temp)
            child.children = temp;
        }

        console.log('filtered by occupancy', hierarchy);

        // function filterByOccupancy(dataset) {
        //     return dataset.reduce((acc, item) => {
        //         if (acc.filter(obj => obj.name === item.Occupancy).length === 0)
        //             acc.push({name: item.Occupancy, children: [item]});
        //         else {
        //             const idx = acc.findIndex(val => val.name == item.Occupancy);
        //             acc[idx].children.push(item);
        //         }
        //         return acc;
        //     }, []);
        // }

        // Assign # of Stories (bins)
        let tempRoot = currRoot;
        for (let child of currRoot) {
            tempRoot = child.children;
            for (let filter of tempRoot) {
                const temp = filterByStories(this, filter.children);
                filter.children = temp;
            }
        }

        // console.log(d3.max(this.data, item => item.Stories));
        
        function filterByStories(that, dataset) {
            const storyIntervals = {1: [], 2: [], 3: [], 4: [], 5:[], 6: []}
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
        }

        function filter(dataset, newFilter) {
            console.log("Filtering for: ", newFilter)
            return dataset.reduce((acc, item) => {
                if (acc.filter(obj => obj.name === item[newFilter]).length === 0) {
                    console.log('new name', newFilter)
                    acc.push({name: item[newFilter], children: [item]});
                }
                else {
                    const idx = acc.findIndex(val => val.name == item[newFilter]);
                    acc[idx].children.push(item);
                }
                return acc;
            }, []);
        }

        console.log('final hierarchy', hierarchy);
    
    }

    
}

const chart = () => {

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
const data = ({name: "one",
        children: [
          {name: "two-1", children: [
                            {name:"three-1-1", children: [{name: "four-1-1", value: 20
                        }]}, 
                            {name: "three-1-2", children: [{name: "four-1-2", value: 2}]}
                          ]
          },
          {name: "two-2", children: [{name: "three-2-1", value: 66}, {name: "four-2-1", value: 1},
                                     {name: "three-2-1", value: 100}
                                    ]
          },
          {name: "two-3", children: [{name: "three-3-1", value: 50}]},
          {name: "two-4", children: [{name: "three-4-1", value: 5}]},
          {name: "two-5", children: [{name: "three-5-1", value: 60}]},
        ]
       });

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

// d3 = require("d3@5")

chart();