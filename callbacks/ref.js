module.exports.run = async function (call) {
  const settings = (await this.db.get(`${this.name}:settings`)) || {
    ref_count: 1,
  };
  const {referal} = await this.db.get(`${this.name}:lang`)
  const refs =
    (await this.db.get(`${this.name}:${call.from.id}:refs`))?.length || 0;
  const refs_counter =
    (await this.db.get(`${this.name}:${call.from.id}:refs_counter`)) || 0;
  this.sendMessage(
    call.from.id,
    this.lang(referal, {
      count: settings.ref_count,
      name: this.name,
      id: call.from.id,
      refs,
      refs_counter
    }),
    {
      parse_mode: "HTML",
      reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: "🔙Назад", callback_data: "menu" }]],
      }),
    }
  );
};
