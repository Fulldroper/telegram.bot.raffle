module.exports.info = {
  command: "publish",
  description: "send all",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.telegram.sendMessage(
    msg.chat.id,
    "<b>Напишите публикацию</b>:", { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "publishAll",
    command: "publish",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.publishAll = async function (msg) {
  // send all
  const users = (await this.db.keys(`*`))
    .filter(e => new RegExp(`^${this.name}:[0-9]{6,50}\:ref\_counter$`).test(e))
    .map(e => Number(e.split(":")[1]))

  for (const user of users) {
    this.this.telegram.copyMessage(user, msg.chat.id, msg.message_id);    
    await (2500).sleep()
  }

  // clear state
  delete this.state[msg.chat.id];
  this.telegram.sendMessage(msg.chat.id, "✅Опудликовано!");
};