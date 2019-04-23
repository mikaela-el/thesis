// (function () {
       console.log("hi")
    
    var width = 300,
        height = 300;
    
    // Config for the Radar chart
    var config = {
        w: width,
        h: height,
        maxValue: 100,
        levels: 5,
        ExtraWidthX: 300
    }
    
    const buildWordCloud = (caseID, thisCase) => {
            //Call function to draw the Radar chart
        d3.json(`keyWords/${caseID}.json`)
            .then(data => {
             console.log("data is", data)
            RadarChart.draw("#chart", data, config);
        })
        
        .catch(error => {
            console.log("error is", error)
         
        })
        
        // var svg = d3.select('body')
        // 	.selectAll('svg')
        // 	.append('svg')
        // 	.attr("width", width)
        // 	.attr("height", height);
        	
        var RadarChart = {
          draw: function(id, d, options){
              console.log("drawing")
            var cfg = {
             radius: 5,
             w: 700,
             h: 400,
             factor: 1,
             factorLegend: .85,
             levels: 3,
             maxValue: 0,
             radians: 2 * Math.PI,
             opacityArea: 0.5,
             ToRight: 5,
             TranslateX: 80,
             TranslateY: 30,
             ExtraWidthX: 0,
             ExtraWidthY: 0,
             color: d3.scaleOrdinal().range(["#6F257F", "#CA0D59"])
            };
        	
            if('undefined' !== typeof options){
              for(var i in options){
              if('undefined' !== typeof options[i]){
                cfg[i] = options[i];
              }
              }
            }
            
            cfg.maxValue = 100;
            
            var allAxis = (d.map(function(i, j){return i}));
            
            const fontScale = d3.scaleLinear()
                .domain([Math.min(...allAxis.map(d => d.count)), Math.max(...allAxis.map(d => d.count))])
                .range([12, 40])
            
            
            var total = allAxis.length;
            var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
            var Format = d3.format('%');
            d3.select(id).select("svg").remove();
            console.log("thisCase", thisCase)
            var g = d3.select(thisCase)
            
                .append("svg")
                .attr("class", "keywordSVG")
                .attr("transform", "translate(" + -25 + "," + -150 + ")")
                .attr("width", cfg.w+cfg.ExtraWidthX)
                .attr("height", cfg.h+cfg.ExtraWidthY)
                .append("g")
                .attr("class", "keywordGROUP")
                .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
                .attr("visibility", "hidden");
        
            series = 0;
            console.log('ALL AXIS', allAxis)
            console.log('g', g)
            var axis = g.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");
        
            axis.append("text")
              .attr("class", "keywords")
              .text(function(d){return d.word})
            //   .style("font-family", "sans-serif")
              .style("font-size", d => {
                  console.log(d.count, fontScale(d.count))
                  return `${fontScale(d.count)}px`
              }) 
              .attr("text-anchor", "middle")
              .attr("dy", "1.5em")
              .attr("transform", function(d, i){return "translate(0, -10)"})
              // changing the shape of the oval 
              .attr("x", function(d, i){return cfg.w/.5*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
              .attr("y", function(d, i){return cfg.h/5.5*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
        
            }
        }; 
    }
// })();
