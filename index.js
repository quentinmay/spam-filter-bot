const Discord = require('discord.js');
const fs = require('fs');
let  functions =  require('./functions.js');

const config = require("./config.json")
let client = new Discord.Client();

client.on('ready', async () => {
    setStatus();
    console.log("Started!");

})

function setStatus() {
    client.user.setActivity(`by ${config.currentDev}.`, {
        type: "STREAMING",
        url: `https://twitch.tv/`
    }).catch(console.error);
}



function checkSpam(string) {

    let rawdata = fs.readFileSync('table.json');
    let tableObject = JSON.parse(rawdata);
    const table = new Map(Object.entries(tableObject));

    let func = [functions.unorthodoxCharacters, functions.suspiciousWords, functions.containsLinks, functions.containsPhoneNumber];
    let i = 1;
    let stringAr = [];
    for (var run of func) {
        stringAr.push(`F${i}=${run(string)}`);
        i++;
    }
    let result = table.get(stringAr.join(","));

    return result.spamProb > result.hamProb;
}

//On Message Event Handler
client.on('message', (msg) => {
    if (msg.channel.name == "test-spam") {
        console.log(`${msg.channel.name} : ${msg.content}`)
        if (!checkSpam(msg.content)) {
            msg.react('✅');
        } else {
            msg.react('❌');
        }
    }

});



client.login(config.discordToken).catch(error => {
    console.log(error);
});


