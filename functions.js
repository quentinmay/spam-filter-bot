


/*
Contains ANY unorthodox characters. Just anything you cant find on a normal english keyboard. Ignore emojis
*/
exports.unorthodoxCharacters = function unorthodoxCharacters(content) {
    for (let i = 0; i < content.length; i++) {
        if (content.charCodeAt(i) > 126) {
            //console.log(content.charCodeAt(i));
            return true
        }
    }
    return false;
}


/*
Contains lots of capital lets. Maybe 50% to start? Only valid for strings longer than 30 characters
*/
//probF2YesGivenSpam 0.009370816599732263
// probF2YesGivenHam 0.01782383419689119

//After removing character limit. 50% check
// probF2YesGivenSpam 0.0107095046854083
// probF2YesGivenHam 0.02715025906735751

//probF2YesGivenSpam 0.0013386880856760374
//probF2YesGivenHam 0.020518134715025907
exports.lotsOfCapitals = function lotsOfCapitals(content) {
    // if (content.length >= 30) {
    let capCount = 0;
    for (let i = 0; i < content.length; i++) {
        ch = content.charAt(i);
        if (isNaN(ch * 1) && ch == ch.toUpperCase()) {
            capCount = capCount + 1;
        }
    }
    if (capCount > (content.length * .75)) {
        //console.log(content);
        return true;
    }
    else {
        return false;
    }
    // } else{
    //     return false;
    // }
}

/*
Contains strings that indicate URLs
*/
exports.containsLinks = function containsLinks(content) {

    if (content.includes("http") || content.includes("www")) {
        //console.log(content);
        return true;
    }
    else {
        return false;
    }
}

/*
Contains a lot of suspicious words like "congratulations or YOU WON"
*/
exports.suspiciousWords = function suspiciousWords(content) {
    //maybe we take this opportunity to find the words with the highest frequency in spam messages
    //maybe top 8?
    let words = ['winner', 'congratulations', 'free', 'claim', 'guaranteed', 'join',]
    for (word of content.split(" ")) {
        if (words.includes(word.toLowerCase())) {
            return true;
        }
    }
    return false;
}

/*
Contains an exceptionally large amount of punctuation for a message
*/
exports.lotsOfPunctuation = function lotsOfPunctuation() {
    return "20";
}

/*
Contains an exceptionally large amount of non alphanumeric(A-Z, a-z, and 0-9) characters for a message (Only valid for longer strings)
*/
exports.lotsOfNonAlphanumeric = function lotsOfNonAlphanumeric() {
    return "20";
}


/*
Contains a phone number (can be easily done in regex)
*/

exports.containsPhoneNumber = function containsPhoneNumber(content) {

    const rx = new RegExp(/(\D{0,4}\d){6,15}/g);
    // let rx = new RegExp(/\D{0,4}\d{6,15}/g);
    if (rx.test(content)) {
        return true;
    }
    return false;
}
