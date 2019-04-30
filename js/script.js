//A global object to hold all of our logic.
let chart = {};



//Here's where we call our data. We're calling more than one file, so we're gonna stack our calls in a promise
//This gives us a single callback once all of our files are loaded.
//Asynchronous data loading rules!
Promise.all([
    d3.json("./data/geocity.geojson"), //citydata
    // d3.json("./data/gz_2010_us_outline_20m.json"),
    d3.json("./data/gz_2010_us_040_00_20m_simplified.json"), //states
    d3.csv("./data/songs.csv") //Counties
]).then(data => {
    //This is the callback


    init(data);
});

function init(data) {

    chart.cityLoc = data[0]; //cities
    // chart.outline = data[1];
    chart.states =data[1];
    chart.songs = data[2];
    chart.lookup = {};

    // console.log(chart.usGeo);

    //Append our elements to the page. This only happens on load.
    appendElements();

    //Update positions and styles for everything on the page
    //whenever we update the page (on re-size, for example).
    update();


    d3.select(window).on("resize", d => {
        update();
    });


}


function update() {
    setDimensions();
    setScales();
    updateElements();
}


function setDimensions() {

    chart.margin = {
        top: 30,
        right: 30,
        bottom: 40,
        left: 100
    };

    let targetWidth = document.querySelector(".chart").offsetWidth;
    let targetHeight = document.querySelector(".chart").offsetHeight;

    chart.width = targetWidth - chart.margin.left - chart.margin.right;
    chart.height = targetHeight - chart.margin.top - chart.margin.bottom;

}


function setScales() {


    chart.projection = d3.geoAlbersUsa();

    chart.path = d3.geoPath()
        .projection(chart.projection);




}






function appendElements() {

    //SVG is the container.
    chart.svg = d3.select(".chart").append("svg");

    //The plot is where the charting action happens.
    chart.plot = chart.svg.append("g").attr("class", "chart-g");

    chart.plot.selectAll(".state")

     chart.states = chart.svg.selectAll("path.state")
        .data(chart.states.features)
        .enter().append("path")
        .attr("class", "state")

    chart.citiesmap = chart.svg.selectAll("path.City")
        .data(chart.cityLoc.features).enter()
        .append("path")
        .attr("class", "city")



        //WHATS HAPPENING ^^^^ WHY U NOT BLUE (the enter)

   

    // chart.outlineMap = chart.svg.selectAll("path.outline")
    //     .data(chart.outline.features).enter()
    //     .append("path")
    //     .attr("class", "county")

    // chart.cities = chart.svg.selectAll("path.city")
    //     .data(chart.cityLoc)
    //     .enter().append("circle")
    //     .attr("class", "city");



}


function updateElements() {

    //The this.svg will be the FULL width and height of the parent container (this.element)
    chart.svg.attr("width", chart.width + chart.margin.left + chart.margin.right);
    chart.svg.attr("height", chart.height + chart.margin.top + chart.margin.bottom);

    //this.plot is offset from the top and left of the this.svg
    chart.plot.attr("transform", `translate(${chart.margin.left},${chart.margin.top})`);
    chart.citiesmap.attr("d", chart.path)
        .style("fill", d=> {
            return "blue"
        }




            )
    // chart.counties.attr("d", chart.path);

    // chart.states.attr("d", chart.path);

    // chart.cities.each(d => {
    //         d.coord = [d.longitude, d.latitude];
    //     })
    //     .attr("cx", d => {
    //         return chart.projection(d.coord)[0];
    //     })
    //     .attr("cy", d => {
    //         return chart.projection(d.coord)[1];
    //     })
    //     .attr("r", 1)
    //     .style("fill", "#333")


}
