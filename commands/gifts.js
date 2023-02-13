module.exports.info = {
  command: "gifts",
  description: "gifts",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  const gifts = (await this.db.get(`${this.name}:gifts`)) || false;

  if (!gifts || gifts.length < 1) {
    this.sendMessage(
      msg.chat.id,
      "🤷‍♂️Пока что неизвестно какие призы будут...",
      {reply_markup: JSON.stringify({
        inline_keyboard:[
          [{ text: "Добавить приз", callback_data: `bridge:gifts:add` }]
        ]
      })}
    );
    return;
  }

  gifts.forEach(({fromId, mId, url = false}) => {
    const inline_keyboard = [
      [
        {
          text: "Изменить описание",
          callback_data: `bridge:gifts:change:${mId}:${fromId}`,
        },
        {
          text: "Удалить приз",
          callback_data: `bridge:gifts:delete:${mId}:${fromId}`,
        },
      ],
      [
        { text: "✅Готово", callback_data: "clr-msg" },
        { text: "Добавить приз", callback_data: `bridge:gifts:add` }
      ],
    ]
    if (url) {
      inline_keyboard.unshift([{ text: "🤝Спонсор", url, callback_data: "no-react" }])    
    }
    this.copyMessage(msg.chat.id, fromId, mId, {
      reply_markup: JSON.stringify({inline_keyboard}),
    });
  });
};

module.exports.change = async function (msg, mId, fromId) {
  this.sendMessage(
    msg.chat.id,
    "Отправьте новое описание (Можно использовать фото, видео или альбомы с фото):",
    { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "changeDescription",
    command: "gifts",
    author: msg.from.id,
    storage: {mId, fromId},
  };
};

module.exports.delete = async function(msg, mId, fromId) {
  this.deleteMessage(msg.chat.id, msg.message_id);
  const arr = await this.db.get(`${this.name}:gifts`) || []
  await this.db.obj.set(`${this.name}:gifts`,JSON.stringify(arr.filter(el => el.mId != mId)))

  this.sendMessage(
    msg.chat.id,
    "Приз удален...",
    {reply_markup: JSON.stringify({
      inline_keyboard:[
        [{ text: "Добавить приз", callback_data: `bridge:gifts:add` }]
      ]
    })}
  )
}

module.exports.add = async function (msg) {
  this.sendMessage(
    msg.chat.id,
    "Отправьте новое описание (Можно использовать фото, видео или альбомы с фото):",
    { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "changeDescription",
    command: "gifts",
    author: msg.from.id,
  };
}

module.exports.changeDescription = async function (msg) {
  const storage = this.state[msg.chat.id]?.storage || false
  let arr = await this.db.get(`${this.name}:gifts`) || []
  console.log(arr, this.state[msg.chat.id].storage);
  if(storage) {
    arr = arr.filter(el => el.mId != Number(storage.mId))
  }
  arr.push({
    fromId: msg.from.id,
    mId: msg.message_id,
  })

  await this.db.obj.set(`${this.name}:gifts`,JSON.stringify(arr))

  this.state[msg.chat.id].storage = { mId: msg.message_id }

  this.sendMessage(msg.chat.id, "Нужна кнопка со спонсором?", {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "✅Да", callback_data: "bridge:gifts:addUrl" }],
        [{ text: "❌Нет", callback_data: "bridge:gifts:changeFinish" }],
      ],
    }),
  });
};

module.exports.addUrl = async function (msg) {
  this.sendMessage(
    msg.chat.id,
    "Пришлите ссылку, которую нужно поставить на кнопку:",
    { parse_mode: "HTML" }
  );
  this.state[msg.chat.id] = {
    name: "pickUrl",
    command: "gifts",
    author: msg.from.id,
    storage: this.state[msg.chat.id].storage
  };
};

module.exports.pickUrl = async function (msg) {
  const tmp = await this.db.get(`${this.name}:gifts`);
  console.log(this.state[msg.chat.id]);
  if (
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/.test(
      msg.text
    )
  ) {
    tmp[tmp.findIndex(el => el.mId === this.state[msg.chat.id].storage.mId)].url = msg.text;
    await this.db.set(`${this.name}:gifts`, tmp);
    this.sendMessage(msg.chat.id, "👍Описание изменено", {
      parse_mode: "HTML",
    });
    delete this.state[msg.chat.id];

  } else {
    this.sendMessage(msg.chat.id, "❌Это не ссылка. Напишите ещё раз:", {
      parse_mode: "HTML",
    });
  }
};

module.exports.changeFinish = async function (msg) {
  // const tmp = await this.db.get(`${this.name}:gifts`);
  // tmp.url = undefined;
  // await await this.db.set(`${this.name}:gifts`, tmp);
  this.sendMessage(msg.chat.id, "👍Описание изменено", { parse_mode: "HTML" });
};
