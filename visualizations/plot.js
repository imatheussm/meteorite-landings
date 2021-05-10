export function plot_circles(data, svgMapa, projection) {
    console.log("Plotting..")

    // Projection conversion
    data.forEach(d => {
        const coords = projection([+d.longitude, +d.latitude])
        d.latitude = coords[1]
        d.longitude = coords[0]
    });

    // Max and min mass
    let mass_extent = d3.extent(data, d => d.mass);

    // Scale
    let radius_scale = d3.scaleLinear()
        .domain(mass_extent)
        .range([1,10]);

    
    // Plotting the Circles
    let pathGroup = d3.select("g#pathGroup")
    var circles = pathGroup.append('g')
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("id", d => d.class)
            .attr("cx", d => d.longitude)
            .attr("cy", d => d.latitude)
            .attr("r", d => radius_scale(d.mass))
            .style("fill", d => type_color(d.fall))
            .on("mouseover", function(event, d) {		
                div.style("opacity", .9);		
                div	.html("Massa:" + d.mass)	
                    .style("left", (event.target) + "px")
                    .style("top", (event.pageY - 28) + "px");	
                })					
            .on("mouseout", function() {		
                div.style("opacity", 0);	
            });
            
    // Tooltip
    var div = d3.select("body")
        .append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);

    var keys = [{name: "Fell"}, {name: "Found"}]

    // Interactive legend
    var myColor = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeSet2);

    console.log(myColor("Fell"))

    var svg = d3.select("body").append("svg")

    var legendGroup = svg.append("g").attr("class", "legendGroup")

    legendGroup.selectAll()
                .data(keys)
                .join("g")
                .append("circle")
                    .attr('r', 10)
                    .attr('transform', function(d, i) { 
                        let y = 30 + i*30
                        return "translate(40, " + y +")"})
                    .style("fill", d => type_color(d.name))
                .select(function(){ return this.parentNode})
                .append("text")
                .text(d => d.name)
                .attr('x', 60)
                    .attr('y', function(d, i) { 
                        let y = 37 + i*30
                        return y
                })
                .select(function(){ return this.parentNode})
                .on("click", function(e, d) {
                    console.log(d.name)
                    console.log("clicked!")
                    let name = d.name
                    svgMapa.selectAll("circle")
                    .data(data)
                    .style("fill", d => type_color(d.fall))
                    .filter(function(data){
                        return data.fall === name
                    })
                    .style("fill", "yellow")
                    
                })
    
    

    // 
    // var legendGroup = d3.select("svg").append("g").attr("class", "tick")
            
    // legendGroup.append("circle")
    //             .attr("cx",200)
    //             .attr("cy",130)
    //             .attr("r", 6)
    //             .style("fill", "#69b3a2")
    // legendGroup.append("circle")
    //             .attr("cx",200)
    //             .attr("cy",160)
    //             .attr("r", 6)
    //             .style("fill", "#404080")
    // legendGroup.append("text").attr("x", 220).attr("y", 130).text("Fell").style("font-size", "15px").attr("alignment-baseline","middle")
    // legendGroup.append("text").attr("x", 220).attr("y", 160).text("Found").style("font-size", "15px").attr("alignment-baseline","middle")

    
    // legendGroup.on('click', onClick)

    // function onClick(elemData) {
    //     console.log(elemData.select("text"))
    // }

        function type_color(d){
            switch (d){
                case "Fell":
                    return "#69b3a2";
                case "Found":
                    return "#404080";

            }
        }
        

}    