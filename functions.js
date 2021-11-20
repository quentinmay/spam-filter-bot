
exports.get50 = function get50() {
    return "50";
}

exports.get20 = function get20() {
     return "20";
 }

/*
Contains ANY unorthodox characters. Just anything you cant find on a normal english keyboard. Ignore emojis
*/
 exports.unorthodoxCharacters = function unorthodoxCharacters() {
    return "20";
}


/*
Contains lots of capital lets. Maybe 50% to start? Only valid for strings longer than 30 characters
*/
exports.lotsOfCapitals = function lotsOfCapitals() {
    return "20";
}

/*
Contains lots of capital lets. Maybe 50% to start? Only valid for strings longer than 30 characters
*/
exports.containsLinks = function containsLinks() {
    return "20";
}

/*
Contains a lot of suspicious words like "congratulations or YOU WON"
*/
exports.suspiciousWords = function suspiciousWords() {
    return "20";
}

/*
Contains an exceptionally large amount of punctuation for a message
*/
exports.lotsOfPunctuation = function lotsOfPunctuation() {
    return "20";
}

/*
Contains an exceptionally large amount of punctuation for a message (Only valid for longer strings)
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
