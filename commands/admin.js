module.exports.info = {
  command: "admin",
  description: "admin",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "Рассылка", callback_data: "bridge:b" },
          { text: "Каналы", callback_data: "bridge:channels" },
        ],
        [
          { text: "Стоимость купона", callback_data: "bridge:price" },
          { text: "Реф. награда", callback_data: "bridge:ref" },
        ],
        [
          { text: "Викторина", callback_data: "bridge:run" },
          { text: "Призы", callback_data: "bridge:gifts" },
        ],
        [{ text: "Таблица с пользователями", callback_data: "bridge:tickets" }],
        [{ text: "Ссылка на пользователя", callback_data: "bridge:profile" }],
      ],
    }),
  };
  this.sendMessage(msg.chat.id, `Выберите действие:`, buttons);
};
