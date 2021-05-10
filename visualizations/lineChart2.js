export function lineChart2(data) {
    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      
    const yearGroup = groupBy(data, 'year');

    let occurrencesByYear = []

    var parseTime = d3.timeParse("%Y")

    for(let item of Object.entries(yearGroup)) {
        occurrencesByYear.push({"year": parseTime(item[0]), "value" : +item[1].length})
    }
    const width = 960
    const height = 420
    console.log("Infos:", occurrencesByYear)
    const margin = ({top: 20, right: 20, bottom: 30, left: 30})

    var line = d3.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.value); });
    const x = d3.scaleTime()
          .domain([new Date(860, 1, 1), new Date (2013, 1, 1)])
          .range([margin.left, width * 6 - margin.right])

    const minX = x(occurrencesByYear[0].year);
    const maxX = x(occurrencesByYear[occurrencesByYear.length - 1].year);
    //const overwidth = maxX - minX + margin.left + margin.right;
    const overwidth = 6000;
    const y = d3.scaleLinear()
      .domain([0, d3.max(occurrencesByYear, d => d.value)])
      .range([height - margin.bottom, margin.top])

    var parent = d3.select(".graph")
    console.log(parent)

    var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(15))  


    parent.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("z-index", 1)
      .call(svg => svg.append("g").call(yAxis));

    const body = parent.append("div")
      .style("overflow-x", "scroll")
      .style("-webkit-overflow-scrolling", "touch");


    

   

  var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0))

    body.append("svg")
      .attr("width", overwidth)
      .attr("height", height)
      .style("display", "block")
      .call(svg => svg.append("g").call(xAxis))
    .append("path")
      .datum(occurrencesByYear)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("d", line);

   

}