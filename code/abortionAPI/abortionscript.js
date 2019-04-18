var rp = require('request-promise');
var fs = require("fs");

var apiKey = 'OyYLMG34OXvK+S7u';

// See if Medicaid can cover abortion in Alaska
const dataByState = {}
const fetchdata = (tableName) => {
        rp({
        uri: `http://api.abortionpolicyapi.com/v1/${tableName}/states`,
        method: 'GET',
        headers: { 'token': apiKey },
        json: true
    }).then(function success(response) {
        // console.log(Object.keys(response))
        // taking an object and giving back all the keys (names of states)
        Object.keys(response).forEach(state => {
            const dataFromApi = response[state]
            const stateData = dataByState[state]
            // if we have data for that state, merge the objects but if not just initialize that data 
            if (stateData) {
                const newData = Object.assign(stateData, dataFromApi)
                 dataByState[state] = newData
                 console.log(newData)
    
            }else {
                dataByState[state] = dataFromApi
            }
        })
        var json = JSON.stringify(dataByState);
        
        fs.writeFile('stateData.json', json, 'utf8')
        
        // Make sure values were returned for Alaska
        // if (response && response.Alaska) {
        //     // Get all fields that contain 'medicaid_'
        //     var keys = Object.keys(response.Alaska).filter(key => {
        //         return key.indexOf('medicaid') > -1 && response.Alaska[key] === true;
        //     });
            
        //     // Looking at field reference, you can see that the scenarios in which medicaid
        //     // covers abortion are described after the first two descriptors.
        //     var message = "In Alaska, Medicaid covers abortion when it's: ";
        //     message += keys.map(key => { return key.split('_').slice(2).join(' ')})
        //         .join(', ');
        //     message += "\n(The API data are not currently optimized for grammar.)"
        //     console.log(message);
        // }
    }).catch(function error(response) {
        console.log(response.error);
    });
}
// mapping over each table and calling the fetch function 
const tables = ['gestational_limits', 'insurance_coverage', 'minors', 'waiting_periods']
    tables.forEach(table => {
        fetchdata(table)
    })




