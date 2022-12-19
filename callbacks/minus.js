module.exports.run = async function (call) {
  const settings = await this.db.get(`${this.name}:settings`) || {tiket_cost: 100}
  let bs = call.message.reply_markup
  const n = Number(bs.inline_keyboard[0][1].text) - 1 || 1
  
  bs.inline_keyboard[0][1].text = n;
  bs.inline_keyboard[1][0].text = `💰Общая сумма: ${n * settings.tiket_cost}₽`;

  this.this.telegram.editMessageReplyMarkup(bs, {
    message_id: call.message.message_id,
    chat_id: call.message.chat.id,
  });
};
