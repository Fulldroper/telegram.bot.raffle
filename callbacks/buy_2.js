const axios = require("axios");
const { v4 } = require("uuid");

module.exports.run = async function (call) {
  let bs = call.message.reply_markup;
  const n = Number(bs.inline_keyboard[0][1].text);
  const settings = (await this.db.get(`${this.name}:settings`)) || {
    tiket_cost: 100,
  };
  const orderID = v4();
  const { buy2 } = await this.db.get(`${this.name}:lang`)
  const { data } = await axios({
    method: "post",
    url: process.env.BANK_API_GATEWAY,
    headers: {
      "Authorization": `${process.env.BANK_API_MARKET_ID}:${process.env.BANK_API_SECRET_KEY}`,
      "Idempotence-Key": orderID,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      "amount": {
        "value": n * settings.tiket_cost,
        "currency": "RUB"
      },
      "capture": true,
      "confirmation": {
        "type": "redirect",
        "return_url": `${process.env.BANK_WEB_HOST}${call.message.chat.id}/${orderID}?count=${n}`
      },
      "description": `Заказ ${orderID}`,
    },
  });

  if (data.errorCode) {
    console.error(`[BANK-ERROR]: `, data);
    return;
  }

  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "💳Оплатить", url: data.confirmation.confirmation_url, callback_data: "no-react" }],
        [{ text: "🔙Назад", callback_data: "menu" }],
      ],
    }),
  };

  this.sendMessage(
    call.message.chat.id,
    this.lang(buy2, {
      selected: n,
      cost: n * settings.tiket_cost
    }),
    buttons
  );
};
