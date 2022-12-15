module.exports.info = {
  command: "referal",
  description: "кол-во билетов за 1 рефералку",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(
    msg.chat.id,
    "Укажите кол-во билетов за 1 рефералку (число):", { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "setReferal",
    command: "referal",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.setReferal = async function (msg) {
  if (Number(msg.text)) {
    const settings = await this.db.get(`${this.name}:settings`) || {}
    settings.ref_count = Number(msg.text)
    await this.db.set(`${this.name}:settings`,settings)
    this.sendMessage(msg.chat.id, `1 рефералка = ${Number(msg.text)} билет`, { parse_mode: "HTML" });
    delete this.state[msg.chat.id];
  } else this.sendMessage(msg.chat.id, "⚠️<b>Это неверный формат.</b> Попробуйте ещё раз:", { parse_mode: "HTML" });
};