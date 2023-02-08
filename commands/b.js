module.exports.info = {
  command: "b",
  description: "send all",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(msg.chat.id, "<b>Напишите публикацию</b>:", {
    parse_mode: "HTML",
  });

  this.state[msg.chat.id] = {
    name: "publishAll",
    command: "b",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.publishAll = async function (msg) {
  // send all
  const users = (await this.db.keys(`*`))
    .filter((e) =>
      new RegExp(`^${this.name}:[0-9]{6,50}\:ref\_counter$`).test(e)
    )
    .map((e) => Number(e.split(":")[1]));

  this.sendMessage(msg.chat.id, `🕘Рассылается 0 / ${users.length}...`);

  let er = 0;

  for (const user of users) {
    try {
      this.copyMessage(user, msg.chat.id, msg.message_id);
    } catch (error) {
      er++;
    }
    await (2500).sleep();
  }

  // clear state
  delete this.state[msg.chat.id];
  this.sendMessage(
    msg.chat.id,
    `✅Рассылка завершена\nУдалось отправить: ${
      users.length - er
    }\nНе удалось: ${er}\n\n❗️Тем, кому не удалось отправить, это пользователи, которые остановили бота!`
  );
};
