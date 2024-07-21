---
title: "Telegram Raffle Bot"
description: "A Telegram bot for managing raffles with a referral system and ticket purchases linked to a banking API"
publishDate: "08 Feb 2023"
updatedDate: "13 Feb 2023"
tags: ["Node.js", "Redis", "Telegram Bot", "Raffles"]
---
The purpose of this project is to create a Telegram bot for managing raffles, incorporating a referral system and ticket purchases linked to a banking API.

### Project Benefits
This project provides a streamlined way to manage raffles on Telegram, allowing users to participate through a referral system and purchase tickets securely via a banking API.

### How the Project Works
The project uses Node.js and Redis to create a Telegram bot that facilitates raffle management, tracks referrals, and processes ticket purchases using a banking API.

### Repository and Installation
[GitHub Repository](https://github.com/Fulldroper/telegram.bot.raffle)

To install and use the project:

1. Clone the repository:
    ```bash
    git clone https://github.com/Fulldroper/telegram.bot.raffle
    cd telegram.bot.raffle
    ```

2. Install dependencies and start the bot:
    ```bash
    npm install
    npm start
    ```

### Project Workflow
1. **Setup Project:** Initialize the project structure and dependencies.
    ```bash
    npm init
    npm install
    ```

2. **Create Telegram Bot:** Set up the bot to connect to Telegram and handle raffle commands.
    ```javascript
    const { Telegraf } = require('telegraf');
    const bot = new Telegraf('your-telegram-bot-token');

    bot.start((ctx) => ctx.reply('Welcome to the Raffle Bot!'));
    bot.launch();
    ```

3. **Implement Raffle and Referral Features:** Add functionalities for managing raffles, tracking referrals, and processing ticket purchases.
    ```javascript
    bot.command('buyticket', (ctx) => {
        const ticketId = generateTicketId();
        const userId = ctx.from.id;
        // Process payment through banking API
        processPayment(userId, ticketId).then(() => {
            ctx.reply(`Ticket purchased successfully! Your ticket ID is ${ticketId}`);
        }).catch((err) => {
            ctx.reply('Payment failed. Please try again.');
        });
    });

    bot.command('referral', (ctx) => {
        const referralCode = generateReferralCode();
        ctx.reply(`Share this referral code with friends: ${referralCode}`);
    });

    function generateTicketId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function generateReferralCode() {
        return Math.random().toString(36).substr(2, 6);
    }

    async function processPayment(userId, ticketId) {
        // Implement payment processing with the banking API
    }
    ```

### Skills Gained
- Developing Telegram bots with Node.js
- Integrating Redis for data management
- Implementing payment processing with a banking API
- Managing raffles and referral systems


# Dependencies

![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif)

[Git](https://git-scm.com/) && [node.js](https://nodejs.org/uk/) && [Redis](https://redis.io/docs/getting-started/)

# env
```
REDIS_URL=redis://<user>:<password>@<host>:<port>
TOKEN=<telegram_bot_token>
PORT=<payment_callback_port>
HOST=0.0.0.0
BANK_WEB_HOST=<payment_callback_domain>
BANK_API_MARKET_ID=<market_id>
BANK_API_SECRET_KEY=<secret_key>
BANK_API_GATEWAY=<bank_url_gateway>
```

# Start

```
> git clone https://github.com/Fulldroper/raffle.git
> cd raffle-master
> npm i
> npm start
```

# Admin list

Add or remove id of user to `admins` array

> inside -> `package.json`
```
{
  ...
  "config": {
    ...
    "admins": [
      390818781,
      1021188889
    ]
  },
  ...
}

```

> `Author` [@full_droper](https://fulldroper.cf/)
