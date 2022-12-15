module.exports.run = async function (call) {
  const settings = await this.db.get(`${this.name}:settings`) || {tiket_cost: 100}
  let bs = call.message.reply_markup
  const n = Number(bs.inline_keyboard[0][1].text) 
  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "💳Оплатить", callback_data: "pushare" }],
        [{ text: "🔙Назад", callback_data: "menu" }],
      ],
    }),
  }

  this.sendMessage(call.message.chat.id, `<b>Выбрано билетов:</b> ${n}
  \n<b>Общая сумма оплаты:</b> ${n * settings.tiket_cost}₽
  \n💰👇Оплатите сумму перейдя по кнопке ниже и бот автоматически зачислит на Ваш счёт в текущем розыгрыше билеты:`, buttons);
};
