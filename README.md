# 🚫 Anti-Spam Bot 

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

## Features
![image](https://user-images.githubusercontent.com/73214439/144963321-2f6a543b-76f6-4b05-80fb-039be5db1515.png)

## 🧮Truth Table
![image](https://user-images.githubusercontent.com/73214439/144963350-597616da-9100-411e-8ce1-2332cff1b6ca.png)

## ⚠Test Cases
![image](https://user-images.githubusercontent.com/73214439/144963385-90732e5f-eef8-46f0-b10b-26053b7f4034.png)


## Demo
![Clipped-1638845244440-2021-12-06 18-45-57](https://user-images.githubusercontent.com/73214439/144963221-ae44ff33-ddfa-44ad-9a55-6fb2a04fd994.gif)


## 📚References:
* [Dataset](https://www.kaggle.com/uciml/sms-spam-collection-dataset)
* [Project base reference](https://towardsdatascience.com/na%C3%AFve-bayes-spam-filter-from-scratch-12970ad3dae7)
* [More on bayes/spam concepts](https://www.baeldung.com/cs/spam-filter-training-sets)
