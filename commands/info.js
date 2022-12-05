const { EmbedBuilder } = require("discord.js")

module.exports.info = {
  "name": "info",
  "dm_permission": false,
  "type": 1,
  "description": "Інформація про бота"
}

module.exports.run = async function(interaction) {
  const c = "author"
  const embed = new EmbedBuilder()
  .setColor(0x5a3cbb)
  // і **${this.guilds.cache.size}** серверів
  .setThumbnail("https://propozicii.ml/assets/media/logo.png")
  .setTitle(`Інформація про бота`)
  .setURL("https://propozicii.ml/")
  .setDescription(`🇺🇦 Цей бот був спеціально написаний для створення гарних та більш функціональних пропозицій
  \n✨ [Автор Бота fd#6297](https://fulldroper.cf/) написати автору </${c}:${this.cmds[c].id}>
  \n👥 Наразі обслуговується **${this.users_counter}** користувачів
  \n🌐 Сайт бота [propozicii.ml](https://propozicii.ml/)
  \n🚀 [Запросити бота на свій сервер](https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=applications.commands%20bot)
  \n🎉 Підтримка розробника https://www.patreon.com/fulldroper/
  \n** **`)
  .setFooter({
    text: `"Дякую за підтримку украіномовної розробки" - Автор`,
  })

  interaction.reply({
    "embeds": [embed], 
    "ephemeral": true
  }).catch(e => console.error(e))
}