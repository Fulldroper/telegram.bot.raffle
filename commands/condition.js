module.exports.info = {
  command: "condition",
  description: "Условия",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(
    msg.chat.id,
    "Укажите условия:", { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "setCondition",
    command: "condition",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.setCondition = async function (msg) {
  const settings = await this.db.set(`${this.name}:settings`) || {}
  settings.condition = msg.text
  await this.db.set(`${this.name}:settings`,settings)
  this.sendMessage(msg.chat.id, `Условия успешно изменены`, { parse_mode: "HTML" });
};