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