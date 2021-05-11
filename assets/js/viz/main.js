import * as constants from "./constants.js"
import * as draw from "./draw.js"
import * as get from "./get.js"
import * as parse from "./parse.js"


function preProcessData(data) {
    let [geographicalData, meteoriteLandings] = data,
        projection = constants.PROJECTION


    geographicalData = geographicalData.features

    meteoriteLandings = meteoriteLandings.filter(datum => datum.year >= 860 && datum.year <= 2013)    

    meteoriteLandings.forEach(function(datum) {
            [datum.longitude, datum.latitude] = projection([datum.longitude, datum.latitude])

            if (datum.country === "United States") datum.country = "USA"
            else if (datum.country === "United Kingdom") datum.country = "England"
        })
    
    return [geographicalData, meteoriteLandings]
}


function initializeConstants(geographicalData, meteoriteLandings) {
    constants.setGeographicalData(geographicalData)
    constants.setMeteoriteLandings(meteoriteLandings)

    try {
        get.counts()
    } catch {}

    // constants.setCountryOccurrences(get.counts(meteoriteLandings, "country"))
    // constants.setClassOccurrences(get.counts(meteoriteLandings, "class"))
    // constants.setYearOccurrences(get.counts(meteoriteLandings, "year", true))
    // constants.setMeanMasses(
    //     get.meanValues(meteoriteLandings, constants.countryOccurrences, "country", "mass")
    // )
    // constants.setUniqueCategories(get.uniqueValues(meteoriteLandings, "fall"))
}


function initializeVisualizations() {
    draw.choropleth("#mapOne", true)
    draw.choropleth("#mapTwo", false)
    draw.map("#mapThree")
    draw.circles("#mapThree")
    draw.barChart("#barChart")
    draw.lineChart("#lineChart")
}

$(function() {
    Promise.all([
        d3.json("https://imatheussm.github.io/meteorite-landings/assets/json/countries.json"),
        d3.dsv(";", "https://imatheussm.github.io/meteorite-landings/assets/csv/meteorite_landings.csv",
            parse.meteoriteLandings)
        // d3.json(`/assets/json/countries.json`),
        // d3.dsv(";", "/assets/csv/meteorite_landings.csv", parse.meteoriteLandings)
    ]).then(function(data) {
        const [GEOGRAPHICAL_DATA, METEORITE_LANDINGS] = preProcessData(data)


        initializeConstants(GEOGRAPHICAL_DATA, METEORITE_LANDINGS)
        initializeVisualizations()
    })
})
