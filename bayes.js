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
// console.log(functions.containsPhoneNumber(" this is my nuimber 123-123-1234"));

function checkContent(row) {
    let content = row.content;
    let spamvalue = row.spamvalue;
    var i = 1;
    for (var run of func) {
        // console.log(i);
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
                    // console.log("doesnt have " + i);
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
                // unorthodoxCount.ham = unorthodoxCount.ham + 1;
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
                // unorthodoxCount.spam = unorthodoxCount.spam + 1;
            }
        }
        i++;
    }
}

/*
CSV File successfully processed
Ham: 4825
Spam: 747
Unorthodox Characters in ham: 223
Unorthodox Characters in spam: 258
Too many capital Characters in ham: 99
Too many capital Characters in spam: 1
Link in ham: 3
Link in spam: 105
*/
//     if(functions.unorthodoxCharacters(content)){
//         if (spamvalue === 'ham'){
//             unorthodoxCount.ham = unorthodoxCount.ham + 1;
//         }
//         else if (spamvalue === 'spam'){
//             unorthodoxCount.spam = unorthodoxCount.spam + 1;
//         } 
//     }
//     if(functions.lotsOfCapitals(content)){
//         if (spamvalue === 'ham'){
//             capitalsCount.ham = capitalsCount.ham + 1;
//         }
//         if (spamvalue === 'spam'){
//             capitalsCount.spam = capitalsCount.spam + 1;
//         }
//     }
//     if(functions.containsLinks(content)){
//         if (spamvalue === 'ham'){
//             linksCount.ham = linksCount.ham + 1;
//         }
//         else if (spamvalue === 'spam'){
//             linksCount.spam = linksCount.spam + 1;
//         }
// }

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
            //console.log(row);
            if (row.spamvalue === 'spam') {
                allSpamString = allSpamString + " " + row.content;
            }

        })
        .on('end', () => {
            // topSpamWords(allSpamString);
            console.log('CSV File successfully processed');
            // console.log("Ham: " + hamCount);
            // console.log("Spam: " + spamCount);
            // console.log("Unorthodox Characters in ham: " + unorthodoxCount.ham);
            // console.log("Unorthodox Characters in spam: " + unorthodoxCount.spam);
            // console.log("Too many capital Characters in ham: " + capitalsCount.ham);
            // console.log("Too many capital Characters in spam: " + capitalsCount.spam);
            // console.log("Link in ham: " + linksCount.ham);
            // console.log("Link in spam: " + linksCount.spam);
            // console.log(featureCounts)



            //P(spam)
            let probSpam = spamCount / (hamCount + spamCount);

            //P(ham)
            let probHam = hamCount / (hamCount + spamCount);

            const featuresMap = new Map();

            // for (var feature of featureCounts.entries()) {
            //     var key = feature[0];
            //     var value = feature[1];
            // }
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
            // console.log(featureCounts);
            // ////F1**************************************************************************
            // //P(F1 = yes | spam)
            // let probF1YesGivenSpam = unorthodoxCount.spam / spamCount;
            // featuresMap.set("probF1YesGivenSpam", probF1YesGivenSpam);
            // console.log("probF1YesGivenSpam", probF1YesGivenSpam);

            // //P(F1 = no | spam)
            // let probF1NoGivenSpam = 1 - probF1YesGivenSpam;
            // featuresMap.set("probF1NoGivenSpam", probF1NoGivenSpam);

            // //P(F1 = yes | ham)
            // let probF1YesGivenHam = unorthodoxCount.ham / hamCount;
            // featuresMap.set("probF1YesGivenHam", probF1YesGivenHam);
            // console.log("probF1YesGivenHam", probF1YesGivenHam);

            // //P(F1 = no | ham)
            // let probF1NoGivenHam = 1 - probF1YesGivenHam;
            // featuresMap.set("probF1NoGivenHam", probF1NoGivenHam);


            // ////F2**************************************************************************
            // //P(F2 = yes | spam)
            // let probF2YesGivenSpam = capitalsCount.spam / spamCount;
            // featuresMap.set("probF2YesGivenSpam", probF2YesGivenSpam);
            // console.log("probF2YesGivenSpam", probF2YesGivenSpam);

            // //P(F2 = no | spam)
            // let probF2NoGivenSpam = 1 - probF2YesGivenSpam;
            // featuresMap.set("probF2NoGivenSpam", probF2NoGivenSpam);

            // //P(F2 = yes | ham)
            // let probF2YesGivenHam = capitalsCount.ham / hamCount;
            // featuresMap.set("probF2YesGivenHam", probF2YesGivenHam);
            // console.log("probF2YesGivenHam", probF2YesGivenHam);

            // //P(F2 = no | ham)
            // let probF2NoGivenHam = 1 - probF2YesGivenHam;
            // featuresMap.set("probF2NoGivenHam", probF2NoGivenHam);

            // //P(F2 = yes | spam)
            // // let probF2 = capitalsCount.spam / spamCount;

            // ////F3**************************************************************************
            // //P(F3 = yes | spam)
            // let probF3YesGivenSpam = linksCount.spam / spamCount;
            // featuresMap.set("probF3YesGivenSpam", probF3YesGivenSpam);
            // console.log("probF3YesGivenSpam", probF3YesGivenSpam);

            // //P(F3 = no | spam)
            // let probF3NoGivenSpam = 1 - probF3YesGivenSpam;
            // featuresMap.set("probF3NoGivenSpam", probF3NoGivenSpam);

            // //P(F3 = yes | ham)
            // let probF3YesGivenHam = linksCount.ham / hamCount;
            // featuresMap.set("probF3YesGivenHam", probF3YesGivenHam);
            // console.log("probF3YesGivenHam", probF3YesGivenHam);

            // //P(F3 = no | ham)
            // let probF3NoGivenHam = 1 - probF3YesGivenHam;
            // featuresMap.set("probF3NoGivenHam", probF3NoGivenHam);



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

            // console.log(truthTable);
            const table = new Map();

            for (var truthRow of truthTable) {
                // var mutlipliedProbsSpam = 1;
                let probSpamGivenConditions = probSpam;
                let probHamGivenConditions = probHam;

                for (var i = 0; i < featureCounts.size; i++) {
                    probSpamGivenConditions = probSpamGivenConditions * (truthRow[i] ? featureCounts.get(i + 1).probYesGivenSpam : featureCounts.get(i + 1).probNoGivenSpam);
                    probHamGivenConditions = probHamGivenConditions * (truthRow[i] ? featureCounts.get(i + 1).probYesGivenHam : featureCounts.get(i + 1).probNoGivenHam);
                    // probSpamGivenConditions = probSpamGivenConditions * featuresMap.get(`probF${i+1}${(truthRow[i]? "Yes" : "No")}GivenSpam`);
                    // probHamGivenConditions = probHamGivenConditions * featuresMap.get(`probF${i+1}${(truthRow[i]? "Yes" : "No")}GivenHam`);
                }
                // console.log(truthRow);
                // console.log(`probSpamGivenConditions: ${probSpamGivenConditions}`)
                // console.log(`probHamGivenConditions: ${probHamGivenConditions}`)



                let normalizedProbSpam = probSpamGivenConditions / (probSpamGivenConditions + probHamGivenConditions)
                let normalizedProbHam = probHamGivenConditions / (probSpamGivenConditions + probHamGivenConditions) // should be inverse of eachother
                // console.log(`SPAM: ${(normalizedProbSpam * 100).toPrecision(3)}%`);
                // console.log(`HAM: ${(normalizedProbHam * 100).toPrecision(3)}%`);


                // structDatas.push({ "Function #": feature[0], "Function Name": func[(feature[0] - 1)].name, Ham: feature[1].ham, Spam: feature[1].spam, "P(Yes | Spam)": feature[1].probYesGivenSpam.toPrecision(4) * 100 + "%", "P(No | Spam)": feature[1].probNoGivenSpam.toPrecision(4) * 100 + "%", "P(Yes | Ham)": feature[1].probYesGivenHam.toPrecision(4) * 100 + "%", "P(No | Ham)": feature[1].probNoGivenHam.toPrecision(4) * 100 + "%" })


                // let truthTable = {};
                let stringAr = [];
                for (let index = 0; index < featureCounts.size; index++) {
                    stringAr.push(`F${index + 1}=${truthRow[index + 1]}`);
                    // truthTable[`${index + 1}`] = truthRow[index + 1];
                }

                // console.table(truthTable);
                table.set(stringAr.join(","), { spamProb: normalizedProbSpam * 100, hamProb: normalizedProbHam * 100 })
                // table.set("F1=Yes,F2=Yes,F3=No", 
                // {
                //     spamProb=31%,
                //     hamProb=69%
                // })

                // {
                //     "Feature1:[]",
                //     "Feature"
                // }
                // console.log("-------------------------------")
                //     const table = new Map();
                //     table.set("F1=Yes,F2=Yes,F3=No", 
                //     {
                //         spamProb=31%,
                //         hamProb=69%
                //     })

                //     "this is my number 123- 123-1234"
                // F1 = yes, F2 = yes, F3 = no

                // "F1=true,F2=false,F3=false"
                // table.get(`F1=${F1},F2=${F2},F3=${F3}`);


            }
            // const tableStruct = {

            // };
            // var tableAr = [];
            // for (var row of table) {
            //     var colAr = [];
            //     var index = 1;
            //     for (var functVal of row[0].split(",")) {
            //         var bool = functVal.split("=")[1] == "true";
            //         if (colAr.length < index) {
            //             colAr.push([]);
            //         }
            //         colAr[index - 1].push(bool);
            //         index++;
            //     }
            //     colAr.push([]);
            //     colAr.push([]);
            //     colAr[index - 1].push(row[1].spamProb);
            //     colAr[index].push(row[1].hamProb);
            //     tableAr.push(colAr);
            // }
            // console.log(tableAr);
            // console.table(tableAr, { stuff: table });
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
            // console.log(table);
            let data = JSON.stringify(Object.fromEntries(table));
            fs.writeFileSync('table.json', data);


        });

}
bayes();
//module.exports = bayes;