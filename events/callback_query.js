module.exports = async function (call) {
  try {
    // fast answer
    this.this.telegram.answerCallbackQuery({ callback_query_id: call.id })

    // if ignore
    if (call.data === "no-react") return;

    // ignore commands from bots
    if (call.from.is_bot) return;

    // check if not admin
    // if (!this.config.admins.includes(call.from.id)) return;
    const bridge = call.data.split(":");
    if (bridge[0] === "bridge") {
      this.commands[bridge[1]].run.call(this, call.message);
    } else this.callbacks[call.data].run.call(this, call);

    return;
  } catch (error) {
    this.telegram.sendMessage(call.message.chat.id, "error on running command");
    console.log(error);
  }
};