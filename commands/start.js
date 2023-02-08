module.exports.info = {
  command: "start",
  description: "start command",
  types: ["private"],
};

module.exports.run = async function (msg) {
  const settings = (await this.db.get(`${this.name}:settings`)) || {
    ref_count: 1,
    condition: "Услолвий нет",
  };
  const {start, startNoTips, referalGift} = await this.db.get(`${this.name}:lang`)
  const events = await this.db.get(`${this.name}:events`);
  const exist_ch = (await this.db.get(`${this.name}:op`)) || [];
  const n_exist_ch = [];
  for (const chat of exist_ch) {
    if (
      !["administrator", "member", "creator"].includes(
        (await this.getChatMember(chat.id, msg.from.id)).status
      )
    ) {
      n_exist_ch.push(chat);
    }
  }

  const inline_keyboard = [];

  n_exist_ch.forEach((ch) => {
    inline_keyboard.push([
      { text: ch.title, url: ch.url, callback_data: "no-react" },
    ]);
  });

  inline_keyboard.push([
    {
      text:
        inline_keyboard.length > 0 ? "✅Проверить подписку" : "✅Продолжить",
      callback_data: "menu",
    },
  ]);

  const exist = await this.db.get(`${this.name}:${msg.from.id}:refs_counter`);

  if (!events) {
    this.sendMessage(
      msg.chat.id,
      startNoTips,
      { parse_mode: "HTML" }
    );
    return;
  }
  if (!exist && msg?.meta?.length > 0 && msg.meta[0] != msg.from.id) {
    const usrs = (await this.db.get(`${this.name}:${msg.meta[0]}:refs`)) || [];
    if (usrs.includes(msg.from.id)) return;
    await this.db.push(`${this.name}:${msg.meta[0]}:refs`, msg.from.id);
    await this.db.inc(
      `${this.name}:${msg.meta[0]}:refs_counter`,
      settings.ref_count
    );
    const user = await this.getChat(msg.meta[0]);
    const ref_tickets = await this.newTicket({
      type: "ref",
      user,
      count: settings.ref_count,
    });
    for (const ref_ticket of ref_tickets) {
      await this.db.push(`${this.name}:${msg.meta[0]}:tikets`, ref_ticket);
    }
    this.sendMessage(
      msg.meta[0],
      this.lang(referalGift,{
        count:settings.ref_count,
        username:msg.from.username
      })
    );
  }
  
  this.sendMessage(
    msg.chat.id,
    this.lang(start,{
      date: new Date(Object.values(events[0])[0]).toLocaleDateString("ru")
    }),
    {
      parse_mode: "HTML",
      reply_markup: JSON.stringify({ inline_keyboard }),
    }
  );
};
