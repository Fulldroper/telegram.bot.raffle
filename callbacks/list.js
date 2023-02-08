module.exports.run = async function (call) {
  const tikets =
    (await this.db.get(`${this.name}:${call.from.id}:tikets`)) || [];
  const {list} = await this.db.get(`${this.name}:lang`)
  let text = this.lang(list,{
    tikets: tikets.length
  });
  tikets.forEach((tiket) => (text += `${tiket}\n`));
  this.sendMessage(call.from.id, text, {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [[{ text: "🔙Назад", callback_data: "menu" }]],
    }),
  });
};
