// load data set  
let yearData = [];
d3.json("yeardata.json")
    .then(data => {
    yearData = data
    })

console.log(yearData)

const spacing = 150;

const positionMap = {};

let breakpoints = [];

    const justiceLineScale = d3.scaleLinear()
            .domain([0,9])
            .range([0, window.innerWidth])
            console.log(justiceLineScale(9))
    


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
    
    return cases;
})

// this is for the justice line and scrolling 
.then(caseList=>{
    // console.log(JSON.stringify(caseList))
    window.addEventListener('scroll', function() { 
        // this is finding the place of the divs and then matching with the index and id 
        const insertion = d3.bisectLeft(breakpoints, this.pageYOffset)
        const caseInView = positionMap[breakpoints[insertion]]
        const currentCase = caseList.find(d => d.ID===caseInView)
        // console.log(currentCase)
        const currentYear = yearData.find(d => d.year===+currentCase.term)
        // console.log(currentYear)
        const numJustices = currentYear.femaleJustice
        console.log(numJustices)
            d3.select("#justiceLine")
            // .style("left", `${justiceLineScale(0)}px`)
            .transition()
            .duration(1000)
            .style("left", `${justiceLineScale(numJustices)}px`)
        console.log(caseList)
    })
    
   
    // this is creating an div for timeline 
    let timeline  = d3.select('#timeline')
        .append('div')
        .attr("id", "caseList")
        .attr('position', 'relative')
        .attr('width', 1000)
        .attr('height', caseList.length*150) // 150 becasue of font size
        
    
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
              
               positionMap[this.getBoundingClientRect().top] = d.ID //finding the posiiton by the ID of the case 
           })
           console.log(positionMap)
          
        breakpoints = Object.keys(positionMap).map(k => +k)
        
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


const showMap = (field) => {
    
    console.log(stateData);
    
    d3.json('mapping/d3GeoJSON/states.geo.json').then((geojson) => {
            
console.log(geojson);

let svg = d3.select("#map").style("visibility", "visible").append("svg")

// let boxSize = d3.select("#map").node().getBoundingClientRect();
// console.log(boxSize)
    
    scale =  (scaleFactor) => {
        return d3.geoTransform({
            point: function(x, y) {
                this.stream.point(x * scaleFactor + window.innerWidth*1.3, -1 * y * scaleFactor + window.innerHeight*.9);
            }
        });
    }

 	let featureElement = svg.selectAll("path")
		.data(geojson.features)
		.enter()
        .append("path")
        .attr("d", d3.geoPath().projection(scale(10)))
        .attr("stroke", "black")
        .attr("stroke-width", .3)
        .attr("fill", (d) => {
            if (stateData[d.properties.NAME]) {
                console.log("state name", (stateData[d.properties.NAME][field]))
                if (stateData[d.properties.NAME][field]) {
                    return "red"
                } else {
                    return "white"
                }
            
            }
            
            
            // console.log(d.properties.NAME);
            // return "white"
        }) 
        .attr("fill-opacity", 0.5)
        .on('mouseover', function(d) {
            console.log(d);
            // d3.select(this).attr("fill", "red");
            d3.select("#hover")
                .text(d.properties.NAME)
                //.text(d.properties.subregion.toUpperCase() + ' (Region:' + d.properties.subregion.toUpperCase() + ' (Population: ' + (d.properties.pop_est/1000000).toFixed(1) + 'Mio.)');
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
})

// __________________UNDERLINE LINKS___________________// 


// <a href

// d3.selectAll('underline')
// .append(span)
// .


// append span and use d3.html function 
