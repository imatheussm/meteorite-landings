export function counts(dataSet, groupBy) {
    let counts = new Map(),
        columnValue, currentCount


    dataSet.forEach(function(datum) {
        columnValue = datum[groupBy] || "Unknown"
        currentCount = counts.get(columnValue) || 0

        counts.set(columnValue, currentCount + 1)
    })

    return counts
}


export function meanValues(dataSet, counts, groupBy, column) {
    let meanValues = new Map(),
        columnValue, currentMeanValue


    dataSet.forEach(function(datum) {
        columnValue = datum[groupBy] || "Unknown"
        currentMeanValue = meanValues.get(columnValue) || 0

        meanValues.set(columnValue, currentMeanValue + datum[column])
    })

    meanValues.forEach(function (value, key) {
        meanValues.set(key, (value / counts.get(key)) || 0)
    })

    return meanValues
}


export function uniqueValues(dataSet, column) {
    let uniqueValues = [...new Set(dataSet.map(datum => datum[column]))],
        uniqueObjects = []


    uniqueValues.forEach(item => uniqueObjects.push({name: item}))

    return uniqueObjects
}


export function tooltip(selector) {
    return d3.select(selector)
        .append("div")
        .attr("class", "uk-tooltip uk-active uk-background-secondary")
        .attr("id", "tooltip")
        .style("display", "none")
        .style("position", "absolute")
        .style("text-align", "center")
}
