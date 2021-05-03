import * as draw from "./draw.js"
import * as parse from "./parse.js"

function initialize(data) {
    let [geographicalData, meteoriteLandings] = data

    draw.map(geographicalData, ".map")
    // draw.choropleth(geographicalData, meteoriteLandings, "#mapOne")
}

$(function() {
    const IS_COMPRESSED = true

    Promise.all([
        d3.json(`/assets/geojson/countries${IS_COMPRESSED === true ? "_compressed" : ""}.geojson`),
        d3.dsv(";", "/assets/csv/meteorite_landings.csv", parse.meteoriteLandings)
    ]).then(initialize)
})
