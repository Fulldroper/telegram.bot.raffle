module.exports.run = async function (call) {
  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "💰 Денежные средства", callback_data: "buy" }],
        [{ text: "🎁 Призы", callback_data: "no-react" }],
        [{ text: "🔙Назад", callback_data: "menu" }],
      ],
    }),
  };
  const {preBuy} = await this.db.get(`${this.name}:lang`)
  this.sendMessage(
    call.message.chat.id,
    preBuy,
    buttons
  );
};
