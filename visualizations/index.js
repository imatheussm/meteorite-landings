import { barChart } from './barChart.js';
import { draw } from './draw_map.js'
import { lineChart } from './lineChart.js';
import { parse } from "./parse.js"
import { plot_circles } from './plot.js';
import { barChart2 } from './barChart2.js'
import { lineChart2 } from './lineChart2.js'
import { scrollLine } from './scrollingLineChart.js';

var width = 1400,
    height = 600

function initialize(data) {

    var projection = d3.geoMercator()
        .scale(170)
        .translate([width/2 , height/2]);

    // var svgMapa = d3.select("body")
    //     .append("svg")
    //         .attr("width", width)
    //         .attr("height", height)
    //     .append("g")
    //         .attr("class", "map")
    let [geoData, meteorites] = data
    //console.log(geoData)
    //draw(geoData, svgMapa, projection)
    //plot_circles(meteorites, svgMapa, projection)
    barChart(meteorites)
    //lineChart(meteorites)
    //barChart2(meteorites)
    //lineChart2(meteorites)
    //scrollLine(meteorites)

}

Promise.all([
    d3.json("./countries_compressed.json"),
    d3.csv("meteorite-landings.csv", parse)
]).then(initialize)
    .catch( err => { console.log(err) });