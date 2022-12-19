module.exports.run = async function (call) {
  const settings = (await this.db.get(`${this.name}:settings`)) || {
    ref_count: 1,
  };
  const refs = (await this.db.get(`${this.name}:${call.from.id}:refs`))?.length || 0;
  const refs_counter = (await this.db.get(`${this.name}:${call.from.id}:refs_counter`)) || 0;
  this.telegram.sendMessage(
    call.from.id,
    `❗️Вы сможете заработать билеты не только покупая их, но и приглашая новых пользователей в бота. За каждого приведённого пользователя Вы сможете получить ${settings.ref_count} билет\n
  👇Приглашайте пользователей только по этой ссылке 
  🔗https://t.me/${this.name}?start=${call.from.id}\n
  <b>За всё время рефералов:</b> ${refs} чел.
  <b>За всё время заработано:</b> ${refs_counter} билетов`,
    {
      parse_mode: "HTML",
      reply_markup: JSON.stringify({
        inline_keyboard: [[{ text: "🔙Назад", callback_data: "menu" }]],
      }),
    }
  );
};
