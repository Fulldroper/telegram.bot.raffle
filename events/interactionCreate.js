module.exports = async function (interaction) {
  try {
    if (interaction.customId) interaction.meta = interaction.customId.split(":");
    
    const type = (["ping", "run", "component", "autocomplete", "modal"])[interaction.type - 1]
    const index = interaction.commandName || interaction.meta[0] 

    if (
      this.cmds[ index ] &&
      this.cmds[ index ][ type ]
      ) {
        
      await this.cmds[ index ][ type ].call(this, interaction)

    } else interaction.reply({ 
      content: 'Команда не існує', 
      ephemeral: true 
    })
    .then(e => console.log("Команда не існує", e, interaction))
    .catch(e => console.log("Команда не існує", e, interaction));

  } catch (error) {
    console.log(error);
  }
}