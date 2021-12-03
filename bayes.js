let  functions =  require('./functions.js');
console.log(functions.get50());
console.log(functions.get20());
const csv = require('csv-parser');
const fs = require('fs');

let hamCount = 0;
let spamCount = 0;
let unorthodoxCount = [0, 0];
let capitalsCount = [0, 0];
let linksCount = [0, 0];
let topEight = [
    ['',0],['',0],['',0],['',0],['',0],['',0],['',0],['',0]
];

function checkContent(row){
    let content = row.content;
    let spamvalue = row.spamvalue;
    if(functions.unorthodoxCharacters(content)){
        if (spamvalue === 'ham'){
            unorthodoxCount[0] = unorthodoxCount[0] + 1;
        }
        else if (spamvalue === 'spam'){
            unorthodoxCount[1] = unorthodoxCount[1] + 1;
        } 
    }
    if(functions.lotsOfCapitals(content)){
        if (spamvalue === 'ham'){
            capitalsCount[0] = capitalsCount[0] + 1;
        }
        if (spamvalue === 'spam'){
            capitalsCount[1] = capitalsCount[1] + 1;
        }
    }
    if(functions.containsLinks(content)){
        if (spamvalue === 'ham'){
            linksCount[0] = linksCount[0] + 1;
        }
        else if (spamvalue === 'spam'){
            linksCount[1] = linksCount[1] + 1;
        }
    }
}

function checkRow(row){
    //console.log(row.spamvalue);
    if(row.spamvalue === 'ham'){
        hamCount = hamCount + 1;
    }
    else if(row.spamvalue === 'spam'){
        spamCount = spamCount + 1;
    }
    checkContent(row);
}

function topSpamWords(spamString){
    let spamArray = spamString.split(" ");
    spamArray.sort();
    //currentWord
    /*for(word of spamArray){
        //if word is same as previous word, add 1
        //if word is different from previous word, 
        //compare that word/count to array, and place it if necessary
        //reset running word/count
    }*/
}

function bayes() {
    let allSpamString = "";
    fs.createReadStream('spam.csv')
    .pipe(csv())
    .on('data', (row) => {
        checkRow(row);
        //console.log(row);
        if (row.spamvalue === 'spam'){
            allSpamString = allSpamString + " " + row.content;
        }
        
    })
    .on('end', () => {
        topSpamWords(allSpamString);
        console.log('CSV File successfully processed');
        console.log("Ham: " + hamCount);
        console.log("Spam: " + spamCount);
        console.log("Unorthodox Characters in ham: " + unorthodoxCount[0]);
        console.log("Unorthodox Characters in spam: " + unorthodoxCount[1]);
        console.log("Too many capital Characters in ham: " + capitalsCount[0]);
        console.log("Too many capital Characters in spam: " + capitalsCount[1]);
        console.log("Link in ham: " + linksCount[0]);
        console.log("Link in spam: " + linksCount[1]);
        
    });
    
}
bayes();
//module.exports = bayes;