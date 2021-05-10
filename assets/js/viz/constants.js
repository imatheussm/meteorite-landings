import * as get from "./get.js"

export const FILL = "#666",
    STROKE = "#f8f8f8",
    PROJECTION = d3.geoMercator(),
    PATH = d3.geoPath().projection(PROJECTION),
    TOOLTIP = get.tooltip("body")
