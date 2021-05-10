export function barChart(data) {
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

    // só pra ver como fica com poucos itens 
    
    let nbars = occurrencesByClass.length

    let margin = {top: 40, right: 20, bottom: 60, left: 80},
        width = 800,
        height = (nbars * 25) - 55

    console.log(d3.extent(occurrencesByClass, d => d[1]))

    var y = d3.scaleBand()
            .domain(occurrencesByClass.map(d => d.class))            
            .range([0, nbars*25])
            .padding(0.3)

    var x = d3.scaleLinear()
        .domain([0, d3.max(occurrencesByClass.map(d => d.value))])
        .range([margin.left, width - margin.right]);

  
    var svg = d3.select(".graph").append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
        svg
            .append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("fill", "#F5F5F2");

        svg.selectAll(".bar")
            .data(occurrencesByClass)
          .join("rect")
            .attr("class", "bar")
            //.attr("x", function(d) { return x(d.sales); })
            .attr("width", function(d) {return x(d.value); } )
            .attr("y", function(d) { return y(d.class); })
            .attr("height", y.bandwidth())
            .on("mousedown", function(e, d) {
                d3.select("#svgLine").remove()
                svg.selectAll(".bar").style("fill", "black")
                d3.select(this).style("fill","red");
                let name = d.class;
                let selection = data.filter(d => d.class == name);
                //console.log(selection)
                drawLines(selection)
            });

            svg.append("g")
                 .call(d3.axisTop(x));


             svg.append("g").call(d3.axisLeft(y));

            drawLines(data)
            
            
            function drawLines(data, svg) {
                width = 960
                height = 420
                margin = {top: 20, right: 20, bottom: 30, left: 30}

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
                //const overwidth = 5800;

                var line = d3.line()
                    .x(function(d) { return x(d.year); })
                    .y(function(d) { return y(d.value); });
                const x = d3.scaleTime()
                    .domain([new Date(860, 1, 1), new Date (2013, 1, 1)])
                    .range([margin.left, width * 6 - margin.right])
                    

                const minX = x(occurrencesByYear[0].year);
                const maxX = x(occurrencesByYear[occurrencesByYear.length - 1].year);
                //const overwidth = maxX - minX + margin.left + margin.right;
                const overwidth = 5800
                
                const y = d3.scaleLinear()
                .domain([0, 3400])
                .range([height - margin.bottom, margin.top])

                var parent = d3.select(".graph2").append("g").attr("id", "svgLine")

                var yAxis = g => g
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y).ticks(15))  


                parent.append("svg")
                .attr("id", "svgLine")
                .attr("width", width)
                .attr("height", height)
                .style("position", "absolute")
                .style("pointer-events", "none")
                .style("z-index", 1)
                .call(svg => svg.append("g").call(yAxis));

                const body = parent.append("div")
                .style("overflow-x", "scroll")
                .style("direction", "rtl")
                .style("-webkit-overflow-scrolling", "touch");

            var xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(20))

                
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

                body.node().scrollBy(overwidth, 0);

            }
                
        
            
        
        
        // function drawLines(data, svg) {
        //     let occurrencesByYear = d3.rollup(data, v => v.length, d => new Date(d.year, 1, 1))
        //     console.log(occurrencesByYear)

        //     let margin = 75,
        //     width = 500 - margin,
        //     height = 500 - margin;
            
  
        //     let x = d3.scaleTime()
        //         .domain([new Date(860, 1, 1), new Date(2013, 1, 1)])
        //         //.domain(d3.extent(occurrencesByYear), d => d[0])
        //         .range([0, width])

        //     let y = d3.scaleLinear()
        //         .domain([0, d3.max(occurrencesByYear, d => d[1])])
        //         .range([height - margin, margin])
            
        //     let line = d3.line()
        //         .defined(d => !isNaN(d[1]))
        //         .x(d => x(d[0]))
        //         .y(d => y(d[1]))

        //     console.log(x.domain())

        //     var xAxis = d3.axisBottom(x);

        //     var yAxis = d3.axisLeft(y);

        //     svg.append("g").call(yAxis);
        //     svg.append("g").call(xAxis);

        //     svg.select("#grafico").remove()
        //     svg.append("path")
        //         .attr("id", "grafico")
        //         .datum(occurrencesByYear)
        //         .attr("fill", "none")
        //         .attr("stroke", "steelblue")
        //         .attr("d", line);

                
        // }

}