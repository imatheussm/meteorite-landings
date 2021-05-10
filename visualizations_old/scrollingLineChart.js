
// NAO USAR ESSE, É APENAS TESTE! 

export function scrollLine(data) {
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
        if (item[0] >= 860 && item[0] <= 2013)
            occurrencesByYear.push({"year": parseTime(item[0]), "value" : +item[1].length})
    }

    console.log("Infos:", occurrencesByYear)

    var margin = {top: 10, right: 30, bottom: 30, left: 60},
     width = 5000 - margin.left - margin.right,
     height = 390 - margin.top - margin.bottom;

    var svg = d3.select(".graph")
            .append("svg")
            .attr("width", width+margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime()
          .domain([new Date(860, 1, 1), new Date(2013, 1, 1)])
          .range([ 0, width ]);
    svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
          .domain([0, d3.max(occurrencesByYear, function(d) { return d.value; })])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));


    var line = d3.line()
    .x(function(d) { return x(d.year) })
    .y(function(d) { return y(d.value) })
          svg.append("path")
          .datum(occurrencesByYear)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", line
        )

        svg.selectAll(".dot")
            .data(occurrencesByYear)
        .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", line.x())
            .attr("cy", line.y())
            .attr("r", 8)
            .style("opacity", 0)
            .on("mouseover", function(event, d) {		
                div.style("opacity", .9);		
                div	.html("Valor:" + d.value)	
                    .style("left", (event.pageX) + "px")		
                    .style("top", (event.pageY - 28) + "px");	
                })					
            .on("mouseout", function() {		
                div.style("opacity", 0);	
            });;

            var div = d3.select("body")
            .append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);
    


}