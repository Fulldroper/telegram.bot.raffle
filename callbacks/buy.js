module.exports.run = async function (call) {
  const settings = await this.db.get(`${this.name}:settings`) || {tiket_cost: 100}
  const buttons = {
    parse_mode: "HTML",
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [
          { text: "➕", callback_data: "plus" },
          { text: "1", callback_data: "no-react" },
          { text: "➖", callback_data: "minus" },
        ],
        [{ text: `💰Общая сумма: ${settings.tiket_cost}₽`, callback_data: "no-react" }],
        [{ text: "✅Перейти к оплате", callback_data: "buy_2" }],
        [{ text: "🔙Назад", callback_data: "menu" }],
      ],
    }),
  };
  this.telegram.sendMessage(
    call.message.chat.id,
    `Тут Вы можете купить дополнительные билеты для увеличения шансов на выигрыш!\n<b>1 билет </b>= ${settings.tiket_cost}₽\nВоспользуйтесь кнопками ниже, чтобы купить нужное кол-во билетов!\n❗️Кнопка посередине показывает кол-во билетов, которое Вы выбрали для покупки`,
    buttons
  );
};