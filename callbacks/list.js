module.exports.run = async function (call) {
  const tikets =
    (await this.db.get(`${this.name}:${call.from.id}:tikets`)) || [];
  let text = `🎟 <b>Мои билеты</b>
  <b>У Вас:</b> ${tikets.length} билетов\n👇Ниже список ваших билетов:\n`;
  tikets.forEach((tiket) => (text += `${tiket}\n\n`));
  this.sendMessage(call.from.id, text, {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: "🔙Назад", callback_data: "menu" }]],
    }),
  });
};
