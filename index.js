const Discord = require('discord.js');
const fs = require('fs');

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


//On Message Event Handler
client.on('message', (msg) => {
    console.log(`${msg.channel.name} : ${msg.content}`)
});



client.login(config.discordToken).catch(error => {
    console.log(error);
});


