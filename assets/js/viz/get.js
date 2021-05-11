export function counts(dataSet, column, sortKey = false) {
    let counts = new Map(),
        columnValue, currentCount,
        sortedMap


    dataSet.forEach(function(datum) {
        columnValue = datum[column] || "Unknown"
        currentCount = counts.get(columnValue) || 0

        counts.set(columnValue, currentCount + 1)
    })

    sortedMap = new Map([...counts.entries()].sort(function(a, b) {
        return sortKey === true ? b[0] - a[0] : b[1] - a[1]
    }))

    return sortedMap
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


export function groupedDataSet(dataSet, by) {
    return dataSet.reduce(function(rv, x) {
        (rv[x[by]] = rv[x[by]] || []).push(x)

        return rv
    }, {})
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


export function ramp(color, n = 256) {
    let canvas = document.createElement("canvas"),
        context = canvas.getContext("2d")

    canvas.width = n
    canvas.height = 1

    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1))
        context.fillRect(i, 0, 1, 1)
    }

    return canvas
}
