# Call9000
Call9000 is one of my first programming projects, developed during high school amid the COVID-19 pandemic. With classes being held online, the school used Google Calendar to store the links for video conference rooms. To make access easier, I created a Discord bot that automatically sent these links to my class's Discord server.

This project follows an MVC-like architecture applied to the Discord API.

## Requirements
* Node.js
* Google Developer Account
* Discord Developer Account
## Installation
To install and run the Call9000 bot, follow these steps:
1. Clone the repository:
``` bash
git clone https://github.com/LuizF14/Call9000.git
```
2. Install the required dependencies:
``` bash
npm install
```
3. Download the `client_secret_...json` file from the Google API Developer Console. Then, create a credentials directory and move this file into it.
4. Create a `config.env` file and include the following information:
``` env
DISCORD_TOKEN={your discord token}
CREDENTIALS_PATH={the path for where you put your client_secret_...json}
CALENDAR_ID={the id for your calendar}
``` 
## Usage
To start the bot, run the command: 
``` bash
npm start
```
A message will appear in the terminal, prompting you to access a link to grant permission for the bot to access your Google Calendar data. After completing this step, the bot will begin running.
 
To add the bot to your server, create an invitation link in the Discord Developer Portal with the necessary permissions to send messages. Then, open this link in your browser, select the server you want to add the bot to, and authorize the action.

## Built With
* Node.js
* discord.js
* googleapis
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE).
