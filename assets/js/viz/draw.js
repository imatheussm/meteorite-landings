export function map(geographicalData, selector) {
    let projection = d3.geoMercator(),
        path = d3.geoPath().projection(projection)


    d3.selectAll(selector)
        .append("g")
        .attr("class", "map")
        .append("path")
        .attr("d", path(geographicalData))
}

export function choropleth(geographicalData, meteoriteLandings, selector) {
    throw new Error()
}