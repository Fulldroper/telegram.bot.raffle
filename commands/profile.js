module.exports.info = {
  command: "profile",
  description: "gen user info",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(msg.chat.id, "Укажите айди пользователя:", {
    parse_mode: "HTML",
  });

  this.state[msg.chat.id] = {
    name: "profile",
    command: "profile",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.profile = async function (msg) {
  this.sendMessage(
    msg.chat.id,
    `<a href="tg://user?id=${msg.text}">Пользователь</a>`,
    { parse_mode: "HTML" }
  );
};
