export function showChoroplethTooltip(event, message, tooltip) {
    let target = $(event.target),
        position = target.position(),
        tooltipWidth


    tooltip.html(message)
        .style("display", "block")

    tooltipWidth = tooltip.node().getBoundingClientRect().width

    tooltip.style("top", (position.top - 30) + "px")
        .style("left", (position.left + (tooltipWidth / 2)) + "px")
}


export function showCircleTooltip(event, datum, tooltip, radiusScale) {
    let target = $(event.target),
        position = target.position(),
        radius = radiusScale(datum.mass <= 16000000 ? datum.mass : 16000000),
        tooltipWidth


    tooltip.html(`Name: ${datum.name}<br>Class: ${datum.class}<br>Mass: ${datum.mass}`)
        .style("display", "block")

    tooltipWidth = tooltip.node().getBoundingClientRect().width

    tooltip.style("top", (position.top - 60) + "px")
        .style("left", (position.left - (tooltipWidth / 2) + (radius / 2)) + "px")
}

export function hideTooltip(tooltip) {
    tooltip.style("display", "none")
}

export function getChoroplethColor(datum, values, maxValue) {
    let value


    if (datum.properties.name !== undefined && values.get(datum.properties.name) !== undefined) {
        value = values.get(datum.properties.name)

        if (value >= maxValue) value = 1
        else value /= maxValue
    } else value = 0

    return d3.interpolateReds(value)
}
