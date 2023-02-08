module.exports.run = async function (call) {
  const settings = (await this.db.get(`${this.name}:settings`)) || {};
  const { ref_count = 1, condition = "Услолвий нет" } = settings;
  const {menuError, menu, menuSubs} = await this.db.get(`${this.name}:lang`)

  let exist = await this.db.get(`${this.name}:${call.from.id}:ref_counter`);
  const exist_ch = (await this.db.get(`${this.name}:op`)) || [];
  const n_exist_ch = [];

  for (const chat of exist_ch) {
    if (
      !["administrator", "member", "creator"].includes(
        (await this.getChatMember(chat.id, call.from.id)).status
      )
    ) {
      n_exist_ch.push(chat);
    }
  }

  if (n_exist_ch.length > 0) {
    this.sendMessage(
      call.message.chat.id,
      menuError,
      { parse_mode: "HTML" }
    );
    return;
  }

  if (!exist) {
    const ticket = await this.newTicket({ type: "sys-gift", user: call.from });
    await this.db.inc(`${this.name}:${call.from.id}:ref_counter`);
    await this.db.push(`${this.name}:${call.from.id}:tikets`, ticket[0]);
    this.sendMessage(
      call.message.chat.id,
      this.lang(menuSubs,{
        ticket: ticket[0]
      })
    );
  }

  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "🎟 Мои купоны", callback_data: "list" },
          { text: "Получить купоны", callback_data: "ref" },
        ],
        [
          { text: "🏆Список призов", callback_data: "gifts" },
          { text: "Пожертвовать", callback_data: "pre_buy" },
        ],
      ],
    }),
  };
  this.sendMessage(
    call.message.chat.id,
    this.lang(menu, {
      condition
    }),
    buttons
  );
};
