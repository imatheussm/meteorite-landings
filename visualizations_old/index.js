import { barChart } from './barChart.js';

import { parse } from "./parse.js"


var width = 1400,
    height = 600

function initialize(data) {

    var projection = d3.geoMercator()
        .scale(170)
        .translate([width/2 , height/2]);


    let [geoData, meteorites] = data

    barChart(meteorites)


}

Promise.all([
    d3.json("./countries_compressed.json"),
    d3.csv("meteorite-landings.csv", parse)
]).then(initialize)
    .catch( err => { console.log(err) });