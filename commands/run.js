module.exports.info = {
  command: "run",
  description: "create event",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(
    msg.chat.id,
    "🕘Укажите дату окончания розыгрыша в формате <b>дд.мм.гггг</b>:", { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "setDate",
    command: "run",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.setDate = async function (msg) {
  if (/^[0-9]{2}\.[0-9]{2}\.[0-9]{4}$/.test(msg.text)) {
    this.sendMessage(msg.chat.id, "⚡️Отправьте текстом условия розыгрыша:");
    this.state[msg.chat.id].name = "setDescription";
    const d = msg.text.split(".");
    this.state[msg.chat.id].storage.date = Date.parse(
      `${d[2]}-${d[1]}-${d[0]}T00:00:00`
    );
  } else this.sendMessage(msg.chat.id, "⚠️<b>Это неверный формат.</b> Попробуйте ещё раз:", { parse_mode: "HTML" });
};

module.exports.setDescription = async function (msg) {
  const e = {};
  e[new Date().getTime()] = this.state[msg.chat.id].storage.date;
  this.db.push(`${this.name}:events`, e, this.state[msg.chat.id].storage.date);

  //  send all
  const users = (await this.db.keys(`*`))
    .filter(e => new RegExp(`^${this.name}:[0-9]{6,50}\:ref\_counter$`).test(e))
    .map(e => Number(e.split(":")[1]))

  const text = `<b>Новая публкация</b>${msg.text}`

  for (const user of users) {
    this.copyMessage(user, msg.chat.id, msg.message_id);
    await (2500).sleep()
  }

  // clear state
  delete this.state[msg.chat.id];
  this.sendMessage(msg.chat.id, "✅Розыгрыш запущен!");
};