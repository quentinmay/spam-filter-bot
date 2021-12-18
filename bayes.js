let functions = require('./functions.js');
const csv = require('csv-parser');
const fs = require('fs');

let hamCount = 0;
let spamCount = 0;
const featureCounts = new Map();

let func = [functions.unorthodoxCharacters, functions.suspiciousWords, functions.containsLinks, functions.containsPhoneNumber];

let topEight = [
    ['', 0], ['', 0], ['', 0], ['', 0], ['', 0], ['', 0], ['', 0], ['', 0]
];

function checkContent(row) {
    let content = row.content;
    let spamvalue = row.spamvalue;
    var i = 1;
    for (var run of func) {
        if (run(content)) {
            if (spamvalue === 'ham') {
                if (featureCounts.has(i)) {
                    featureCounts.set(i,
                        {
                            ham: featureCounts.get(i).ham + 1,
                            spam: featureCounts.get(i).spam,
                            probYesGivenSpam: null,
                            probNoGivenSpam: null,
                            probYesGivenHam: null,
                            probNoGivenHam: null
                        }
                    )
                } else {
                    featureCounts.set(i,
                        {
                            ham: 1,
                            spam: 0,
                            probYesGivenSpam: null,
                            probNoGivenSpam: null,
                            probYesGivenHam: null,
                            probNoGivenHam: null
                        }
                    )
                }
            }
            else if (spamvalue === 'spam') {
                if (featureCounts.has(i)) {
                    featureCounts.set(i,
                        {
                            ham: featureCounts.get(i).ham,
                            spam: featureCounts.get(i).spam + 1,
                            probYesGivenSpam: null,
                            probNoGivenSpam: null,
                            probYesGivenHam: null,
                            probNoGivenHam: null
                        }
                    )
                } else {
                    featureCounts.set(i,
                        {
                            ham: 0,
                            spam: 1,
                            probYesGivenSpam: null,
                            probNoGivenSpam: null,
                            probYesGivenHam: null,
                            probNoGivenHam: null
                        }
                    )
                }
            }
        }
        i++;
    }
}


function checkRow(row) {
    //console.log(row.spamvalue);
    if (row.spamvalue === 'ham') {
        hamCount = hamCount + 1;
    }
    else if (row.spamvalue === 'spam') {
        spamCount = spamCount + 1;
    }
    checkContent(row);
}

function topSpamWords(spamString) {
    let spamArray = spamString.split(" ");
    spamArray.sort();
    let currentWord = spamArray.ham;
    let wordCount = 0;
    for (word of spamArray) {
        //if word is same as previous word, add 1
        if (currentWord == word) {
            wordCount = wordCount + 1;
        }
        //if word is different from previous word, 
        //compare that word/count to array, and place it if necessary
        //reset running word/count
        else if (currentWord != word) {

            //determine where to insert
            for (let i = 0; i < topEight.length; i++) {
                if (wordCount > topEight[i][0]) {
                    console.log(word + " " + wordCount);
                    let newItem = [currentWord, wordCount];
                    //then splice
                    topEight.splice(i, 0, newItem);
                    //then pop
                    topEight.pop();

                    break;
                }
            }
            //then currentWord = word
            currentWord = word;
            //then wordCount = 1
            wordCount = 1;
        }
    }
    console.log(topEight);
}

function bayes() {
    let allSpamString = "";
    fs.createReadStream('spam.csv')
        .pipe(csv())
        .on('data', (row) => {
            checkRow(row);
            if (row.spamvalue === 'spam') {
                allSpamString = allSpamString + " " + row.content;
            }

        })
        .on('end', () => {
            console.log('CSV File successfully processed');




            //P(spam)
            let probSpam = spamCount / (hamCount + spamCount);

            //P(ham)
            let probHam = hamCount / (hamCount + spamCount);

            const featuresMap = new Map();


            const structDatas = [
                // { "Function #": "1", function: "", "P(Yes | Spam)": "asdf", "P(No | Spam)": "asdf", "P(Yes | Ham)": "asdf", "P(No | Ham)": "asdf" },
            ];
            for (var feature of featureCounts) {
                // //P(F1 = yes | spam)
                feature[1].probYesGivenSpam = feature[1].spam / spamCount;
                // //P(F1 = no | spam)
                feature[1].probNoGivenSpam = 1 - feature[1].probYesGivenSpam;
                // //P(F1 = yes | ham)
                feature[1].probYesGivenHam = feature[1].ham / hamCount;
                // //P(F1 = no | ham)
                feature[1].probNoGivenHam = 1 - feature[1].probYesGivenHam;//functions[feature[0] - 1]
                // functions.containsLinks.name
                structDatas.push({ "Function #": feature[0], "Function Name": func[(feature[0] - 1)].name, Ham: feature[1].ham, Spam: feature[1].spam, "P(Yes | Spam)": feature[1].probYesGivenSpam.toPrecision(4) * 100 + "%", "P(No | Spam)": feature[1].probNoGivenSpam.toPrecision(4) * 100 + "%", "P(Yes | Ham)": feature[1].probYesGivenHam.toPrecision(4) * 100 + "%", "P(No | Ham)": feature[1].probNoGivenHam.toPrecision(4) * 100 + "%" })

            }
            console.table(structDatas.sort(function (a, b) {
                return a['Function #'] - b['Function #'];
            }));

            ////Final Calculations**************************************************************************
            //let probSpam;
            //true, true, true,
            //true, true, false,
            //true, false, true
            //true, false, false
            //false, false, false
            //false

            //https://stackoverflow.com/questions/39430439/generate-possible-truth-values-of-variables-in-array
            let variables = [];

            for (var values = 0; values < featureCounts.size; values++) {
                variables.push(values + 1);
            }

            var numberOfSets = 1 << variables.length;
            var truthTable = [];
            for (var i = 0; i < numberOfSets; i++) {
                truthTable.push({});
                for (var j = 0; j < variables.length; j++) {
                    if (((1 << j) & i) > 0) {
                        truthTable[i][variables[j]] = true;
                    } else {
                        truthTable[i][variables[j]] = false;
                    }
                }
            }

            const table = new Map();

            for (var truthRow of truthTable) {
                let probSpamGivenConditions = probSpam;
                let probHamGivenConditions = probHam;

                for (var i = 0; i < featureCounts.size; i++) {
                    probSpamGivenConditions = probSpamGivenConditions * (truthRow[i] ? featureCounts.get(i + 1).probYesGivenSpam : featureCounts.get(i + 1).probNoGivenSpam);
                    probHamGivenConditions = probHamGivenConditions * (truthRow[i] ? featureCounts.get(i + 1).probYesGivenHam : featureCounts.get(i + 1).probNoGivenHam);
                }




                let normalizedProbSpam = probSpamGivenConditions / (probSpamGivenConditions + probHamGivenConditions)
                let normalizedProbHam = probHamGivenConditions / (probSpamGivenConditions + probHamGivenConditions) // should be inverse of eachother





                let stringAr = [];
                for (let index = 0; index < featureCounts.size; index++) {
                    stringAr.push(`F${index + 1}=${truthRow[index + 1]}`);
                }

                table.set(stringAr.join(","), { spamProb: normalizedProbSpam * 100, hamProb: normalizedProbHam * 100 })



            }

            const tableStruct = [];
            console.log("--------------------TRUTH TABLE--------------------");
            for (var row of table) {
                var col = {};
                var index = 1;
                for (var functVal of row[0].split(",")) {
                    var bool = functVal.split("=")[1] == "true";
                    col[`Function #${index}`] = bool;
                    index++;
                }
                col["P(Spam | Conditions)"] = row[1].spamProb.toPrecision(4) + "%";
                col["P(Ham | Conditions)"] = row[1].hamProb.toPrecision(4) + "%";
                col["Decision: (Is spam?)"] = row[1].spamProb > row[1].hamProb;
                tableStruct.push(col);
            }
            console.table(tableStruct);
            let data = JSON.stringify(Object.fromEntries(table));
            fs.writeFileSync('table.json', data);


        });

}
bayes();