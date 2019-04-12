
const spacing = 150;

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
    
    console.log(cases);
    return cases;
})
.then(caseList=>{
    
    window.addEventListener('scroll', e => {console.log(e.offsetY)})
    
    // this is creating an div for timeline 
    let timeline  = d3.select('#timeline')
        .append('div')
        .attr('width', 1000)
        .attr('height', caseList.length*150) // 150 becasue of font size
       
    
    // creating groups for each case and putting into timeline div 
    let cases = timeline.selectAll('div.case')
           .data(caseList) // this is taking data from caseList 
           .enter()
           .append('div')
           .attr('class', 'case');

    
    let titles = cases
            .append('a')
            .attr('class', 'title')
            .text((d) => { return d.term + " - " + d.name; })
            .on("click", (d) => {
                showCase(d) 
            })
    // titles.append('span')
    //     .text('something')
})


.catch(error=>{
    console.log(error);
});


//_________________________________________________________________________//

    
    const showCase = (oneCase) => {
        console.log(oneCase)
        d3.select('body')
        .attr('class', 'case');
        fetch(oneCase.caseURL)
            .then(res=>res.json())
            .then(response=>{
                console.log(response);
        });
        
        fetch('cases/' + oneCase.ID + ".html")
            .then(res=>res.text())
            .then(response=>{
                console.log(response);
            d3.select('#facts')
            .html(response)
            .selectAll("a")
            .on("click", (d) => {
                alert(d) 
            })
        });
    }
    

