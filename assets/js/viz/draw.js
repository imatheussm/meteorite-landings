import * as adjust from "./adjust.js"
import * as constants from "./constants.js"
import * as eventFunctions from "./eventFunctions.js"
import * as filters from "./filters.js"

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
        tooltip = constants.TOOLTIP


    elements.append("g")
        .selectAll("path")
        .data(geographicalData)
        .join("path")
        .attr("fill", datum => eventFunctions.getChoroplethColor(datum, values, upperBound))
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

    circlesLegend(meteoriteLandings, elements, uniqueCategories, colorPalette, radiusScale)
}

function circlesLegend(dataSet, elements, uniqueCategories, colorPalette, radiusScale) {
    let categoryLegendGroup = elements.append("g")


    categoryLegendGroup.append("text")
        .text("Discovered")
        .style("font-size", "20px")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("font-weight", "bold")
        .style("cursor", "default")
        .attr("transform", `translate(${-0.5 + 5}, ${250})`)

    categoryLegendGroup.selectAll()
        .data(uniqueCategories)
        .join("g")
        .append("circle")
        .attr("class", "legend-circle")
        .attr("id", datum => `${datum.name.toLowerCase()}-circle`)
        .attr("r", 15)
        .attr("transform", (datum, index) => `translate(${-0.5 + 20}, ${280 + index * 40})`)
        .style("fill", datum => colorPalette(datum.name))
        .style("cursor", "pointer")
        .select(function() {return this.parentNode})
        .append("text")
        .text(d => d.name)
        .attr("x", -0.5 + 40)
        .attr("y", (datum, index) => -192.1917724609375 + 480 + index * 40)
        .style("font-size", "20px")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("cursor", "pointer")
        .select(function() {return this.parentNode})
        .on("click", function(event, category) {
            let circles = elements.selectAll("circle.data-circle"),
                legendCircles = elements.selectAll("circle.legend-circle")


            circles.data(dataSet)
                .filter(datum => datum.fall === category.name)
                .style("fill", function(datum) {
                    if (d3.select(this).style("fill") === "yellow") return colorPalette(datum.fall)
                    else return "yellow"
                })

            legendCircles.filter(datum => datum.name === category.name)
                .style("fill", function(datum) {
                    if (d3.select(this).style("fill") === "yellow") {
                        return colorPalette(datum.name)
                    }
                    else return "yellow"
                })

            circles.data(dataSet)
                .filter(datum => datum.fall !== category.name)
                .style("fill", datum => colorPalette(datum.fall))
        })

    // Size
    elements
        .append("text")
        .attr("x", -0.5 + 5)
        .attr("y", -192.1917724609375 + 570)
        .text("Mass")
        .style("font-size", "20px")
        .style("fill", "#666")
        .style("stroke", "none")
        .style("font-weight", "bold")
        .style("cursor", "default")
        .attr("alignment-baseline", "middle")

    elements
        .append("circle")
        .attr("cx", -0.5 + 20)
        .attr("cy", -192.1917724609375 + 600)
        .attr("r",  radiusScale(1))
        .style("fill", "#666")

    elements
        .append("circle")
        .attr("cx", -0.5 + 20)
        .attr("cy", -192.1917724609375 + 640)
        .attr("r", radiusScale(4000000))
        .style("fill", "#666")

    elements
        .append("circle")
        .attr("cx", -0.5 + 20)
        .attr("cy", -192.1917724609375 + 680)
        .attr("r", radiusScale(8000000))
        .style("fill", "#666")

    elements
        .append("circle")
        .attr("cx", -0.5 + 20)
        .attr("cy", -192.1917724609375 + 720)
        .attr("r", radiusScale(16000000))
        .style("fill", "#666")

    elements
        .append("text")
        .attr("x", -0.5 + 45)
        .attr("y", -192.1917724609375 + 602)
        .text("0")
        .style("font-size", "20px")
        .style("fill", "#666")
        .style("stroke", "none")
        .style("cursor", "default")
        .attr("alignment-baseline", "middle")

    elements
        .append("text")
        .attr("x", -0.5 + 45)
        .attr("y", -192.1917724609375 + 642)
        .text("4,000,000")
        .style("font-size", "20px")
        .style("fill", "#666")
        .style("stroke", "none")
        .style("cursor", "default")
        .attr("alignment-baseline", "middle")

    elements
        .append("text")
        .attr("x", -0.5 + 45)
        .attr("y", -192.1917724609375 + 682)
        .text("8,000,000")
        .style("font-size", "20px")
        .style("fill", "#666")
        .style("stroke", "none")
        .style("cursor", "default")
        .attr("alignment-baseline", "middle")

    elements
        .append("text")
        .attr("x", -0.5 + 45)
        .attr("y", -192.1917724609375 + 724)
        .text("16,000,000+")
        .style("font-size", "20px")
        .style("fill", "#666")
        .style("stroke", "none")
        .style("cursor", "default")
        .attr("alignment-baseline", "middle")
}
