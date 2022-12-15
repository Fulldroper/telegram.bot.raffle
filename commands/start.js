module.exports.info = {
  "command": "start",
  "description": "start command",
  "types": ["private"]
}

module.exports.run = async function(msg) {
  const settings = await this.db.get(`${this.name}:settings`) || { ref_count: 1, condition: "Услолвий нет" }
  const events = await this.db.get(`${this.name}:events`)
  const exist_ch = await this.db.get(`${this.name}:op`) || []
  const n_exist_ch = []
  for (const chat of exist_ch) {
    if (!['administrator', 'member', 'creator'].includes((await this.getChatMember(chat.id, msg.from.id)).status)) {
      n_exist_ch.push(chat)
    }
  }
 
  const inline_keyboard = []
  n_exist_ch.forEach(ch => {
    inline_keyboard.push([{text: ch.title, url: ch.url, callback_data: "no-react"}])
  });
  inline_keyboard.push([{text: inline_keyboard.length > 0 ? "✅Проверить подписку" : "✅Продовжити", callback_data: "menu"}])
  const exist = await this.db.get(`${this.name}:${msg.from.id}`)
  if (!events) {
    this.sendMessage(msg.chat.id,`<b>🤷‍♂️Розыгрышей на данный момент нет.</b> Попробуйте вернуться в бота и написать /start немного <b>позже</b> или через <b>пару дней</b>`, { parse_mode: "HTML" })
    return
  }
  if (!exist && msg?.meta?.length > 0 && msg.meta[0] != msg.from.id) {  
    const usrs = await this.db.get(`${this.name}:${msg.meta[0]}:refs`) || []
    if (usrs.includes(msg.from.id)) return
    await this.db.push(`${this.name}:${msg.meta[0]}:refs`, msg.from.id)
    await this.db.inc(`${this.name}:${msg.meta[0]}:refs_counter`, settings.ref_count)
    this.sendMessage(msg.chat.id, `🎉Вы заработали ${settings.ref_count} билет!\n🔗Пользователь ${msg.from.username} запустил бота по Вашей реферальной ссылке👍`)
  }

  this.sendMessage(msg.chat.id,
    `🙌 Добро пожаловать!\nЭто бот для розыгрышей. Тут ты можешь поучаствовать в розыгрыше ценных призов,  для начала с тебя нужно подписка на <b>каналы</b>. Ограничения на количество билетов нет. Итоги розыгрыша будем подводить <b>${new Date(Object.values(events[0])[0]).toLocaleDateString("ru")}</b>. Для получения первого билета и дальнейших условий розыгрыша, подпишись на каналы ниже.\n<b>Желаем тебе удачи!</b>👋`, 
  {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({ inline_keyboard })
  })  
}