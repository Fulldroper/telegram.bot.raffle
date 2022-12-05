module.exports.info = {
  "name": "channel",
  "dm_permission": false,
  "type": 1,
  "description": "Вибрати канал для публікації",
  "options": [{
    "name": "channel",
    "description": "Текстовий канал",
    "type": 7,
    "channel_types": 0,
    "required": true
  }]
}

module.exports.run = async function(interaction) {
  if (interaction.member.permissions.serialize().Administrator) {
    const ref = interaction.options.get("channel")
      this.db.set(`${this.user.username}:${interaction.guildId}:settings`, {channel: ref.value})
      interaction.reply({ content: `✅ <#${ref.value}>, встановлено як канал для публікацій.`, ephemeral: true }).catch(e => console.error(e));
  } else interaction.reply({ content: '❌ Ви маєте мати права адміністратора', ephemeral: true }).catch(e => console.error(e));
}