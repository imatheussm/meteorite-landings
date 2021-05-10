export function barChart2(data) {

    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      
    const classGroup = groupBy(data, 'class');

    let occurrencesByClass = []

    for(let item of Object.entries(classGroup)) {
        occurrencesByClass.push({"class": item[0], "value" : +item[1].length})
    }

    console.log("Infos:", occurrencesByClass)


    const margin = {top: 100, right: 20, bottom: 100, left: 100}

    const nbars = occurrencesByClass.length
    console.log(nbars)
    const width = 800,
          height = (nbars * 28) + margin.top
// 
    const svg = d3.select(".graph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font", "14px Montserrat");

    svg
        .append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .style("fill", "#F5F5F2");

    
    const scaleY = d3.scaleBand()
                .domain(occurrencesByClass.map(d => d.class))
                .range([0, nbars*25])
                .padding(0.3)

    const scaleX = d3.scaleLinear()
                .domain([0, d3.max(occurrencesByClass.map(d => d.value))])
                .range([margin.left, width - margin.right]);

    svg.append("g")
        .selectAll("rect")
        .data(occurrencesByClass)
        .join("rect")
        .attr("fill", "teal")
        .attr("width", function(d) {return scaleX(d.value); } )
        .attr("y", function(d) { return scaleY(d.class); })
        .attr("height", scaleY.bandwidth())
        .attr("transform", `translate(${margin.left}, ${margin.top})`)

    

    const xAxis = g => g
            .attr("transform", `translate(0, ${margin.top})`)
            .call(d3.axisTop(scaleX).tickSizeOuter(0).ticks(3))
            .call(g => g.select(".domain").remove());

    const yAxis = g => g
            .attr("transform", `translate(${margin.left}, ${margin.top })`)
            .call(d3.axisLeft(scaleY).tickSizeOuter(0))
            .call(g => g.select(".domain").remove());

    svg.append("g")
            .call(xAxis)
            .style("font-size", "12px");
        //y axis
    svg.append("g")
            .call(yAxis)
            .style("font-size", "14px");

    svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .attr("stroke-opacity", 0.1)

    svg.append("line")
    .attr("x1", margin.left)
    .attr("x2", margin.left)
    .attr("y1", margin.top - 6)
    .attr("y2", 25*nbars + 100)
    .attr("stroke-width", "2px")
    .style("stroke", "black")
    .style("opacity", 1);

    

}