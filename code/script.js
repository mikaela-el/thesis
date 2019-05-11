// load data set  
let yearData = [];
d3.json("yeardata.json")
    .then(data => {
        yearData = data
    })

const yearJusticeCount = {
    0: 0,
    3552: 1,
    6200: 2,
    8834: 1,
    9443: 3
}

const yearFemalePop = {
    0: 104076122, //1970 
    50: 105443973, // 1971
    600: 107643874, //1973
    800: 109771934, //1975
    1300: 110880498, //1976
    2400: 113350788, //1978
    3000: 114675212, //1979
    3400: 115822943, //1980
    3600: 118084774, //1982
    4400: 121228156, //1985
    4650: 123510043, //1987
    4850: 124677136, //1988
    5200: 125885861, //1989
    5700: 127314146, //1990
    5850: 128993474, //1991
    6150: 132392823, //1993
    6750: 135465255, //1995
    6950: 136974478, //1996
    7650: 141669463, //1999
    8050: 145840225, //2002
    8350: 149693614, //2005
    8900: 151110004, //2006
    9500: 159892295, //2013
    9750: 162221534, //2015
    10000: 164502605, //2017
}

const justiceImageYear = {
    // Examples:
    0: "https://api.oyez.org/sites/default/files/images/courts/burger2.jpg", //1970
    50: "https://api.oyez.org/sites/default/files/images/courts/burger2.jpg", //1971
    600: "https://api.oyez.org/sites/default/files/images/courts/burger4.jpg", //1973
    800: "https://api.oyez.org/sites/default/files/images/courts/burger6.jpg", //1975
    3552: "https://api.oyez.org/sites/default/files/images/courts/burger8.jpg", //1982
    4650: "https://api.oyez.org/sites/default/files/images/courts/rehnquist1.jpg", //1987
    4850: "https://api.oyez.org/sites/default/files/images/courts/rehnquist3.jpg", //1988
    5700: "https://api.oyez.org/sites/default/files/images/courts/rehnquist5.jpg", //1990
    5850: "https://api.oyez.org/sites/default/files/images/courts/rehnquist7.jpg", // 1991
    6200: "https://api.oyez.org/sites/default/files/images/courts/rehnquist9.jpg", //1993
    6750: "https://api.oyez.org/sites/default/files/images/courts/rehnquist10.jpg", //1995
    8350: "https://api.oyez.org/sites/default/files/images/courts/roberts1.jpg", //2005
    8834: "https://api.oyez.org/sites/default/files/images/courts/roberts2.jpg", //2006
    9500: "https://api.oyez.org/sites/default/files/images/courts/roberts6.jpg", //2010
    10000: "https://api.oyez.org/sites/default/files/filefield_paths/GroupPhoto.jpg" // 2017
}

var getClosest = function (arr, num) {
    let closest
    for (var i = 0; i < arr.length; i++) {
        if (num >= arr[i]) {
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

let breakpointsJusticeImages = Object.keys(justiceImageYear);

const justiceLineScale = d3.scaleLinear()
    .domain([0, 9])
    .range([0, window.innerWidth])
console.log(justiceLineScale(9))

d3.select("#enterSite").on("click", () => {
    d3.select("#landingPage").style("visibility", "hidden")
})

// this function should look through the current position and find the ID of the case whose Yposition is closest but less than the current scroll position
const findCurrentCase = (scrollPosition) => {}

fetch("https://api.oyez.org/cases?filter=issue:423&page=0&per_page=0")
    .then(res => res.json())
    .then(response => {
        console.log(response);

        // goes over every case like a for loop but makes a new array
        // assigns new array to the variable "cases"
        var cases = response.map(singleCase => {

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
            return array.sort(function (a, b) {
                var fElem = a[key];
                var sElem = b[key];
                return ((fElem < sElem) ? -1 : ((fElem > sElem) ? 1 : 0));
            });
        }

        sortByKey(cases, "term");

        return cases;
    })

    // this is for the justice line and scrolling 
    .then(caseList => {
        let numJustices = 0;
        let womenPop = 0;
        // console.log(JSON.stringify(caseList))
        window.addEventListener('scroll', function () {
            // this is finding the place of the divs and then matching with the index and id 
            console.log(pageYOffset)
            //const insertion = d3.bisectLeft(breakpoints, this.pageYOffset)

            const closestBreakpoint = getClosest(breakpoints, this.pageYOffset)

            console.log('closestBreakpoint', closestBreakpoint)

            numJustices = yearJusticeCount[closestBreakpoint]
            //const currentCase = caseList.find(d => d.ID===caseInView)
            // console.log(insertion)

            //console.log('We found a case', caseInView)
            console.log("breakpoints:", breakpoints)
            //const currentYear = yearData.find(d => d.year===+currentCase.term)
            // console.log(currentYear)
            closestBreakpointPop = getClosest(breakpointsPopulation, this.pageYOffset)
            womenPop = yearFemalePop[closestBreakpointPop]
            console.log('numJustices', numJustices, justiceLineScale(numJustices))
            //numJustices = currentYear.femaleJustice
            // console.log(womenPop)
            d3.select("#justiceLine")
                // .style("left", `${justiceLineScale(0)}px`)
                .transition()
                .duration(1000)
                .style("left", `${justiceLineScale(numJustices)}px`)
            d3.select("#justiceLine p")
                .text((!numJustices ? 0 : numJustices) + " Women on Supreme Court")
            d3.select("#femalePopulation")
                // .enter() // DATA JOINS 
                // .append('text')
                .html("Women in the United States: " + (!womenPop ? 0 : d3.format(",d")(womenPop)))
            // console.log(caseList)

        })

        // d3.select(justiceLine)
        //     .append("text")
        //     .text( numJustices + "Women on Supreme Court")
        //     .attr("font-size", "'Libre Baskerville', serif")


        // this is creating an div for timeline 
        let timeline = d3.select('#timeline')
            .append('div')
            .attr("id", "caseList")
            .attr('position', 'relative')
            .attr('width', 1200)
            .attr('height', caseList.length * 150) // 150 becasue of font size


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
            .style("padding-bottom", (d) => {
                if (d.name == 'Gonzales v. Carhart' || d.name == 'Webster v. Reproductive Health Services' || d.name == 'Planned Parenthood of Central Missouri v. Danforth' || d.name == 'Carey v. Population Services International' || d.name == 'Planned Parenthood Association of Kansas City, Missouri, Inc. v. Ashcroft' || d.name == 'Akron v. Akron Center For Reproductive Health' || d.name == 'Thornburgh v. American College of Obstetricians and Gynecologists' || d.name == 'Ohio v. Akron Center for Reproductive Health' || d.name == 'Planned Parenthood of Southeastern Pennsylvania v. Casey' || d.name == 'National Organization for Women, Inc. v. Scheidler' || d.name == "Madsen v. Women's Health Center, Inc." || d.name == "Schenck v. Pro-Choice Network of Western New York" || d.name == "Scheidler v. National Organization for Women, Inc." || d.name == "Ayotte v. Planned Parenthood of Northern New England" || d.name == "Gonzales v. Planned Parenthood Federation of America, Inc." || d.name == "Whole Woman’s Health v. Hellerstedt" || d.name == "National Institute of Family and Life Advocates v. Becerra") {
                    return "92px"
                } else {
                    return "0px"
                }
            })


        // (number == 1 || number2 == 1)


        //   .attr('height', () => {
        //             if (item.Female.Expect[m].year == '2016') {
        //                 return 40
        //             } else {
        //                 return 10
        //             }
        //         })
        //   .attr('height', 100)

        // making the titles for each case and showing the date and name 
        let titles = cases
            .append('a')
            .attr('class', 'title')
            .text((d) => {
                return d.term + " - " + d.name;
            })
            .on("click", (d) => {
                showCase(d)
            })
            .each(function (d, i) {


                const newPosition = (i == 0) ? this.getBoundingClientRect().top : (this.getBoundingClientRect().top + 150)

                positionMap[newPosition] = d.ID //finding the posiiton by the ID of the case 
                //   console.log(d.ID)
                //   if (d.ID === 50657) {
                buildWordCloud(d.ID, this)

            })

            .on("mouseover", function (d) {
                // console.log("case is", d3.select(this))
                d3.select(this)
                    .select("svg g")
                    // .attr("visibility", "visible")
                    .attr("opacity", 1)
            })

            .on("mouseout", function (d) {
                console.log("case is", d3.select(this))
                d3.select(this)
                    .select("svg g")
                    // .attr("visibility", "hidden")
                    .attr("opacity", 0)
            })

        console.log('positon map:', positionMap)

        //breakpoints = Object.keys(positionMap).map(k => +k)

        // titles.append('span')
        //     .text('something')

    })

    .catch(error => {
        console.log(error);
    });


//_______________________________SINGLE CASE PAGE__________________________________________//

//getting the information for each case from the API 
const showCase = (oneCase) => {
    console.log(oneCase)
    d3.select('body')
        .attr('class', 'case');
    fetch(oneCase.caseURL)
        .then(res => res.json())
        .then(response => {
            console.log("caseName", response);

            let caseName = d3.select('#caseName')

            // caseName.selectAll("text").remove()
            // printing the ID of the case at the top of the page 
            caseName.append('text')
                .attr('class', 'ID')
                .text("CASE ID: " + response.ID + " ｜ " + "DOCKET NUMBER: " + response.docket_number + " ｜ " + "DATE: " + response.term)
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
        .then(res => res.text())
        .then(response => {
            console.log(response);
            d3.select('#facts')
                .html(response)
                .selectAll("a")
                .on("mouseover", () => {
                    let field = window.event.target.href.split("#")[1]; //finding at the #'s and then looking for the field directly after
                    showMap(field);
                })
                .on("mouseout", () => {
                    d3.select("#mapContainer").style("opacity", 0)
                    d3.select("#fieldDescription").style("opacity", 0)
                })

        });
}

//_______________________MAP_______________________________//

let stateData;
d3.json('abortionAPI/stateData.json').then((json) => {
    stateData = json
});

let fieldDescription;
d3.json('fielddescription.json').then((json) => {
    fieldDescription = json
});


const showMap = (field) => {

    // console.log(stateData);
    d3.json('mapping/d3GeoJSON/states.geo.json').then((geojson) => {

        // console.log(geojson);
        d3.select("#mapContainer svg").remove();
        let svg = d3.select("#mapContainer")
            .style("opacity", ".95")
            .append("svg")

        // let boxSize = d3.select("#map").node().getBoundingClientRect();
        // console.log(boxSize)


        console.log(field, fieldDescription);

        let currentFieldDescription = fieldDescription.filter(item => {
            if (field == item.field) {
                return true
            } else {
                return false;
            }
        });

        currentFieldDescription = currentFieldDescription[0];

        d3.select("#fieldDescription")
            .html(currentFieldDescription.description)
            .style("opacity", 1)


        scale = (scaleFactor) => {
            return d3.geoTransform({
                point: function (x, y) {
                    // this.stream.point(x * scaleFactor, -1 * y * scaleFactor);
                    this.stream.point(x * scaleFactor + window.innerWidth * 1.45, -1 * y * scaleFactor + window.innerHeight * 1.2);

                }
            });
        }

        let albersProj = d3.geoAlbers()
            .scale(1000)
            //.rotate([71.057, 0])
            .center([0, 42.313])
            .translate([window.innerWidth / 2, window.innerHeight / 2 - 100]);

        let path = d3.geoPath().projection(albersProj);

        let featureElement = svg.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", .3)
            .attr("fill", (d) => {
                if (stateData[d.properties.NAME]) {
                    // console.log("state name", (stateData[d.properties.NAME][field]))
                    if (stateData[d.properties.NAME][field]) {

                        if (stateData[d.properties.NAME][field] == 22) {
                            return "red" // coded as 99 
                        }
                        if (stateData[d.properties.NAME][field] == 27) {
                            return "#FA4B49" // coded as 99 
                        }
                        if (stateData[d.properties.NAME][field] == 99) {
                            return "#FD9898" // coded as 99 
                        }
                        if (stateData[d.properties.NAME][field] == 28) {
                            return "##FDCCCB" // coded as 99 
                        } else {
                            return "#DC0000" // not banned 
                        }
                    } else {
                        return "#F8F0EA" // banned
                    }
                }


                // console.log(d.properties.NAME);
                // return "white"
            })
            .attr("fill-opacity", 0.8);


        let statesAbbr = svg.selectAll(".state")
            .data(geojson.features)
            .enter()
            .append('text')
            .attr('class', 'state')
            .attr("fill", (d) => {
                if (stateData[d.properties.NAME]) {
                    // console.log("state name", (stateData[d.properties.NAME][field]))
                    if (stateData[d.properties.NAME][field]) {

                        if (stateData[d.properties.NAME][field] == 99) {
                            return "#F8F0EA" // coded as 99 
                        } else {
                            return "#F8F0EA" // not banned 
                        }
                    } else {
                        return "red" // banned 
                    }

                }


                // console.log(d.properties.NAME);
                // return "white"
            })
            .text((d) => {
                // console.log(d.properties)
                return d.properties.ABBR
            })
            .attr("x", (d) => {
                return path.centroid(d)[0];
            })
            .attr("y", (d) => {
                return path.centroid(d)[1];
            });



        /*
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
        */

        svg.append("text")
            .attr('id', 'hover');

    });
}

// d3.select("#closeMap").on("click", () => {
//     d3.select("#map").style("visibility", "hidden")
//     d3.select("#mapContainer").style("visibility", "hidden")
// })


// __________________UNDERLINE LINKS___________________// 


// <a href

// d3.selectAll('underline')
// .append(span)
// .


// append span and use d3.html function 


//IMAGES 
// .append("span")
//             .append("img")
//             .attr("height", 600)
//             .attr("src", d=>{
//                 // console.log("this is datum", d)
//                 const imageSrc = justiceImageYear[d.term]
//                     return imageSrc
//                 // return "https://api.oyez.org/sites/default/files/images/courts/burger4.jpg"
//                 })


d3.select('#images')
    .style('opacity', 0)
d3.select("#justiceLine")
    .on("mouseover", function () {
        d3.select('#justiceImage')
            .attr("src", d => {
                console.log("this is datum", d)
                console.log('PAGE Y in gradient mouseover', pageYOffset)
                const closestBreakpoint = getClosest(breakpointsJusticeImages, pageYOffset)

                console.log('closestBreakpoint for justiceImage', closestBreakpoint)

                const imageSrc = justiceImageYear[closestBreakpoint]

                return imageSrc

            })
        d3.select('#images')
            .transition()
            .style("opacity", 1)
    })
    .on('mouseleave', function () {

        d3.select('#images')
            .transition()
            .style('opacity', 0)
    })