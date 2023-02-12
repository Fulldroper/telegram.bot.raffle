const axios = require("axios")
module.exports.info = {
  command: "lang",
  description: "change text",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  const lang = await this.db.get(`${this.name}:lang`) || this.defaultLang

  const { writeFileSync } = require("node:fs");

  writeFileSync("lang.json", JSON.stringify(lang, null, " "));
  //`data:text/csv;base64,${Buffer.from(file).toString('base64')}`

  this.sendDocument(msg.chat.id, "./lang.json");
  
  // await (n => new Promise(r => setTimeout(r,n)))(3000)

  this.sendMessage(
    msg.chat.id,
    "Отправте новий файл с переводом",
    { parse_mode: "HTML" }
  );

  this.state[msg.chat.id] = {
    name: "setLang",
    command: "lang",
    author: msg.from.id,
    storage: {},
  };
};

module.exports.setLang = async function (msg) {
  if (msg.document && msg.document.mime_type === 'application/json') {
    const {result} = (await axios.get(`https://api.telegram.org/bot${process.env.TOKEN}/getFile?file_id=${msg.document.file_id}`)).data
   
    const file = (await axios.get(`https://api.telegram.org/file/bot${process.env.TOKEN}/${result.file_path}`)).data

    const old_ = await this.db.get(`${this.name}:lang`)

    for (const key in file) {
      if (old_[key] && file[key]) {
        old_[key] = file[key]
      }
    }

    await this.db.set(`${this.name}:lang`, old_)

    this.sendMessage(
      msg.chat.id,
      "Перевод изменен",
      { parse_mode: "HTML" }
    );

    delete this.state[msg.chat.id];
  } else {
    this.sendMessage(
      msg.chat.id,
      "Отправте новий файл с переводом",
      { parse_mode: "HTML" }
    );
  }
};

