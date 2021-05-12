import * as get from "./get.js"

// PROPERTIES
export const FILL = "#666",
    STROKE = "#f8f8f8",
    PROJECTION = d3.geoMercator(),
    PATH = d3.geoPath().projection(PROJECTION),
    TOOLTIP = get.tooltip("body")

// DATA
export let geographicalData, meteoriteLandings

export function setGeographicalData(value) {
    if (geographicalData === undefined) geographicalData = value
    else throw Error()
}

export function setMeteoriteLandings(value) {
    if (meteoriteLandings === undefined) meteoriteLandings = value
    else throw Error()
}
