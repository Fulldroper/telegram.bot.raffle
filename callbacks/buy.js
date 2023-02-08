module.exports.run = async function (call) {
  const settings = (await this.db.get(`${this.name}:settings`)) || {
    tiket_cost: 100,
  };
  const {buy} = await this.db.get(`${this.name}:lang`)
  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "➖", callback_data: "minus" },
          { text: "1", callback_data: "no-react" },
          { text: "➕", callback_data: "plus" },
        ],
        [
          {
            text: `💰Общая сумма: ${settings.tiket_cost}₽`,
            callback_data: "no-react",
          },
        ],
        [{ text: "✅Перейти к оплате", callback_data: "buy_2" }],
        [{ text: "🔙Назад", callback_data: "menu" }],
      ],
    }),
  };
  this.sendMessage(
    call.message.chat.id,
    this.lang(buy, {
      tiket_cost: settings.tiket_cost
    }),
    buttons
  );
};
