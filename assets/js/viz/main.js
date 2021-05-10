import * as constants from "./constants.js"
import * as draw from "./draw.js"
import * as get from "./get.js"
import * as parse from "./parse.js"

function initialize(data) {
    let [geographicalData, meteoriteLandings] = data,
        projection = constants.PROJECTION,
        counts, meanValues, maxCount, maxMeanValue, uniqueCategories


    meteoriteLandings.forEach(function(datum) {
        [datum.longitude, datum.latitude] = projection([datum.longitude, datum.latitude])

        if (datum.country === "United States") datum.country = "USA"
        else if (datum.country === "United Kingdom") datum.country = "England"
    })

    geographicalData = geographicalData.features
    counts = get.counts(meteoriteLandings, "country")
    meanValues = get.meanValues(meteoriteLandings, counts, "country", "mass")
    maxCount = 3093
    maxMeanValue = 1779331.6333333333
    uniqueCategories = get.uniqueValues(meteoriteLandings, "fall")


    draw.choropleth(geographicalData, meteoriteLandings, "#mapOne", counts, maxCount, true)
    draw.choropleth(geographicalData, meteoriteLandings, "#mapTwo", meanValues, maxMeanValue, false)
    draw.map(geographicalData, "#mapThree")
    draw.circles(meteoriteLandings, "#mapThree", uniqueCategories)
}

$(function() {
    Promise.all([
        d3.json(`/assets/json/countries.json`),
        d3.dsv(";", "/assets/csv/meteorite_landings.csv", parse.meteoriteLandings)
    ]).then(initialize)
})
