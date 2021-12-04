let functions = require('./functions.js');
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

let testCases = [
    ["Empty test", false],
    ["test", false],
    ["league?", false],
    ["wanna play some video games", false],
    ["were on discord lol", false],
    ["nah", false],
    ["yes", false],
    ["whats up guys", false],
    ["im not too sure", false],
    ["wanna have a conversation?", false],
    ["ive got class pretty soon. wanna call later at 7:00pm", false],
    ["6pm works", false],
    ["8:32", false],
    ["i wont make it", false],
    ["i just won my last game :)", false],
    ["LOL thats sick bro", false],
    ["go check out my youtube video https://www.youtube.com/watch?v=dQw4w9WgXcQ", false],
    ["!@#!@!#@", false],
    ["", false],

    ["congratulations You are a winner, claim THIS FREE prize", true],
    [" sus numbers 858 2222 and characters €ƒŒ", true],
    ["FREE XBOX HERE: https://aksmdkjfm.com/ 12312312312", true],
    ["FANX8GRY6PWZ  free stuff", true],
    ["BUY MY PRODUCT FREE:", true],
    ["DOWNLOAD MY LINK FREE http://scamlink.com", true],
    ["IMPORTANT!! DOWNLOAD THAT FILE AND YOUR FILES WILL BE PROTECTED!!!!!!!!", true],
    ["dm me right now for free discord nitro", true],
    ["And code 64USB3 for a free 64GB thumb drive with it", true],
    ["http://€ƒAaaAAAFJWAOWBNKEBŒA&", true],


];


let func = [functions.unorthodoxCharacters, functions.suspiciousWords, functions.containsLinks, functions.containsPhoneNumber];

// for (let string of test_strings) {
//     let i = 1;
//     let stringAr = [];
//     for (var run of func) {
//         stringAr.push(`F${i}=${run(string)}`);
//         i++;
//     }
//     console.log(string);
//     console.log(table.get(stringAr.join(",")));

// }

testTestCases();
function testTestCases() {
    const structDatas = [];

    let dataSpam, spam, miss = 0, lines = 0;
    for (var testCase of testCases) {
        lines++;

        string = testCase[0];

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
        dataSpam = testCase[1] ? "spam" : "ham";
        spam = (spamProb > hamProb ? "spam" : "ham");

        if (spam != dataSpam) {
            miss++;
        }
        structDatas.push({ "Message": string.substring(0, 50) + ((string.length > 50) ? "..." : ""), "P(Spam | Conditions)": tableResult["spamProb"].toPrecision(4), "P(Ham | Conditions)": tableResult["hamProb"].toPrecision(4), "Success?": spam == dataSpam })

    }
    console.log("---------------PREMADE TEST CASES---------------")
    console.table(structDatas);
    diff = lines - miss;
    acuracy = (diff / lines) * 100
    console.log(miss + " misses out of " + lines + " lines");
    console.log("Accuracy is " + acuracy.toPrecision(4) + "%");
}

function testWithData() {
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

            if (spam != dataSpam) {
                miss++;
            }


        })
        .on('end', () => {
            diff = lines - miss;
            acuracy = (diff / lines) * 100
            console.log("---------------TEST ORIGINAL SPAM.CSV DATA SET---------------")
            console.log(miss + " misses out of " + lines + " lines");
            console.log("Accuracy is " + acuracy.toPrecision(4) + "%");
        });
}
testWithData();



