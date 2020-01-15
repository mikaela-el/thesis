// (function () {
    //   console.log("hi")
    
    var width = 175,
        height = 400;
    
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
            //  console.log("data is", data)
            RadarChart.draw("#chart", data, config);
        })
        
        .catch(error => {
            // console.log("error is", error)
         
        })
        
        // var svg = d3.select('body')
        // 	.selectAll('svg')
        // 	.append('svg')
        // 	.attr("width", width)
        // 	.attr("height", height);
        	
        var RadarChart = {
          draw: function(id, d, options){
            //   console.log("drawing")
            var cfg = {
             radius: 10,
             w: 700,
             h: 400,
             factor: 1,
             factorLegend: .85,
             levels: 3,
             maxValue: 0,
             radians: 2 * Math.PI,
             opacityArea: 0.5,
             ToRight: 5,
             TranslateX: 30,
             TranslateY: 25,
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
                .range([15, 25])
            
            
            var total = allAxis.length;
            var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
            var Format = d3.format('%');
            d3.select(id).select("svg").remove();
            // console.log("thisCase", thisCase)
            var g = d3.select(thisCase)
            
                .append("svg")
                .attr("class", "keywordSVG")
                .attr("transform", "translate(" + -100 + "," + -150 + ")")
                .attr("width", cfg.w+cfg.ExtraWidthX + 700)
                .attr("height", cfg.h+cfg.ExtraWidthY)
                .append("g")
            //      .style("padding-bottom", (d) => {
            //     if (d.name == 'Gonzales v. Carhart' || d.name == 'Webster v. Reproductive Health Services' || d.name == 'Planned Parenthood of Central Missouri v. Danforth' || d.name == 'Carey v. Population Services International' || d.name == 'Planned Parenthood Association of Kansas City, Missouri, Inc. v. Ashcroft' || d.name == 'Akron v. Akron Center For Reproductive Health' || d.name == 'Thornburgh v. American College of Obstetricians and Gynecologists' || d.name == 'Ohio v. Akron Center for Reproductive Health' || d.name == 'Planned Parenthood of Southeastern Pennsylvania v. Casey' || d.name == 'National Organization for Women, Inc. v. Scheidler' || d.name == "Madsen v. Women's Health Center, Inc." || d.name == "Schenck v. Pro-Choice Network of Western New York" || d.name == "Scheidler v. National Organization for Women, Inc." || d.name == "Ayotte v. Planned Parenthood of Northern New England" || d.name == "Gonzales v. Planned Parenthood Federation of America, Inc." || d.name == "Whole Woman’s Health v. Hellerstedt" || d.name == "National Institute of Family and Life Advocates v. Becerra") {
            //         return "92px"
            //     } else {
            //         return "0px"
            //     }
            // })
                .attr("class", "keywordGROUP")
                .attr("transform", "translate(" + cfg.TranslateX + "," + (cfg.TranslateY-10) + ")")
                // .attr("visibility", "hidden");
                .attr("opacity", 0);
        
            series = 0;
            // console.log('ALL AXIS', allAxis)
            // console.log('g', g)
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
                //   console.log(d.count, fontScale(d.count))
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

