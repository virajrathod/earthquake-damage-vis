onLoadHomePage();


/**
 * Loads home page with background image of San Francisco
 */
function onLoadHomePage() {
    // Setup DOM

    // Remove current page elements
    d3.select(".page").select("*").remove();

    // Append page elements
    const page = d3.select(".page");
    page.classed("background-img", true);

    // create body
    const body = page.append("div")
        .attr("class", "w3-animate-opacity text-color");

    // corner text
    body.append("div")
        .attr("class", "w3-display-topleft w3-padding-large w3-xlarge")
        .text("CS 5630/6630");

    // middle text
    const middle = body.append("div")
        .classed("w3-display-middle", true)
    middle.append("h1")
        .attr("class", "jumbo w3-animate-top")
        .text("Earthquake Visualization");
    middle.append("p")
        .attr("class", "w3-large w3-center uppercase")
        .text("San Francisco");
    const portal = middle.append("h1")
        .attr("id", "project-portal")
        .attr("class", "btn from-left w3-large w3-center w3-animate-left");

    portal.text("Click to View");
    portal.on("click", onLoadVisualizationPage);

    // portal to data viz project
    body.append("div")
        .attr("class", "w3-display-bottomleft w3-padding-large")
        .text("Created by Reza Sheibani, Natalia Soto, and Viraj Rathod");
}


 /**
 * Reads data from CSV file.
 * The file contains 20,000 entries of individual building data that tells information about 
 * the structural damages and costs of a 7.0 magnitude earthquake in San Francisco
 */
 function onLoadVisualizationPage() {

    // Setup DOM

    // Remove current page elements
    d3.select(".page").select("*").remove();

    // Append page elements
    const page = d3.select(".page");
    page.classed("background-img", false);

    // Append header
    const header = page.append("div")
        .classed("header-wrap", true)
   
    // Make navigation
    const navigation = header.append("div").attr("class", "navigation");
    // navigation.append("button")

    header.append("div").attr("class", "project-header shake-slow").text("Earthquake Visualization");
    const ournames = header.append("div").attr("class", "our-names");
    ournames.append("div").text("Reza Sheibani; E-mail: m.sheibani@utah.edu; UID: u1138100 ")
    ournames.append("div").text("Natalia Soto; Email: n.soto@utah.edu; UID: u1058711 ")
    ournames.append("div").text("Viraj Rathod; Email: viraj.rathod@utah.edu; UID: u1269659");

    // Append scatterplot and sunburst body elements
    const overlay = page.append("div")
        .attr("id", "overlay");
    const links = overlay.append("div")
        .attr("class","links");
    links.append("div")
        .attr("id", "sunburst-link")
        .text("Sunburst");
    links.append("div")
        .attr("id", "scatterplot-link")
        .text("Scatterplot");
    overlay.append("div")
        .attr("class","dataviz-elements");

    // Append map elements
    const mapdiv = page.append("div")
        .attr("id", "mapDiv");
    mapdiv.append("div").attr("id", "mapLegend");
    const floatingpanel = mapdiv.append("div").attr("id", "floating-panelM");
    floatingpanel.append("button")
        .attr("id", "defView")
        .text("Overview");
    floatingpanel.append("button")
        .attr("id", "zoomView")
        .text("Detailed view")

    // load earthquake data
    d3.csv("data/EQ_data_updated-2.csv").then( data => {

        let currVisualization = "sunburst";

        // Setup data for Map
        function filterMap(data){
            map.updateMap(data)
        }
        function updateHighlight(point){
            if (point==null){
                d3.selectAll('.leaflet-interactive').classed('SClass',false);
                d3.selectAll('.SC_circles').classed('SClass',false);
            } else{
                map.Map_focus(point);
                d3.selectAll('.leaflet-interactive').classed('SClass',false);
                function myfunction(){d3.selectAll('.C'+point['BuildingId']).classed('SClass',true);}
                setTimeout(myfunction, 1000);
                d3.selectAll('.SC_circles').classed('SClass',false);
                d3.select('#SC'+point['BuildingId']).classed('SClass',true);
            }
        }
        const scatter=new GapPlot(data,updateHighlight,filterMap);
        const map=new mapClass(data,updateHighlight);

        document.addEventListener("click", function() {
            updateHighlight(null)
        }, true);

        // Create hierarchy dataset for Sunburst Zoom
        const sunburst = new Sunburst(data, map);

        // Event listener to switch between data visualizations
        const sunburstTab = d3.select("#sunburst-link");
        const scatterplotTab = d3.select("#scatterplot-link");
        sunburstTab.on("click", drawSunburst);
        scatterplotTab.on("click", drawScatterplot);

        // Helper function that draws sunburst if it isn't drawn already
        function drawSunburst() {
            if (currVisualization === "sunburst") 
                return;
            else {
                sunburst.drawSunburst(); 
                currVisualization = "sunburst";
            }
        }

        // Helper function that draws scaterplot if it isn't drawn already
        function drawScatterplot() {
            if (currVisualization === "scatterplot")
                return;
            else {
                scatter.drawPlot();
                currVisualization = "scatterplot";
            } 
        }
        
    });

 }



