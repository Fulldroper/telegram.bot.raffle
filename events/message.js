module.exports = async function (msg) {
  process.env.DEBUG && console.log({time: new Date() ,cmd: msg.text, from: {name: msg.from.username, id: msg.from.id}});
  try {
    // fix media
    if (msg.media_group_id && msg.media_group_id === this.cache?.media_group) {
      return;
    } else if (msg.media_group_id) {
      this.cache.media_group = msg.media_group_id;
    }

    // ignore commands from bots
    if (msg.from.is_bot) return;

    // check if it command
    if (msg?.entities?.length > 0 && msg?.entities[0]?.type === "bot_command") {
      const cmd = msg.text.split(" ");
      // check if is only for private
      if (
        this.commands[cmd[0].slice(1)]?.info?.types?.includes(msg.chat.type)
      ) {
        // check if not admin
        if (this.commands[cmd[0].slice(1)]?.info?.onlyAdmins) {
          if (!this.config.admins.includes(msg.from.id)) return;
        }

        if (cmd.length > 1) msg.meta = cmd.slice(1);

        this.commands[cmd[0].slice(1)].run.call(this, msg);
        return;
      } else {
        this.sendMessage(msg.chat.id, "wrong type of chat");
      }
    }

    // check if state wait answer

    // console.log(this?.state, msg);
    if (
      this?.state[msg.chat.id]
      // this?.state[msg.chat.id].author === msg.from.id
    ) {
      this.commands[this.state[msg.chat.id].command][
        this.state[msg.chat.id].name
      ].call(this, msg);

      return;
    }

    return;
  } catch (error) {
    this.sendMessage(msg.chat.id, "error on running command");
    console.log(error);
  }
};
