# Anti-Spam Bot 

Anti-Spam Bot built for discord servers using [discord.js](https://discord.js.org) and Naive Baiyes Theorem.

## ⚠Requirements
1. [Discord Bot Token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
2. [Node.js 14.0.0 or newer](https://nodejs.org/)

## ⚡Installation

Easily deployable using git clone:

```bash
git clone https://github.com/quentinmay/spam-filter-bot
cd spam-filter-bot
npm install
```
Now you must configure the bot before running using indexConfig example file:
```bash
mv indexConfig.json.example indexConfig.json
```
## Simple Configuration (Required)
Discord token is required.

```json
{
    "discordToken": "",
    "currentDev": "Quentin"
}
```

### Discord Bot Setup
Ensure that you have privelaged gateway intents enabled on your [developer portal](https://discord.com/developers/applications)
![image](https://user-images.githubusercontent.com/73214439/115173596-7e487a00-a07c-11eb-9877-f2cf1441ee75.png)

## 🚀Initial Startup
Just startup the script now that everything has been built and you've filled your config file.
```bash
node index.js
```

## References:
[Project base reference](https://towardsdatascience.com/na%C3%AFve-bayes-spam-filter-from-scratch-12970ad3dae7)
[Dataset](https://www.kaggle.com/uciml/sms-spam-collection-dataset)
[More on bayes/spam concepts](https://www.baeldung.com/cs/spam-filter-training-sets)