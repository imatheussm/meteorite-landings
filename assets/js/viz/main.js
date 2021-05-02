function draw(geoData, selector) {
    let projection = d3.geoMercator(),
        path = d3.geoPath().projection(projection)


    d3.select(selector)
        .append('g')
        .attr('class', 'map')
        .append("path")
        .attr("d", path(geoData))
}

$(function() {
    const IS_COMPRESSED = true;

    d3.json(`/assets/geojson/countries${IS_COMPRESSED === true ? "_compressed" : ""}.geojson`)
        .then(function(geoData) {
            draw(geoData, "#mapOne")
            draw(geoData, "#mapTwo")
            draw(geoData, "#mapThree")
        })
        .catch(err => { console.log(err) })
})
