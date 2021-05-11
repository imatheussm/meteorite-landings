import * as constants from "./constants.js"
import * as draw from "./draw.js"
import * as get from "./get.js"
import * as parse from "./parse.js"

function initialize(data) {
    let [geographicalData, meteoriteLandings] = data,
        projection = constants.PROJECTION, uniqueCategories


    meteoriteLandings.forEach(function(datum) {
        [datum.longitude, datum.latitude] = projection([datum.longitude, datum.latitude])

        if (datum.country === "United States") datum.country = "USA"
        else if (datum.country === "United Kingdom") datum.country = "England"
    })

    meteoriteLandings = meteoriteLandings.filter(datum => datum.year >= 860 && datum.year <= 2013)

    geographicalData = geographicalData.features
    uniqueCategories = get.uniqueValues(meteoriteLandings, "fall")

    draw.map(geographicalData, "#map")
    draw.circles(meteoriteLandings, "#map", uniqueCategories)
    
}

$(function() {
    Promise.all([
        d3.json(`/assets/json/countries.json`),
        d3.dsv(";", "/assets/csv/meteorite_landings.csv", parse.meteoriteLandings)
    ]).then(initialize)
})