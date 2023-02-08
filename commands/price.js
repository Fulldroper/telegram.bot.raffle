module.exports.info = {
  command: "price",
  description: "сумму за 1 купон",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(msg.chat.id, "Укажите сумму за 1 купон (число):", {
    parse_mode: "HTML",
  });

  this.state[msg.chat.id] = {
    name: "setPrice",
    command: "price",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.setPrice = async function (msg) {
  if (Number(msg.text)) {
    const settings = (await this.db.get(`${this.name}:settings`)) || {};
    settings.tiket_cost = Number(msg.text);
    await this.db.set(`${this.name}:settings`, settings);
    this.sendMessage(msg.chat.id, `Cумма за 1 купон = ${Number(msg.text)}`, {
      parse_mode: "HTML",
    });
    delete this.state[msg.chat.id];
  } else
    this.sendMessage(
      msg.chat.id,
      "⚠️<b>Это неверный формат.</b> Попробуйте ещё раз:",
      { parse_mode: "HTML" }
    );
};
