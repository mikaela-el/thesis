// var vfile = require('to-vfile')
var retext = require('retext')
var keywords = require('retext-keywords')
// var toString = require('nlcst-to-string')
var fs = require("fs");
var promisify = require('promisify')



const newFiles = fileName => {
  fs.readFile("../cases/" + fileName, function(err, buf) {
 
    retext()
    .use(keywords, {
      maximum:9 // might have to change this 
    })
    .process(buf, done)
    
    function done(err, file) {
      if (err) throw err
      
    // add additional filters words here 
    const filterWords = ["court", "abortions", "br", "href", "justice", "class", "abortion", "judge", "p", "statute", "text", "state", "states", "st", "parts", "pp", "title", "n", "law", "currentColor", "bubble", "XIX", "Weddington", "Potter", "Stewart", "opponent", "MR", "Powell", "two", "both", "Second", "First", "cases", "Douglas", "City", "anyone", "X", "gain"]
      let myKeywords = file.data.keywords.map(k => ({ count: k.matches.length, word: k.matches[0].node.children[0].value }))
      
      myKeywords = myKeywords.filter(k => {
      return !(filterWords.includes(k.word.toLowerCase()))
    })
      console.log('Keywords:', myKeywords)
   
    
      fs.writeFile("../keyWords/" + fileName.replace(".html", ".json"), JSON.stringify(myKeywords), (err) => {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
        });
      
      
      // .forEach(function(keyword) {
      //   // console.log(toString(keyword.matches[0].node))
      //   console.log(keyword.matches[0].node)
      //   })
      }
    

 })
}

fs.readdirSync("../cases").forEach(file => {
  newFiles(file)
})


