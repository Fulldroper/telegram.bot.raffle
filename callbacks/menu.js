module.exports.run = async function (call) {
  const settings = (await this.db.get(`${this.name}:settings`)) || {
    ref_count: 1,
    condition: "Услолвий нет",
  };

  let exist = await this.db.get(`${this.name}:${call.from.id}:ref_counter`)
  const exist_ch = await this.db.get(`${this.name}:op`) || []
  const n_exist_ch = []

  for (const chat of exist_ch) {
    if (!['administrator','member', 'creator'].includes(
        (await this.this.telegram.getChatMember(chat.id, call.from.id)).status)
      ) {
      n_exist_ch.push(chat)
    }
  }

  if (n_exist_ch.length > 0) {
    this.telegram.sendMessage(call.message.chat.id,`❌<b>Ой, что то не так.</b> Пожалуйста проверьте,  подписались ли вы на все каналы`,{parse_mode: "HTML"})
    return
  }

  if (!exist) {
    const ticket = await this.newTicket({type: "sys-gift", user: call.from})
    await this.db.inc(`${this.name}:${call.from.id}:ref_counter`)
    await this.db.push(`${this.name}:${call.from.id}:tikets`, ticket[0])
    this.telegram.sendMessage(
      call.message.chat.id,
      `🎉Благодарим Вас за подписку на все каналы. Вы получаете ваш первый билет! Номер вашего билета ${ticket[0]}`
    );
  }

  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "🎟 Мои билеты", callback_data: "list" },
          { text: "🎫 Купить билеты", callback_data: "buy" },
        ],
        [{ text: "🔗Получить билеты", callback_data: "ref" }],
      ],
    }),
  };
  this.telegram.sendMessage(
    call.message.chat.id,
    `<b>⚡️Условия розыгрыша:</b>\n${settings.condition}\nЧтобы посмотреть билеты или набрать больше билетов, воспользуйтесь кнопками ниже👇`,
    buttons
  );
};