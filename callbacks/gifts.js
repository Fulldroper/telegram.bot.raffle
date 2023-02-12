module.exports.run = async function (call) {
  const gifts = (await this.db.get(`${this.name}:gifts`)) || false;

  if (!gifts || gifts.length < 1) {
    this.sendMessage(
      call.message.chat.id,
      "🤷‍♂️Пока что неизвестно какие призы будут..."
      //buttons
    );
    return;
  }

  gifts.forEach(({fromId, mId, url = false}) => {
    inline_keyboard = [];
    if (url) {
      inline_keyboard.push([
        { text: "🤝Спонсор", url, callback_data: "no-react" },
      ]);
    }
    inline_keyboard.push([{ text: "🔙Назад", callback_data: "menu" }]);
    const reply_markup = JSON.stringify({ inline_keyboard });
    this.copyMessage(call.message.chat.id, fromId, mId, { reply_markup });
  });
};
