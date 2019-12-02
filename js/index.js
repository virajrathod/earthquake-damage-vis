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
        .attr("class", "cl_white w3-display-topleft w3-padding-large w3-xlarge")
        .text("CS 5630/6630");

    // middle text
    const middle = body.append("div")
        .classed("w3-display-position", true)
    middle.append("h1")
        .attr("class", "cl_white jumbo w3-animate-top")
        .text("Earthquake Damage Visualization");
    middle.append("p")
        .attr("class", "cl_white w3-large w3-center uppercase")
        .text("San Francisco");
    const portal = middle.append("h1")
        .attr("id", "project-portal")
        .attr("class", "btn from-left w3-large w3-center w3-animate-left");

    portal.text("EXPLORE");
    portal.on("click", onLoadHomePage);


    // portal to Home page
    body.append("div")
        .attr("class", "cl_white w3-display-bottommiddle w3-padding-large")
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
        .classed("title-header", true);
    title.append("h1")
        .attr("class", "jumbo w3-animate-top")
        .text("Meet the Developers");

    // Reza
    const reza = body.append("div")
        .classed("body-header", true);
    reza.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("Reza Sheibani");
    reza.append("div")
        .attr("class", "img-container")
        .append("img")
        .attr("src", "figs/reza.jpg");
    reza.append("p")
        .attr("class", "body-text w3-large")
        .text("Reza is a research assistant at the department of Civil and Environmental Engineering at the University of Utah. His research is focused on regional damage assessment of structures subjected to natural hazards. He is interested in the applications of data science in community resilience.")

    //Natalia

    const nat = body.append("div")
        .classed("body-header", true);
    nat.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("Natalia Soto");
    nat.append("div")
        .attr("class", "img-container")
        .append("img")
        .attr("src", "figs/natalia.png");

    nat.append("p")
        .attr("class", "body-text w3-large")
        .text("Natalia is a junior studying Computer Science." +
        "She has experience teaching high school students Python Game Development after being hired to work" +
        "for the University of Utah's Summer G.R.E.A.T Camp in 2018. Natalia also runs her own online business"
        + "as the Owner and Designer of Charm Bits Design, a printable party kit shop on Etsy. Through hard work"
        + " and education in search engine optimization, providing customer support, and using Adobe products,"
        + "her shop has provided her with income to help her pay college expenses. Separately, Natalia works " +
        "as a Software Engineering Intern at Proofpoint and looks forward to gaining more experience and opportunities"
       + " in the rest of her college experience." );

    // Viraj
    const vir = body.append("div")
        .classed("body-header", true);
    vir.append("h2")
        .attr("class","jumbo w3-animate-left")
        .text("Viraj Rathod")
    vir.append("div")
        .attr("class", "img-container")
        .append("img")
        .attr("src", "figs/viraj.jpg");
    vir.append("p")
        .attr("class", "body-text w3-large")
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


    // 1st item
    const item = body.append("div")
        .classed("tmp1", true);
    item.append("h2")
        .attr("class", "body-header jumbo")
        .text("Overview");
    item.append("p")
        .attr("class", "body-text tmp")
        .text("The aim of the visualization is to show the distribution of damage to each individual building in an earthquake. There are a number of " +
            "attributes associated with each building:");
    let list0=item.append('ul');
    list0.append('li').text('Area(m2): The square footage of each building in terms of meters squared.')
    list0.append('li').text('Stories: Number of stories for each building.')
    list0.append('li').text('YearBuilt: The year that the building was built.')
    list0.append('li').text('RepairCost($): The repair cost of the damaged building after the earthquake.')
    list0.append('li').text('Downtime(days): The number of days that takes to repair the building.')
    list0.append('li').text('SafetyTag: Shows whether it is safe to go back inside the building after the earthquake.')
    list0.append('li').text('GroundAcceleration(m/s2): An index that shows the intensity of the ground shaking at the building\'s site.')
    list0.append('li').text('DamageRatio: A floating number between 0 and 1, where 1 indicates a total destruction of building and 0 means that it has remained intact.')

    item.append("p")
        .attr("class", "body-text tmp")
        .text("The user is able to select any of these attributes to create the desired view in each different visualization.");

    item.append("h2")
        .attr("class", "body-header jumbo")
        .text("Main Page:");
    item.append("p")
        .attr("class", "body-text tmp")
        .text("The main page shows the map view of the San Francisco with buildings shown as markers on top of it. On the left, the user have two options to select: 1) Sunburst plot, 2) Scatter Plot."
             );
    let imge1=item.append('img').attr('src','figs/screenshots/1.PNG').attr('width',"100%");

    item.append("h3")
        .attr("class", "body-header jumbo")
        .text("Map view:");
    item.append("p")
        .attr("class", "body-text tmp")
        .text("The map is created from three different base-layers and two sub-layers. The user is able to choose a base-layer and the sub-layers from the " +
            "options at the top right corner of the plot. Also, two buttons are provided as shortcuts for zooming to max and to an overview of the city.");
    let imge2=item.append('img').attr('src','figs/screenshots/12.png').attr('width',"50%");
    item.append("p")
        .attr("class", "body-text tmp")
        .text("Markers are clustered on map to avoid saturating the plot. As the user zooms in, the number of clusters increases until finally, the user is able to see" +
            "each individual building. A popup message shows the exact attribute of the building when the user hovers the mouse over it.");
    let imge3=item.append('img').attr('src','figs/screenshots/14.png').attr('width',"50%");


    item.append("h3")
        .attr("class", "body-header jumbo")
        .text("Sunburst:");
    item.append("p")
        .attr("class", "body-text tmp")
        .text("The sunburst can be used as a filter or way to quantify the number of buildings with specific attributes. "+
        "It can also be used to quantify other values depending on the selected dropdown option. Users can " + 
        "click a node on the sunburst to view all of its children. That filtering will also reflect on the map on the right." + 
        "From there, the map continues to filter as the user goes further up or down the sunburst hierarchy.");
    let imge4=item.append('img').attr('src','figs/screenshots/13.png').attr('width',"50%");
    item.append("h3")
        .attr("class", "body-header jumbo")
        .text("Scatter Plot:");
    item.append("p")
        .attr("class", "body-text tmp")
        .text("Scatter Plot is provided to give the user the flexibility to see any building attribute against the others. Three dropdown menus are located at the bottom" +
            "which can be used to customize the plot view. The user is also able to brush on the dots and see the corresponding markers on the map." +
            " By clicking on any point, the map zooms to the corresponding building.");
    let imge5=item.append('img').attr('src','figs/screenshots/5.png').attr('width',"100%");
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
            .classed("title-header", true)
        middle.append("h1")
            .attr("class", "jumbo w3-animate-top")
            .text("Background");

    // 1st item
    const item = body.append("div")
        .classed("body-header", true);
    item.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("Concept")
    item.append("p")
        .attr("class", "body-text w3-large")
        .text("\tEarthquake damage prediction is one of the most popular topics in the civil engineering community.\n" +
            "\nVisualizing the consequences of an earthquake with an attractive design and providing information regarding the level of vulnerability of different structures is the main goal of this project.\n");

    item.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("Data")
    item.append("p")
        .attr("class","body-text w3-large")
        .text("\nA dataset, describing the seismic behavior of buildings in San Francisco city during a hypothetical M7.0 earthquake is available and will be implemented in the project\n");

    item.append("h2")
        .attr("class", "jumbo w3-animate-left")
        .text("Motivation")
    item.append("p")
        .attr("class","body-text w3-large")
        .text("The idea behind this visualization is to provide an idea of the damage caused by an earthquake and the repair cost associated with it. " +
            " Different factors like the area of the buildings in the area, no. of stories, type of the building, whether it is a residential or a commercial building. " +
            " One of the project members is doing his research project in this domain and visualizing the data associated with an earthquake was an extension of the idea. " +
            " Conceptually the idea is to create awareness among officials who deal with earthquakes and its causes.");
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



