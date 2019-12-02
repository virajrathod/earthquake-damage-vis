# earthquake-damage-visualization
* Visualizing the damage incurred on buildings in San Francisco due to earthquakes (1848 -2010)
Authors: Natalia Soto, Reza Sheiban, Viraj Rathod
* Project Website: https://rawgit.com/nataliamelissas/earthquake-damage-visualization/master/index.html
* Project Screencast: 

## Earthquake Damage Visualization in San Francisco
An overview of what we are handing in: which parts are our code, which parts are libraries, and so on. The README must contain URLs to your project websites and screencast videos. The README must also explain any non-obvious features of your interface.

* **Our Code and Visualizations**
  - index.js: contains functions to load the pages of our website. DOM manipulation is done with D3.js (see **Libaries**)
  - map.js: Loads earthquake damage map visualization showing and overview or specific view of earthquake damage in San Francisco. Displays color coded heatmap to show damage severity, labels for specific structural damage data, and dropdown options to change data displayed by heat map. Hovering over bubbles shows geographic location indicated by that bubble. Map APIS used are from Google, OpenStreetMap and MapBox.
  - scatterPlot.js: Controls the Scatterplot data visualization. Users can the data for the X,Y coordinates and change the circle size indicator.
  - sunburst.js: Used as a filter and a unique way of quantifying the data values. Users can click a "node" on the sunburst to see all of its children. 
    - For example, clicking the "Cement" node on the top-level hierarchy will filter all the cement buildings on the map and the sunburst itself simultaneously. From there, the map can continue to be filtered by clicking on a sunburst child.
    - Users can see the amount of buildings that exist within each filter 
    
* **Libraries, Stylesheets, Plugins**
Here we go give credit for stylesheets used and briefly explain the libaries used.
  - All external libraries, plugins, or stylesheets are already included as links in the index.html file. No further work or download is necessary.
  - External stylesheets:
    - For text shaking in our Home page: https://csshake.surge.sh/csshake.min.css
    - For positioning of items on our landing page and About, Background, Help sections: https://www.w3schools.com/w3css/4/w3.css
    - Fonts used on landing page and tabs: https://fonts.googleapis.com/css?family=Raleway
    - https://unpkg.com/leaflet@1.5.1/dist/leaflet.css
    - https://unpkg.com/leaflet@1.5.1/dist/leaflet.js
  - External libraries:
    - D3.js V5 For DOM manipulation and data loading and visualization: https://d3js.org/d3.v5.js
  - Leaflet Plugin https://leafletjs.com/:
    - Leaflet is a widely used open source JavaScript library used to build web mapping applications. 
    - We used javascript plugin code as well as css from the leaflet website to make our map beautiful.

# Releases and Pre-releases

* **1.0 (pre-release) on November 8th, 2019**
-Data acquisition is completed and present in /data/EQ_data_updated.csv.
-Data structures are in place though not yet used or fully implemented.
-Includes a working visualization prototype. The direction and content is clear.
* **1.1 on December 1st, 2019**
-Added a landing page and website tabs
-Hooked up Sunburst visualization to the map
-Completed Scatterplot
-Styling looks more cohesive
-Improved map visuals including the geographical highlighting and labeling
