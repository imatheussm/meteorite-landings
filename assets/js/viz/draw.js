import * as adjust from "./adjust.js"
import * as constants from "./constants.js"
import * as eventFunctions from "./eventFunctions.js"
import * as get from "./get.js"
import * as legend from "./legend.js"
import * as main from "./main.js"
import * as variables from "./variables.js"

export function map(selector) {
    const GEOGRAPHICAL_DATA = constants.geographicalData
    let elements = d3.select(selector)

    // Map title
    elements.append("text")
        .text("Occurrences Map: place of occurrence, mass and type of meteorites ")
        .style("font-size", "20px")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .attr("transform", `translate(${200}, ${-240})`)


    if (elements.size() === 0) return

    // Map draw
    elements.append("g")
        .selectAll("path")
        .data(GEOGRAPHICAL_DATA)
        .join("path")
        .attr("fill", constants.FILL)
        .attr("d", constants.PATH)

    let resetButton = d3.select("#button-container")

    resetButton.append("button")
        .attr("class", "uk-button uk-button-secondary uk-button-small")
        .append("text")
        .text("Reset Map")
        .on("click", function() {
            d3.selectAll("path").style("opacity", 1)
            d3.selectAll("circle.data-circle").style("opacity", 0.75)
            d3.selectAll("circle.legend-circle").style("opacity", 1)
    
    })

    adjust.boundingBox(elements)

}

export function choropleth(selector, isCount) {
    const GEOGRAPHICAL_DATA = constants.geographicalData,
        METEORITE_LANDINGS = get.filteredDataSet()
    let elements = d3.selectAll(selector),
        values = isCount === true ? get.counts(METEORITE_LANDINGS, "country") :
            get.meanValues(METEORITE_LANDINGS, "country", "mass"),
        upperBound = Math.min(isCount === true ? 3093 : 1779331.6333333333, d3.max(Array.from(values.values()))),
        tooltip = constants.TOOLTIP,
        palette = d3.scaleSequential([0, upperBound], isCount === true ? d3.interpolateReds : d3.interpolateBlues)

    if (elements.size() === 0) return

    elements.selectAll("*")
        .remove()

    if (isCount === true) values = get.counts(METEORITE_LANDINGS, "country")
    else values = get.meanValues(METEORITE_LANDINGS, "country", "mass")

    elements.append("g")
        .selectAll("path")
        .data(GEOGRAPHICAL_DATA)
        .join("path")
        .attr("fill", datum => eventFunctions.getChoroplethColor(datum, values, upperBound, palette))
        .on("mouseover", function(event, datum) {
            if (datum.properties.name !== undefined) {
                let message = `Country: ${datum.properties.name}<br>`,
                    name = isCount === true ? "Occurrences: " : "Average mass: ",
                    value = values.get(datum.properties.name) || "N/A"


                return eventFunctions.showChoroplethTooltip(event, message + name + value, tooltip)
            }
        })
        .on("mouseout", function() {eventFunctions.hideTooltip(tooltip)})
        .attr("d", constants.PATH)

    legend.choropleth(elements, isCount === true ? "Occurrences" : "Average mass", palette)
    adjust.boundingBox(elements)
}

export function circles(selector) {
    const METEORITE_LANDINGS = constants.meteoriteLandings
    let uniqueCategories = get.uniqueValues(METEORITE_LANDINGS, "fall"),
        elements = d3.selectAll(selector),
        radiusScale = d3.scaleLinear()
            .domain([0, 16000000])
            .range([1.5, 20]),
        colorPalette = d3.scaleOrdinal()
            .domain(uniqueCategories)
            .range(d3.schemeSet1.slice(0, 2).reverse()),
        tooltip = constants.TOOLTIP


    if (elements.size() === 0) return

    elements.selectAll("circle")
        .data(METEORITE_LANDINGS)
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

    legend.circles(METEORITE_LANDINGS, elements, uniqueCategories, colorPalette, radiusScale)
}

export function barChart(selector) {
    const METEORITE_LANDINGS = get.filteredDataSet(false)
    let classCounts = get.counts(METEORITE_LANDINGS, "class"),
        meanMasses = get.meanValues(METEORITE_LANDINGS, "class", "mass"),
        // yearCounts = get.counts(METEORITE_LANDINGS, "year", true),
        elements = d3.selectAll(selector),
        xAxis = d3.scaleLinear()
            .domain([0, d3.max(Array.from(classCounts.values()))])
            .range([800, 0]),
        yAxis = d3.scaleBand()
            .domain(Array.from(classCounts.keys()))
            .range([0, classCounts.size * 50])
            .padding(0.3),
        tooltip = constants.TOOLTIP


    if (elements.size() === 0) return

    elements.selectAll("*")
        .remove()

    elements.append("g")
        .attr("class","grid")
        // .attr("transform","translate(0, 1000)")
        .style("stroke-dasharray",("3, 3"))
        .call(get.XGridLines(xAxis, 8)
            .tickSize(23100)
            .tickFormat("")
            .ticks(8)
        )

    elements.append("g")
        .attr("class","grid")
        .style("stroke-dasharray",("3, 3"))
        .call(get.YGridLines(yAxis, 5)
            .tickSize(-800)
            .tickFormat("")
        )

    elements.selectAll()
        .data(classCounts)
        .join("rect")
        .attr("fill", datum => variables.selectedClasses.includes(datum[0]) === true ? "indianred" : constants.FILL)
        //.attr("x", function(d) { return x(d.sales) })
        .attr("width", datum => 800 - xAxis(datum[1]))
        .attr("y", datum => yAxis(datum[0]))
        .attr("height", yAxis.bandwidth())
        .attr("x", datum => xAxis(datum[1]))
        .style("cursor", "pointer")
        // .attr("transform", "translate(1000, 0)")
        .on("mouseover", function(event, datum) {
            eventFunctions.showBarTooltip(event, datum, tooltip, meanMasses.get(datum[0]))
        })
        .on("mouseout", function() {eventFunctions.hideTooltip(tooltip)})
        .on("click", function(event, bar) {
            let className = bar[0]


            if (variables.selectedClasses.includes(className) === true)
                variables.selectedClasses.splice(variables.selectedClasses.indexOf(className), 1)
            else variables.selectedClasses.push(className)

            main.initializeVisualizations()
        })

    d3.select("#barChartDiv")
        .style("height", `${parseFloat(window.getComputedStyle(d3.select("#mapOne").node()).height) * .75}px`)

    legend.barChart(elements, xAxis, yAxis)
    adjust.boundingBox(elements)
}

export function lineChart(selector) {
    const METEORITE_LANDINGS = get.filteredDataSet()

    let yearCounts = get.counts(METEORITE_LANDINGS, "year", true, true),
        elements = d3.select(selector),
        timeParser = d3.timeParse("%Y"),
        xAxis = d3.scaleTime()
            .domain([
                new Date(860, 1, 1),
                new Date(2013, 1, 1)
                // new Date(Math.max(860, d3.min(Array.from(yearCounts.values()))), 1, 1),
                // new Date(Math.min(2013, d3.max(Array.from(yearCounts.values()))), 1, 1)
            ])
            .range([0, 10000]),
        yAxis = d3.scaleLinear()
            .domain([0, d3.max(Array.from(yearCounts.values()))])
            // .domain([0, 3323])
            .range([1000, 0]),
        line = d3.line()
            .x(datum => xAxis(datum.year))
            .y(datum => yAxis(datum.counts)),
        newYearCounts = [],
        childDiv, svg


    if (elements.size() === 0) return

    elements.selectAll("*")
        .remove()

    childDiv = elements.append("div")
        .attr("class", "uk-margin-remove uk-height-1-1")
        .attr("id", "lineChartChildDiv")

    svg = childDiv.append("svg")
        .attr("class", "chart chart-muted")
        .attr("id", "lineChartSVG")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "-0.5 -192.1917724609375 961 922.6917724609375")

    yearCounts.forEach((value, key) => newYearCounts.push({year: timeParser(key), counts: value}))

    svg.append("path")
        .datum(newYearCounts)
        .attr("fill", "none")
        // .attr("stroke", "steelblue")
        .attr("stroke", constants.FILL)
        .attr("stroke-width", 6)
        .attr("d", line)

    svg.append("g")
        .attr("class","grid")
        .attr("transform","translate(0, 1000)")
        .style("stroke-dasharray",("3, 3"))
        .call(get.XGridLines(xAxis, 8)
          .tickSize(-1000)
          .tickFormat("")
          .ticks(100)
        )

    svg.append("g")
        .attr("class","grid")
        .style("stroke-dasharray",("3, 3"))
        .call(get.YGridLines(yAxis, 5)
          .tickSize(-10000)
          .tickFormat("")
        )


    legend.lineChart(svg, xAxis, yAxis)
    adjust.boundingBox(svg)

    childDiv.style("width", `${svg.node().getBBox().width * (parseFloat(window.getComputedStyle(d3.select("#mapOne").node()).height) - 28) * .75 / svg.node().getBBox().height}px`)
}