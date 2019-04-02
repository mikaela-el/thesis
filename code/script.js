
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
            term: singleCase.term
        };
    });
    
    console.log(cases);
    return cases;
})
.then(caseList=>{
    // this is creating an svg for timeline 
    let timeline  = d3.select('#timeline')
        .append('svg')
        .attr('width', 800)
        .attr('height', 1000);
    
    // creating groups for each case and putting into timeline div 
    let cases = timeline.selectAll('g.case')
           .data(caseList) // this is taking data from caseList 
           .enter()
           .append('g')
           .attr('class', 'case');

    
    let titles = cases
            .append('text')
            .attr('class', 'title')
            .text((d) => { return d.term + " &mdash; " + d.name; })
})


.catch(error=>{
    console.log(error);
});