module.exports.info = {
  command: "channels",
  description: "channels",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  this.sendMessage(msg.chat.id, "Выберите нужную команду из списка ниже ⬇️", {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          {
            text: "Добавить канал",
            callback_data: "bridge:channels:add",
          },
        ],
        [
          {
            text: "Удалить канал",
            callback_data: "bridge:channels:del",
          },
        ],
        [
          {
            text: "Список каналов",
            callback_data: "bridge:channels:list",
          },
        ],
      ],
    }),
  });
};

module.exports.add = async function (msg) {
  this.sendMessage(msg.chat.id, "<b>Отправте сообщение от канала</b>:", {
    parse_mode: "HTML",
  });
  this.state[msg.chat.id] = {
    name: "opSet",
    command: "channels",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.opSet = async function (msg) {
  try {
    const exist_ch = (await this.db.get(`${this.name}:op`)) || [];
    for (const ch of exist_ch) {
      if (msg.forward_from_chat.id === ch.id) {
        this.sendMessage(msg.chat.id, `Канал уже зарегестрирован`);
        return;
      }
    }
    this.sendMessage(
      msg.chat.id,
      `Канал ${msg.forward_from_chat.title} добавлен, Введите линк на группу`
    );
    this.state[msg.chat.id] = {
      name: "opUrlSet",
      command: "channels",
      author: msg.from.id,
      storage: msg.forward_from_chat,
    };
  } catch (error) {
    this.sendMessage(msg.chat.id, `Канал не найден попробуйте снова`);
  }
};

module.exports.opUrlSet = async function (msg) {
  try {
    this.state[msg.chat.id].storage.url = msg.text;
    this.db.push(`${this.name}:op`, this.state[msg.chat.id].storage);

    // clear state
    this.sendMessage(
      msg.chat.id,
      `Канал ${this.state[msg.chat.id].storage.title} с линком ${
        msg.text
      } зарегестрировано`
    );
    delete this.state[msg.chat.id];
  } catch (error) {
    console.log(error);
    this.sendMessage(msg.chat.id, `Линк не найден попробуйте снова`);
  }
};

module.exports.list = async function (msg) {
  const l = (await this.db.get(`${this.name}:op`)) || [];
  let str = "Актуальный список каналов:\n";
  for (const c of l) {
    str += `\n${c.title}`;
  }
  this.sendMessage(msg.chat.id, str, {
    parse_mode: "HTML",
  });
};

module.exports.del = async function (msg) {
  let inline_keyboard = (await this.db.get(`${this.name}:op`)) || [];

  inline_keyboard = inline_keyboard.map((ch) => [
    { text: ch.title, callback_data: `bridge:channels:del_2:${ch.id}` },
  ]);

  this.sendMessage(
    msg.chat.id,
    `Выберите канал из списка, который хотите удалить ⬇️`,
    {
      reply_markup: JSON.stringify({ inline_keyboard }),
    }
  );
};

module.exports.del_2 = async function (msg, id) {
  const ch = (await this.db.get(`${this.name}:op`)) || [];
  this.sendMessage(
    msg.chat.id,
    `Вы уверены, что хотите удалить канал ${
      ch.filter((c) => c.id == id)[0].title
    }?`,
    {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [
            { text: "Да", callback_data: `bridge:channels:del_3:${id}` },
            { text: "Нет ", callback_data: `clr-msg` },
          ],
        ],
      }),
    }
  );
};

module.exports.del_3 = async function (msg, id) {
  await this.db.filter(`${this.name}:op`, (c) => c.id != id);
  this.sendMessage(
    msg.chat.id,
    "Готово! канал удален из списка обязательных каналов для подписки"
  );
};
