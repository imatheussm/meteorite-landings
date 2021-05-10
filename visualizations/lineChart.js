export function lineChart(data) {

    console.log(data)

    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };
      
    const yearGroup = groupBy(data, 'year');

    let infos = []

    for(let item of Object.entries(yearGroup)) {
        infos.push({"year": new Date(item[0], 1, 1), "value" : +item[1].length})
    }

    console.log("Infos:", infos)


    var margin = {top: 20, right: 30, bottom: 20, left: 100},
        width = 1400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
		
    // Basic SVG canvas
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseDate = d3.timeParse("%Y");

    var displayDate = d3.timeFormat("%y");
    var displayValue = d3.format(",.0f");
        	
    // Temporal scale
    var x = d3.scaleTime()
        .range([0, width]);

		// Linear scale
    var y = d3.scaleLinear()
        .range([height, height - 200]);

    var line = d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.value); });

    var g = svg.append("g")
    	.attr("transform", "translate(10, 0)");

    x.domain(d3.extent([new Date(800, 1, 1), new Date(2025, 1, 1)]));
    y.domain([0, d3.max(infos, function(d) { return d.value; })]);

      
        g.selectAll("path").data([infos]).enter().append("path")
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
        
          svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(20));



    
    



    }