let  functions =  require('./functions.js');
const csv = require('csv-parser');
const fs = require('fs');

let rawdata = fs.readFileSync('table.json');
let tableObject = JSON.parse(rawdata);

const table = new Map(Object.entries(tableObject));

// console.log(table)

//console.log(table.get("F1=true,F2=false,F3=true,F4=true"));

let test_strings = ["Empty test",
"Here's a string with unorthodox characters €ƒŒ",
"http://www.test123aaaa.com",
"congratulations You are a winner, claim THIS FREE prize",
"This string has some suspicious numbers 858 dot 126 k 4343",
"This string has sus words FREE and characters €ƒŒ",
"This string has sus numbers 858 2222 and characters €ƒŒ"
]

let testCase = [["Empty test", false], ["league?", false], ["wanna play some video games", false], ["were on discord lol", false],
["congratulations You are a winner, claim THIS FREE prize", true],
[" sus numbers 858 2222 and characters €ƒŒ", true], 
["suspicious numbers 858 dot 126 k 4343", true] ["Here's scummy string  €ƒŒ", true], ["BUY MY PRODUCT FREE:", true], ["DOWNLOAD MY LINK FREE http://scamlink.com", true]];


let func = [functions.unorthodoxCharacters, functions.suspiciousWords, functions.containsLinks, functions.containsPhoneNumber];

for (let string of test_strings) {
    let i = 1;
    let stringAr = [];
    for (var run of func) {
        stringAr.push(`F${i}=${run(string)}`);
        i++;
    }
    console.log(string);
    console.log(table.get(stringAr.join(",")));

}


function testWithData(){
    let dataSpam, spam, miss = 0, lines = 0;
    fs.createReadStream('spam.csv')
    .pipe(csv())
    .on('data', (row) => {
        lines++;
        string = row.content;
        let i = 1;
        let stringAr = [];
        for (var run of func) {
            stringAr.push(`F${i}=${run(string)}`);
            i++;
        }
        //console.log(string);
        //console.log(table.get(stringAr.join(",")));
        let tableResult = table.get(stringAr.join(","));
        let spamProb = tableResult["spamProb"];
        let hamProb = tableResult["hamProb"];
        dataSpam = row.spamvalue;
        spam = (spamProb > hamProb ? "spam" : "ham");
        
        if (spam != dataSpam){
            miss++;
        }

        
    })
    .on('end', () => {
        diff = lines - miss;
        acuracy = (diff / lines) * 100
        console.log(miss + " misses out of " + lines + " lines");
        console.log("Accuracy is " + acuracy);
    });
}
testWithData();



