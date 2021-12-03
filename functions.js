
exports.get50 = function get50() {
    return "50";
}

exports.get20 = function get20() {
     return "20";
 }

/*
Contains ANY unorthodox characters. Just anything you cant find on a normal english keyboard. Ignore emojis
*/
 exports.unorthodoxCharacters = function unorthodoxCharacters(content) {
    for(let i = 0; i < content.length; i++){
        if (content.charCodeAt(i) > 126){
            //console.log(content.charCodeAt(i));
            return true
        }
    }
    return false;
}


/*
Contains lots of capital lets. Maybe 50% to start? Only valid for strings longer than 30 characters
*/
exports.lotsOfCapitals = function lotsOfCapitals(content) {
    if (content.length >= 30) {
        let capCount = 0;
        for (let i = 0; i < content.length; i++) {
            ch = content.charAt(i);
            if (isNaN(ch * 1) && ch == ch.toUpperCase()) {
                capCount = capCount + 1;
            }
        }
        if (capCount > (content.length / 2)) {
            //console.log(content);
            return true;
        }
        else {
            return false;
        }
    }
    else{
        return false;
    }
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
exports.suspiciousWords = function suspiciousWords() {
    //maybe we take this opportunity to find the words with the highest frequency in spam messages
    //maybe top 8?
    return "20";
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
exports.containsPhoneNumber = function containsPhoneNumber() {
    return "20";
}
