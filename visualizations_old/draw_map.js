import { plot_circles } from "./plot.js"

export function draw(geo_data, svgMapa, projection) {
    console.log("Draw!")
    let svg = svgMapa
    var width = 1400,
    height = 600

    var path = d3.geoPath().projection(projection)

    const pathGroup = svg.append("g")
        .attr("id", "pathGroup")

    pathGroup.append("path")
        .attr("d", path(geo_data))
        .attr("fill", "teal")
        .attr("stroke", "black")
        .attr("stroke-width", 1)

    var zoom = d3.zoom()
        .scaleExtent([1, 2])
        .on('zoom', function(event) {
            pathGroup.attr('transform', event.transform);
        });

    svg.call(zoom);

}