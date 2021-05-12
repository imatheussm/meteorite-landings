import * as constants from "./constants.js"
import * as get from "./get.js"

export function circles(dataSet, elements, uniqueCategories, colorPalette, radiusScale) {
    let categoryLegendGroup = elements.append("g")


    categoryLegendGroup.append("text")
        .text("Discovered")
        .style("font-size", "20px")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("font-weight", "bold")
        .style("cursor", "default")
        .attr("transform", `translate(${0}, ${250})`)

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
        .style("transition", ".125s filter linear, .125s -webkit-filter linear")
        .on("mouseover", (event) => d3.select(event.target).style("filter", "brightness(75%)"))
        .on("mouseout", (event) => d3.select(event.target).style("filter", "none"))
        .on("click", function(event, category) {
            let circles = elements.selectAll("circle.data-circle"),
                legendCircles = elements.selectAll("circle.legend-circle"),
                paths = elements.selectAll("path")


            paths.attr("opacity", 0.3)

            circles.style("opacity", 1)
            legendCircles.style("opacity", 1)

            circles.data(dataSet)
                .filter(datum => datum.fall !== category.name)
                .style("opacity", 0.1)

            legendCircles.filter(datum => datum.name !== category.name)
                .style("opacity", 0.1)
        })
        .select(function() {return this.parentNode})
        .append("text")
        .text(d => d.name)
        .attr("x", -0.5 + 40)
        .attr("y", (datum, index) => -192.1917724609375 + 480 + index * 40)
        .style("font-size", "20px")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("cursor", "default")
        .select(function() {return this.parentNode})

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

export function choropleth(elements, title, palette) {
    const n = Math.min(palette.domain().length, palette.range().length)
    let scaleLegendGroup = elements.append("g"),
        paddingTop = 640,
        paddingLeft = 5,
        scaleWidth = 290,
        scaleHeight = 20,
        x = palette.copy().rangeRound(d3.quantize(d3.interpolate(paddingLeft, scaleWidth), n)),
        scaleGroup = elements.append("image"),
        ticksGroup = elements.append("g"),
        ticks = 4,
        tickSize = 2,
        tickAdjust = g => g.selectAll(".tick line").attr("y1", -0.5 - scaleHeight),
        lastTicker, lastTickerText


    scaleLegendGroup.append("text")
        .text(title)
        .style("font-size", "20px")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("font-weight", "bold")
        .style("cursor", "default")
        .attr("transform", `translate(${-0.5 + paddingLeft}, ${430})`)

    scaleGroup.attr("x", -0.5 + paddingLeft)
        .attr("y", -192.1917724609375 + paddingTop)
        .attr("width", scaleWidth)
        .attr("height", scaleHeight)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", get.ramp(palette.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL())

    ticksGroup
        .attr("transform", `translate(${-0.5 + paddingLeft - 4}, ${-192.1917724609375 + paddingTop + scaleHeight})`)
        .call(d3.axisBottom(x)
            .ticks(ticks, palette.tickFormat)
            // .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickFormat(palette.tickFormat(ticks))
            .tickSize(tickSize)
        )
        .call(tickAdjust)
        .call(g => g.select(".domain").remove())

    d3.selectAll("g.tick text")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("font-weight", "bold")
        .style("font-size", "15px")
        .style("cursor", "default")

    try {
        lastTicker = ticksGroup.select(".tick:last-of-type text")
        lastTickerText = lastTicker.text()

        if (lastTickerText.charAt(lastTickerText.length - 1) !== "+") lastTicker.text(`${lastTickerText}+`)
    } catch {}
}

export function barChart(elements, xAxis, yAxis) {
    elements.append("g")
        .call(d3.axisTop(xAxis))

    elements.append("g")
        .attr("transform", "translate(800, 0)")
        .call(d3.axisRight(yAxis))
    

    elements.selectAll("g.tick text")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("font-size", "20px")
        .style("cursor", "default")
        // .call(adjust.text, 80)
}

export function lineChart(elements, xAxis, yAxis) {
    elements.append("g")
        .attr("transform", `translate(0, ${1000})`)
        .call(d3.axisBottom(xAxis).ticks(100))

    elements.append("g")
        .call(d3.axisLeft(yAxis))

    elements.selectAll("g.tick text")
        .style("fill", constants.FILL)
        .style("stroke", "none")
        .style("font-size", "30px")
        .style("cursor", "default")
}
