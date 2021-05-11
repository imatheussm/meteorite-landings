import * as adjust from "./adjust.js"
import * as constants from "./constants.js"
import * as eventFunctions from "./eventFunctions.js"
import * as get from "./get.js"
import * as filters from "./filters.js"
import * as legend from "./legend.js"

export function map(geographicalData, selector) {
    let elements = d3.select(selector)


    elements.append("g")
        .selectAll("path")
        .data(geographicalData)
        .join("path")
        .attr("fill", constants.FILL)
        .attr("d", constants.PATH)

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
        .style("stroke-width", 0.5)

    legend.circles(meteoriteLandings, elements, uniqueCategories, colorPalette, radiusScale)
}

export function barChart(meteoriteLandings, selector, classCounts, yearCounts) {
    let xAxis = d3.scaleLinear()
            .domain([0, d3.max(Array.from(classCounts.values()))])
            .range([0, 800]),
        yAxis = d3.scaleBand()
            .domain(Array.from(classCounts.keys()))
            .range([0, classCounts.size * 50])
            .padding(0.3),
        elements = d3.selectAll(selector)


    elements.selectAll()
        .data(classCounts)
        .join("rect")
        .attr("fill", constants.FILL)
        //.attr("x", function(d) { return x(d.sales) })
        .attr("width", datum => xAxis(datum[1]))
        .attr("y", datum => yAxis(datum[0]))
        .attr("height", yAxis.bandwidth())
        .on("mousedown", function(event, bar) {
            elements.selectAll("rect").style("fill", constants.FILL)
            d3.select(this).style("fill", "indianred")

            // console.log(meteoriteLandings.filter(datumClass => datumClass.class === bar[0]))
            lineChart(meteoriteLandings.filter(datumClass => datumClass.class === bar[0]), "#lineChart",
                yearCounts)
        })

    d3.select("#barChartDiv")
        .style("height", `${parseFloat(window.getComputedStyle(d3.select("#mapThree").node()).height) * .75}px`)

    legend.barChart(elements, xAxis, yAxis)
    adjust.boundingBox(elements)
}

export function lineChart(meteoriteLandings, selector, yearCounts) {
    let elements = d3.selectAll(selector),
        timeParser = d3.timeParse("%Y"),
        xAxis = d3.scaleTime()
            .domain([new Date(860, 1, 1), new Date(2013, 1, 1)])
            .range([0, 10000]),
        yAxis = d3.scaleLinear()
            .domain([0, d3.max(Array.from(yearCounts.values()))])
            .range([1000, 0]),
        line = d3.line()
            .x(datum => xAxis(datum.year))
            .y(datum => {
                // console.log(datum)
                return yAxis(datum.counts)
            }),
        newYearCounts = []


    yearCounts.forEach((value, key) => newYearCounts.push({year: timeParser(key), counts: value}))

    elements.selectAll("*").remove()

    elements.append("path")
        .datum(newYearCounts)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 3)
        .attr("d", line)

    d3.select("#lineChartDiv")
        .style("width", `${3400}px`)

    legend.lineChart(elements, xAxis, yAxis)
    adjust.boundingBox(elements)
}