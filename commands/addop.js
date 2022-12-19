module.exports.info = {
  command: "addop",
  description: "add op",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.telegram.sendMessage(
    msg.chat.id,
    "<b>Отправте сообщение от канала</b>:", { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "opSet",
    command: "addop",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.opSet = async function (msg) {
  try {
    const exist_ch = await this.db.get(`${this.name}:op`) || [] 
    for (const ch of exist_ch) {
      if (msg.forward_from_chat.id === ch.id) {
        this.telegram.sendMessage(msg.chat.id, `Канал уже зарегестрирован`);
        return
      } 
    }
    this.telegram.sendMessage(msg.chat.id, `Канал ${msg.forward_from_chat.title} добавлен, Введите линк на группу`);
    this.state[msg.chat.id] = {
      name: "opUrlSet",
      command: "addop",
      author: msg.from.id,
      storage: msg.forward_from_chat,
    };
  } catch (error) {
    this.telegram.sendMessage(msg.chat.id, `Канал не найден попробуйте снова`);
  }
};

module.exports.opUrlSet = async function (msg) {
  try {
    this.state[msg.chat.id].storage.url = msg.text
    this.db.push(`${this.name}:op`, this.state[msg.chat.id].storage)

    // clear state
    this.telegram.sendMessage(msg.chat.id, `Канал ${this.state[msg.chat.id].storage.title} с линком ${msg.text} зарегестрировано`);
    delete this.state[msg.chat.id];
  } catch (error) {
    console.log(error);
    this.telegram.sendMessage(msg.chat.id, `Линк не найден попробуйте снова`);
  }
};