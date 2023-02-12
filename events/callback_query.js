module.exports = async function (call) {
  process.env.DEBUG && console.log({time: new Date() ,callback: call.data, from: {name: call.from.username, id: call.from.id}});
  try {
    // fast answer
    this.answerCallbackQuery(call.id);

    // if ignore
    if (call.data === "no-react") return;
    if (call.data === "clr-msg") {
      this.deleteMessage(call.message.chat.id, call.message.message_id);
      return;
    }

    // ignore commands from bots
    if (call.from.is_bot) return;

    // check if not admin
    // if (!this.config.admins.includes(call.from.id)) return;
    const bridge = call.data.split(":");
    if (bridge[0] === "bridge") {
      this.commands[bridge[1]][bridge[2] ? bridge[2] : "run"].call(
        this,
        call.message,
        ...(bridge.slice(3))
      );
    } else this.callbacks[call.data].run.call(this, call);

    return;
  } catch (error) {
    this.sendMessage(call.message.chat.id, "error on running command");
    console.log(error);
  }
};
