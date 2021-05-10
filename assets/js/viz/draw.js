import * as adjust from "./adjust.js"
import * as constants from "./constants.js"
import * as eventFunctions from "./eventFunctions.js"
import * as get from "./get.js"
import * as filters from "./filters.js"
import * as legend from "./legend.js"

export function map(geographicalData, selector) {
    let elements = d3.selectAll(selector)


    elements.append("g")
        .selectAll("path")
        .data(geographicalData)
        .join("path")
        .attr("fill", constants.FILL)
        .attr("d", constants.PATH)

    adjust.boundingBox(elements)
}

export function choropleth(geographicalData, meteoriteLandings, selector, values, upperBound, isCount) {
    let elements = d3.selectAll(selector),
        tooltip = constants.TOOLTIP,
        palette = d3.scaleSequential([0, upperBound], d3.interpolateReds)


    elements.append("g")
        .selectAll("path")
        .data(geographicalData)
        .join("path")
        .attr("fill", datum => eventFunctions.getChoroplethColor(datum, values, upperBound, palette))
        .on("mouseover", function(event, datum) {
            if (datum.properties.name !== undefined) {
                let message, subMessage


                if (isCount === true) subMessage = `Occurrences: ${values.get(datum.properties.name) || "N/A"}`
                else subMessage = `Average mass: ${values.get(datum.properties.name) || "N/A"}`

                message = `Country: ${datum.properties.name}<br>${subMessage}`

                return eventFunctions.showChoroplethTooltip(event, message, tooltip)
            }
        })
        .on("mouseout", function() {eventFunctions.hideTooltip(tooltip)})
        .attr("d", constants.PATH)

    legend.choropleth(elements, isCount === true ? "Occurrences" : "Average mass", palette)
    adjust.boundingBox(elements)
}

export function circles(meteoriteLandings, selector, uniqueCategories) {
    // let massExtent = d3.extent(meteoriteLandings, datum => datum.mass),
    let elements = d3.selectAll(selector),
        radiusScale = d3.scaleLinear()
            .domain([0, 16000000])
            .range([1, 20]),
        colorPalette = d3.scaleOrdinal()
            .domain(uniqueCategories)
            .range(d3.schemeSet1.slice(0, 2).reverse()),
        tooltip = constants.TOOLTIP


    elements.selectAll("circle")
        .data(meteoriteLandings)
        .enter()
        .append("circle")
        .attr("class", "data-circle")
        .attr("cx", datum => datum.longitude)
        .attr("cy", datum => datum.latitude)
        .attr("r", datum => radiusScale(datum.mass <= 16000000 ? datum.mass : 16000000))
        .on("mouseover", function(event, datum) {eventFunctions.showCircleTooltip(event, datum, tooltip, radiusScale)})
        .on("mouseout", function() {eventFunctions.hideTooltip(tooltip)})
        .style("fill", datum => colorPalette(datum.fall))
        .style("opacity", 0.75)

    legend.circles(meteoriteLandings, elements, uniqueCategories, colorPalette, radiusScale)
}