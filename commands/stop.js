module.exports.info = {
  command: "run",
  description: "stop event",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.db.clear(`${this.name}:events`);
  this.sendMessage(msg.chat.id, "✅Розыгрыш остановлен!");
};