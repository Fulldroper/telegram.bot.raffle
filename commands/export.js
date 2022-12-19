module.exports.info = {
  command: "export",
  description: "export table",
  types: ["private"],
  onlyAdmins: true,
};

module.exports.run = async function (msg) {
  const tickets = (await this.db.keys(`*`))
    .filter(e => new RegExp(`^${this.name}:ticket\:.*$`).test(e))
    .map(e => e.split(":")[2])

  let file = 'Билет,ID,username'
  
  for (const ticket of tickets) {
    const info = await this.db.get(`${this.name}:ticket:${ticket}`)
    file += `\n${info.id},${info.user.id},${info.user.username}`
  }

  const { writeFileSync} = require("node:fs")
  
  writeFileSync('tmp.csv', file)
  //`data:text/csv;base64,${Buffer.from(file).toString('base64')}`

  this.this.telegram.sendDocument(msg.chat.id, './tmp.csv')
};