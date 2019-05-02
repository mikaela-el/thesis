// load data set  
let yearData = [];
d3.json("yeardata.json")
    .then(data => {
    yearData = data
    })

const yearJusticeCount = {
    // 150: 0,
    //7885: 1,
    7000: 1,
    // 13358: 2,
    11000: 2,
    // 18908: 1,
    14000: 1,
    // 19954: 3
    16000: 3
}

const yearFemalePop = {
    10: 104076122,
    250: 105443973,
    500: 105443973,
    750: 105443973,
    1000: 107643874,
    1250: 109771934,
    2300: 109771934,
    1056: 110880498,
    1119: 110880498,
    1308: 110880498,
    1371: 110880498,
    1434: 110880498,
    1497: 113350788,
    1623: 113350788,
    1686: 113350788,
    1749: 114675212,
    1812: 114675212
}

var getClosest = function (arr, num) {
    let closest
    for (var i = 0; i< arr.length; i++){
        if (num > arr[i]) {
            closest = arr[i]
        }
    }
    return closest
}


console.log(yearData)

const spacing = 150;

const positionMap = {};

let breakpoints = Object.keys(yearJusticeCount);

let breakpointsPopulation = Object.keys(yearFemalePop);

    const justiceLineScale = d3.scaleLinear()
            .domain([0,9])
            .range([0, window.innerWidth])
            console.log(justiceLineScale(9))

//  d3.select("#enterSite").on("click", () => {
//     d3.select("#landingPage").style("visibility", "hidden")
//     })

// this function should look through the current position and find the ID of the case whose Yposition is closest but less than the current scroll position
const findCurrentCase = (scrollPosition) => {
    
}

fetch("https://api.oyez.org/cases?filter=issue:423&page=0&per_page=0")
.then(res=>res.json())
.then(response=>{
    console.log(response);
    
    // goes over every case like a for loop but makes a new array
    // assigns new array to the variable "cases"
    var cases = response.map(singleCase=>{
        
        // Research find 
        let decidedDate = singleCase.timeline.find(item => {
            return item.event == "Decided";
        });
        
        return {
            name: singleCase.name,
            ID: singleCase.ID,
            date: decidedDate.dates[0],
            term: singleCase.term,
            caseURL: 'https://api.oyez.org/cases/' + singleCase.term + '/' + singleCase.docket_number
        };
    });
    
    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var fElem = a[key]; var sElem = b[key];
            return ((fElem < sElem) ? -1 : ((fElem > sElem) ? 1 : 0));
        });
    }
    
    sortByKey(cases, "term");
    
    return cases;
})

// this is for the justice line and scrolling 
.then(caseList=>{
    let numJustices = 0 ;
    let womenPop = 0;
    // console.log(JSON.stringify(caseList))
    window.addEventListener('scroll', function() { 
        // this is finding the place of the divs and then matching with the index and id 
        console.log(pageYOffset)
        //const insertion = d3.bisectLeft(breakpoints, this.pageYOffset)
        
        const closestBreakpoint = getClosest( breakpoints, this.pageYOffset)
        
        console.log('closestBreakpoint', closestBreakpoint)
        
        numJustices = yearJusticeCount[closestBreakpoint]
        //const currentCase = caseList.find(d => d.ID===caseInView)
        // console.log(insertion)
     
        //console.log('We found a case', caseInView)
        console.log("breakpoints:", breakpoints)
        //const currentYear = yearData.find(d => d.year===+currentCase.term)
        // console.log(currentYear)
        closestBreakpointPop = getClosest( breakpointsPopulation, this.pageYOffset)
        womenPop = yearFemalePop[closestBreakpointPop]
        console.log('womenPop', womenPop)
        //numJustices = currentYear.femaleJustice
        // console.log(womenPop)
            d3.select("#justiceLine")
            // .style("left", `${justiceLineScale(0)}px`)
            .transition()
            .duration(1000)
            .style("left", `${justiceLineScale(numJustices)}px`)
            .text( (!numJustices ? 0 : numJustices)  + " Women on Supreme Court")
            d3.select("#femalePopulation")
                // .enter() // DATA JOINS 
                // .append('text')
                .html("Women in the United States: " + (!womenPop ? 0 : womenPop))
        console.log(caseList)
    })
    
    // d3.select(justiceLine)
    //     .append("text")
    //     .text( numJustices + "Women on Supreme Court")
    //     .attr("font-size", "'Libre Baskerville', serif")
    
   
    // this is creating an div for timeline 
    let timeline  = d3.select('#timeline')
        .append('div')
        .attr("id", "caseList")
        .attr('position', 'relative')
        .attr('width', 1200)
        .attr('height', caseList.length*150) // 150 becasue of font size
    
    
    d3.select("#closeSingleCase").on("click", () => {
        let caseName = d3.select('#caseName')
        caseName.selectAll("text").remove()
        d3.select("body")
        .classed("case", false);
        // d3.select("#singleCase").style("visibility", "hidden")
    }) // DATA JOIN 
        
    // creating groups for each case and putting into timeline div 
    let cases = timeline.selectAll('div.case')
           .data(caseList) // this is taking data from caseList 
           .enter()
           .append('div')
           .attr('class', 'case')
    
    // making the titles for each case and showing the date and name 
    let titles = cases
            .append('a')
            .attr('class', 'title')
            .text((d) => { return d.term + " - " + d.name; })
            .on("click", (d) => {
                showCase(d) 
            })
            .each(function (d, i) {
              if (i==0 || i==1 || i==2) {
                  console.log(this.getBoundingClientRect())
              }
              const newPosition = (i ==0) ? this.getBoundingClientRect().top : (this.getBoundingClientRect().top + 150)
              
               positionMap[newPosition] = d.ID //finding the posiiton by the ID of the case 
            //   console.log(d.ID)
            //   if (d.ID === 50657) {
                    buildWordCloud(d.ID, this)
               
           })
           .on("mouseover", function (d) {
                    console.log("case is", d3.select(this))
                    d3.select (this)
                    .select ("svg g")
                    // .attr("visibility", "visible")
                    .attr("opacity", 1)
                })
            
            .on("mouseout", function (d) {
                    console.log("case is", d3.select(this))
                    d3.select (this)
                    .select ("svg g")
                    // .attr("visibility", "hidden")
                    .attr("opacity", 0)
                })
           console.log('positon map:', positionMap)
          
        //breakpoints = Object.keys(positionMap).map(k => +k)
        
    // titles.append('span')
    //     .text('something')
    
})

.catch(error=>{
    console.log(error);
});


//_______________________________SINGLE CASE PAGE__________________________________________//

    //getting the information for each case from the API 
    const showCase = (oneCase) => {
        console.log(oneCase)
        d3.select('body')
        .attr('class', 'case');
        fetch(oneCase.caseURL)
            .then(res=>res.json())
            .then(response=>{
                console.log("caseName", response);
        
        let caseName = d3.select('#caseName')
        
        // caseName.selectAll("text").remove()
         // printing the ID of the case at the top of the page 
        caseName.append('text')
        .attr('class', 'ID')
        .text("CASE ID: " + response.ID  + " ｜ " + "DOCKET NUMBER: " + response.docket_number + " ｜ " + "DATE: " + response.term)
        // .attr('width', 200)
        // .attr('height', 200)
        
       // printing the name of the case at the top of the page
        caseName.append('text')
        .attr('class', 'name')
        .text(response.name)
        // .attr('width', 200)
        // .attr('height', 200)
       
        });
        
        // fetching the cases using their ID and then finding all the "a" tags and joining them to the map 
        fetch('cases/' + oneCase.ID + ".html")
            .then(res=>res.text())
            .then(response=>{
                console.log(response);
            d3.select('#facts')
            .html(response)
            .selectAll("a")
            .on("click", () => {
                let field = window.event.target.href.split("#")[1]; //finding at the #'s and then looking for the field directly after
                showMap(field);
            })
        });
    }

//_______________________MAP_______________________________//

let stateData;
d3.json('abortionAPI/stateData.json').then((json) => { stateData = json });

let fieldDescription;
d3.json('fielddescription.json').then((json) => { fieldDescription = json });

 
const showMap = (field) => {
    
    // console.log(stateData);
    d3.json('mapping/d3GeoJSON/states.geo.json').then((geojson) => {
            
// console.log(geojson);
d3.select("#mapContainer svg").remove();
d3.select("#map")
            .style("visibility", "visible")
let svg = d3.select("#mapContainer")
            .style("visibility", "visible")
            .append("svg")

// let boxSize = d3.select("#map").node().getBoundingClientRect();
// console.log(boxSize)

    
    console.log(field, fieldDescription);
    
    let currentFieldDescription = fieldDescription.filter(item => {
        if(field == item.field) {
            return true
        } else {
            return false;
        }
    });
    
    currentFieldDescription = currentFieldDescription[0];
    
    d3.select("#fieldDescription")
        .html(currentFieldDescription.description)
    
    
    scale =  (scaleFactor) => {
        return d3.geoTransform({
            point: function(x, y) {
                // this.stream.point(x * scaleFactor, -1 * y * scaleFactor);
                this.stream.point(x * scaleFactor + window.innerWidth*1.45, -1 * y * scaleFactor + window.innerHeight*1.2);

            }
        });
    }

 	let featureElement = svg.selectAll("path")
		.data(geojson.features)
		.enter()
        .append("path")
        .attr("d", d3.geoPath().projection(scale(10)))
        .attr("stroke", "grey")
        .attr("stroke-width", .3)
        .attr("fill", (d) => {
            if (stateData[d.properties.NAME]) {
                // console.log("state name", (stateData[d.properties.NAME][field]))
                if (stateData[d.properties.NAME][field]) {
                    
                    if(stateData[d.properties.NAME][field] == 99) {
                        return "pink"
                    } else {
                        return "red"
                    }
                } else {
                    return "#F8F0EA"
                }
            
            }
            
            
            // console.log(d.properties.NAME);
            // return "white"
        }) 
        .attr("fill-opacity", 0.6)
        .on('mouseover', function(d) {
            console.log(d);
            // d3.select(this).attr("fill", "red");
            d3.select("#hover")
                .text(d.properties.NAME)
                .style("font-family", "Courier New")
            d3.select('#hover').attr("fill-opacity", 1);
        })
        .on('mouseout', function() {
            // d3.select(this).attr("fill", "lightgray");
            d3.select('#hover').attr("fill-opacity", 0);
        })
        .on('mousemove', function(d) {
            d3.select("#hover")
                .attr('x', function() { return d3.mouse(this)[0] + 20; })
                .attr('y', function() { return d3.mouse(this)[1] + 10; });
        });
            
    svg.append("text")
        .attr('id', 'hover');

});
}

d3.select("#closeMap").on("click", () => {
    d3.select("#map").style("visibility", "hidden")
    d3.select("#mapContainer").style("visibility", "hidden")
})

// __________________UNDERLINE LINKS___________________// 


// <a href

// d3.selectAll('underline')
// .append(span)
// .


// append span and use d3.html function 
