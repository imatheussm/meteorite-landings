import * as main from "./main.js"
import * as variables from "./variables.js"


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


export function showBarTooltip(event, datum, tooltip) {
    let target = $(event.target),
        position = target.position(),
        tooltipWidth
    
    tooltip.html(`Class: ${datum[0]}<br>Occurrences: ${datum[1]}`)
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


export function getChoroplethColor(datum, values, maxValue, palette) {
    let value


    if (datum.properties.name !== undefined && values.get(datum.properties.name) !== undefined) {
        value = Math.min(values.get(datum.properties.name), maxValue)
    } else value = 0

    return palette(value)
}


export function updateMeteoriteType(event) {
    let fellCheckbox = $("#fellCheckbox"),
        foundCheckbox = $("#foundCheckbox"),
        selectedTypes = []

    if (fellCheckbox.is(':checked') === true) selectedTypes.push("Fell")
    if (foundCheckbox.is(':checked') === true) selectedTypes.push("Found")

    variables.updateSelectedTypes(selectedTypes)

    main.initializeVisualizations()
}


export function updateRangeOne(event) {
    this.value = Math.min(this.value, this.parentNode.childNodes[5].value - 1)

    let value = (100 / (parseInt(this.max) - parseInt(this.min))) *
        parseInt(this.value) - (100 / (parseInt(this.max) - parseInt(this.min))) *
        parseInt(this.min),
        children = this.parentNode.childNodes[1].childNodes


    children[1].style.width = value + "%"
    children[5].style.left = value + "%"
    children[7].style.left = value + "%"
    children[11].style.left = value + "%"
    children[11].childNodes[1].innerHTML = this.value

    $(this).attr("value", this.value)
}


export function updateRangeTwo(event) {
    this.value = Math.max(this.value, this.parentNode.childNodes[3].value - (-1))

    let value = (100 / (parseInt(this.max) - parseInt(this.min)))
        * parseInt(this.value) - (100 / (parseInt(this.max) - parseInt(this.min)))
        * parseInt(this.min),
        children = this.parentNode.childNodes[1].childNodes


    children[3].style.width = (100 - value) + "%"
    children[5].style.right = (100 - value) + "%"
    children[9].style.left = value + "%"
    children[13].style.left = value + "%"
    children[13].childNodes[1].innerHTML = this.value

    $(this).attr("value", this.value)
}


export function updateMassRange() {
    let minimumRange = $("#rangeOne").val() / 100,
        maximumRange = $("#rangeTwo").val() / 100


    variables.updateMassRange([minimumRange, maximumRange])

    main.initializeVisualizations()
}


// export function initializeMassRanges() {
//     let maxMass
//
//     maxMass = d3.max(constants.meteoriteLandings, datum => datum.mass)
//
//     console.log(maxMass)
//
//     $("#rangeOne").attr("max", maxMass)
//     $("#rangeTwo").attr("max", maxMass)
// }
