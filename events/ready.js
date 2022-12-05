module.exports = async function () {
  await this.db.connect()
  let users_counter = 0
  
  await this.guilds.cache.forEach(async s => users_counter += s.memberCount )
  
  this.users_counter = users_counter
  
  console.log('[start] as ', this.user.tag, " at ", new Date);
  console.log(`[Addons](${Object.keys(this.addons).length}):`, Object.keys(this.addons))
  console.log(`[Commands](${Object.keys(this.cmds).length}):`, Object.keys(this.cmds));
  console.log(`[Servers](${this.guilds.cache.size})`);
  console.log(`[Users](${users_counter})`);

  const { close } = require('../commands/create')

  this.addons["readyLoop"]( async function () {
    const loop = await this.db.get(`${this.user.username}:loop`)
    if (!loop || loop.length <= 0) return
    for (const o of loop) {
      if (new Date().getTime() - o.startOn >= o.time) {
        close.call(this, o)
      }
    }
  }, 1000, this)
}