export function barChart(data) {
    let occurrencesByClass = d3.rollup(data, v => v.length, d => d.class)
    console.log(occurrencesByClass)

    // só pra ver como fica com poucos itens 
    occurrencesByClass = Array.from(occurrencesByClass).slice(1, 20),
    occurrencesByClass = new Map(occurrencesByClass)


    let margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    console.log(d3.extent(occurrencesByClass, d => d[1]))

    var y = d3.scaleBand()
            .domain(occurrencesByClass.keys())
            .range([0, height])
            .padding(0.1)

    var x = d3.scaleLinear()
        .domain(d3.extent(occurrencesByClass, d => d[1]))
        .range([0, width])

  
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

        svg.selectAll(".bar")
            .data(occurrencesByClass)
          .join("rect")
            .attr("class", "bar")
            //.attr("x", function(d) { return x(d.sales); })
            .attr("width", function(d) {return x(d[1]); } )
            .attr("y", function(d) { return y(d[0]); })
            .attr("height", y.bandwidth())
            .on("mousedown", function(e, d) {
                d3.select("#svgLine").remove()
                svg.selectAll(".bar").style("fill", "black")
                d3.select(this).style("fill","red");
                let name = d[0];
                let selection = data.filter(d => d["class"] == name);
                console.log(selection)
                drawLines(selection)
            });

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));


            svg.append("g").call(d3.axisLeft(y));
            
            function drawLines(data, svg) {
                let occurrencesByYear = d3.rollup(data, v => v.length, d => new Date(d.year, 1, 1))
                console.log(occurrencesByYear)


                let svgLine = d3.select("body").append("svg").attr("id","svgLine")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


                let x_vis2 = d3.scaleTime()
                    .domain([new Date(860, 1, 1), new Date(2013, 1, 1)])
                    //.domain(d3.extent(occurrencesByYear), d => d[0])
                    .range([0, width]);

                let xAxis = svgLine.append("g")
                    .attr("transform", "translate(0, " + height + ")")
                    .call(d3.axisBottom(x_vis2));

                let y_vis2 = d3.scaleLinear()
                    .domain([0, d3.max(occurrencesByYear, d => d[1])])
                    //.domain([0, 1000])
                    .range([height, 0]);
                let yAxis = svgLine.append("g")
                    .call(d3.axisLeft(y_vis2));

                // ClipPath!!
                var clip = svgLine.append("defs").append("svgLine:clipPath")
                    .attr("id", "clip")
                    .append("svgLine:rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", 0)
                    .attr("y", 0)

                var scatter = svgLine.append("g")
                    .attr("clip-path", "url(#clip)")

                scatter.selectAll("circle")
                    .data(occurrencesByYear)
                    .join("circle")
                    .attr("cx", d => x_vis2(d[0]))
                    .attr("cy", d => y_vis2(d[1]))
                    .attr("r", 8)
                    .style("fill", "#61a3a9")
                    .style("opacity", 0.5)

                var zoom = d3.zoom()
                    .scaleExtent([1, 1])
                    .extent([[0, 0], [width, height]])
                    .on("zoom", updateChart)
                    .translateExtent([[0, 0], [width + 13, height]])

              

                svgLine.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                    .call(zoom);
                
                
                function updateChart(event) {
                    var newX = event.transform.rescaleX(x_vis2);
                    //var newY = event.transform.rescaleY(y_vis2);

                    console.log(newX)
                    //console.log(newY)
                    xAxis.call(d3.axisBottom(newX))
                    //yAxis.call(d3.axisLeft(newY))

                    scatter
                        .selectAll("circle")
                        .attr("cx", d => newX(d[0]))
                        //.attr("cy", d => newY(d[1]));
                }
                


            console.log(x_vis2.domain())
            console.log(y_vis2.domain())

           
 
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