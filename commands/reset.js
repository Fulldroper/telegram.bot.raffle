module.exports.info = {
  "name": "reset",
  "dm_permission": false,
  "type": 1,
  "description": "Очистити топ"
}

module.exports.run = async function(interaction) {
  if (interaction.member.permissions.serialize().Administrator) {
    await this.db.clear(`${this.user.username}:${interaction.guildId}:stats`)
  
    interaction.reply({
      content: `Топ 10 сервера ${interaction.guild.name} очищенно`,
      ephemeral: true 
    })
  } else interaction.reply({ content: '❌ Ви маєте мати права адміністратора', ephemeral: true }).catch(e => console.error(e));
}