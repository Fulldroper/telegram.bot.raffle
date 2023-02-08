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
