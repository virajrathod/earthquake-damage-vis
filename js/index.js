onLoadLandingPage();
let pageHasTabs = false;

/**
 * Loads home page with background image of San Francisco
 */
function onLoadLandingPage() {
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
        .classed("w3-display-position", true)
    middle.append("h1")
        .attr("class", "jumbo w3-animate-top")
        .text("Earthquake Damage Visualization");
    middle.append("p")
        .attr("class", "w3-large w3-center uppercase")
        .text("San Francisco");
    const portal = middle.append("h1")
        .attr("id", "project-portal")
        .attr("class", "btn from-left w3-large w3-center w3-animate-left");

    portal.text("EXPLORE");
    portal.on("click", onLoadHomePage);


    // portal to Home page
    body.append("div")
        .attr("class", "homeNames w3-display-bottommiddle w3-padding-large")
        .text("Created by Reza Sheibani, Natalia Soto, and Viraj Rathod");
}

/**
 * Detailed descriptions of the developers of this project
 */
function onLoadAboutPage() {
    // Setup DOM

    // Remove current page elements
    d3.select(".page").remove();
    // Append page elements
    const page = d3.select("body").append("div").attr("class", "page");
    // Append header
    const header = page.append("div")
        .classed("header-wrap", true)
    renderTabHeader(header);
    pageHasTabs = true;
    header.append("div").attr("class", "project-header").text("About");
    // create body
    const body = page.append("div")
        .attr("class", "page-body w3-animate-opacity w3-display-container text-color");

    // Title text
    const title = body.append("div")
        .classed("w3-display-topmiddle", true);
    title.append("h1")
        .attr("class", "jumbo w3-animate-top")
        .text("Meet the Developers");
    title.append("p")
        .attr("class", "w3-large w3-center uppercase")
        .text("Reza Sheiban");

    title.append("p")
        .attr("class", "w3-large w3-center uppercase")
        .text("Natalia Soto");

    title.append("p")
        .attr("class", "w3-large w3-center uppercase")
        .text("Viraj Rathod");

    // Reza
    const reza = body.append("div")
        .classed("w3-display-left", true);
    reza.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("");

    // Viraj
    const vir = body.append("div")
        .classed("w3-display-left", true);
    vir.append("h2")
        .attr("class","jumbo w3-animate-left")
        .text("Hi, I'm Viraj Rathod, an MSIS grad student here at the David Eccles Business School." +
            "I'm from Mumbai, India the bollywood capital of India." +
            "Looking to make a career in Analytics and Data managment.")

}

/**
 * Loads help page that explains how to interpret the data and gives a brief explanation of the data
 * and how to use the data charts
 */
function onLoadHelpPage() {
    // Remove current page elements
    d3.select(".page").remove();
    // Append page elements
    const page = d3.select("body").append("div").attr("class", "page");
    // Append header
    const header = page.append("div")
        .classed("header-wrap", true)
    renderTabHeader(header);
    pageHasTabs = true;
    header.append("div").attr("class", "project-header").text("About");
    // create body
    const body = page.append("div")
        .attr("class", "page-body w3-animate-opacity w3-display-container text-color");

    // Title text
    const middle = body.append("div")
        .classed("w3-display-topmiddle", true)
    middle.append("h1")
        .attr("class", "jumbo w3-animate-top")
        .text("How to Use This Site");
    middle.append("p")
        .attr("class", "w3-large w3-center uppercase")
        .text("...");

    // 1st item
    const item = body.append("div")
        .classed("w3-display-left", true);
    item.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("bla bla");
}

/**
 * Loads the background page where we talk about our project inspiration
 */
function onLoadBackgroundPage() {
        // Remove current page elements
        d3.select(".page").remove();
        // Append page elements
        const page = d3.select("body").append("div").attr("class", "page");
        // Append header
        const header = page.append("div")
            .classed("header-wrap", true)
        renderTabHeader(header);
        pageHasTabs = true;
        header.append("div").attr("class", "project-header").text("About");
        // create body
        const body = page.append("div")
            .attr("class", "page-body w3-animate-opacity w3-display-container text-color");

        // Title text
        const middle = body.append("div")
            .classed("w3-display-topmiddle", true)
        middle.append("h1")
            .attr("class", "jumbo w3-animate-top")
            .text("Background");
        middle.append("p")
            .attr("class", "w3-large w3-center uppercase")
            .text("...");

    // 1st item
    const item = body.append("div")
        .classed("w3-display-left", true);
    item.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("•\tEarthquake damage prediction is one of the most popular topics in the civil engineering community.\n" +
            "•\nVisualizing the consequences of an earthquake with an attractive design and providing information regarding the level of vulnerability of different structures is the main goal of this project.\n" +
            " \n" +
            "•\n`A dataset, describing the seismic behavior of buildings in San Francisco city during a hypothetical M7.0 earthquake is available and will be implemented in the project\n");


}

function renderTabHeader(header) {
    // Make navigation
    const navigation = header.append("div").attr("class", "navigation");
    container = navigation.append("div").classed("tabs-container", true);
    // Home
    container.append("div")
    .on("click", onLoadHomePage)
    .attr("id", "nav-landingpage")
    .attr("class", "tab from-left")
    .text("Home")
    // About
    container.append("div")
    .on("click", onLoadAboutPage)
    .attr("class", "tab from-left")
    .text("About")
    // Help
    container.append("div")
    .on("click", onLoadHelpPage)
    .attr("class", "tab from-left")
    .text("Help")
    // Background
    container.append("div")
    .on("click", onLoadBackgroundPage)
    .attr("class", "tab from-left")
    .text("Background")

    navigation.append("div").attr("class", "border-bottom");
}

 /**
 * Reads data from CSV file.
 * The file contains 20,000 entries of individual building data that tells information about 
 * the structural damages and costs of a 7.0 magnitude earthquake in San Francisco
 */
 function onLoadHomePage() {

    // Setup DOM

    // Remove current page elements
    d3.select(".page").remove();
    // Append page elements
    const page = d3.select("body").append("div").attr("class", "page");
    // Append header
    const header = page.append("div")
        .classed("header-wrap", true)

    renderTabHeader(header);
    pageHasTabs = true;

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



