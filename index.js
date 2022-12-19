// aplication runner
(async () => {
  // env configuration
  process.env.Production || await require('dotenv').config({ debug: false })

  // import libs
  const { readdirSync } = await require('fs')
  const bot = new (await require('telegraf')).Telegraf(process.env.TOKEN , {polling: true});
  const axios = require("axios")
  
  // import configs
  const { config, name, description } = await require("./package.json")
  bot.config = config
  bot.name = name

  // function of importing modules from folder
  const importer = async (path, blocked_char = "!") => {
    // modules colector
    const colector = {}
    
    // reading folder items
    let items
    try {
      items = readdirSync(path)
    } catch (error) {
      console.error(`[modules not founds in]: "${ path }"`);
      return {}
    }

    // each files and import
    items.forEach(file => {
      // check if module not blocked for import
      if (file[0] === blocked_char) return
    
      try {
        // importing module
        const module = require(`${ path }${ file }`) 
      
        // adding module to colector
        colector[file.replace(/\.[^/.]+$/, "")] = module
      } catch (error) {
        console.error(`[can\`t import module]: "${ path }${ file }"`);
      }
    })
    
    // return imported modules
    return colector
  }

  // import addons
  bot.addons = await importer(config.path.addons)

  // import commands
  bot.commands = await importer(config.path.commands)

  // import callbacks
  bot.callbacks = await importer(config.path.callbacks)

  // import events
  const events = await importer(config.path.events)
  
  // init custom prototypes
  bot.addons['moded_prototypes']()

  // init custom prototypes
  bot.newTicket = bot.addons['ticket']

  // init db
  bot.db = new bot.addons["redis_db"](process.env.REDIS_URL)

  // register commands
  const commandsContainer = []

  for (const command in bot.commands) {
    commandsContainer.push(bot.commands[command].info)
  }

  // bot.setMyCommands([]) // clear commands for all
  axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/setMyCommands`, {commands: [] })
  // set only for admins
  config.admins.forEach(chat_id => {
    axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/setMyCommands`, {
      commands: commandsContainer,
      scope: { type: "chat", chat_id }
    })
  })

  delete commandsContainer

  // connect to db
  await bot.db.connect()
 
  // reg state container
  bot.state = {}

  // init events
  if (events) {
    for (const key in events) {
      bot.on(key, events[key])
    }
  }

})()

/*
==================================
-- ~  ~ ~ [ DB SCHEME ] ~ ~ ~ ~ --
==================================

bot_name:settings {
  condition
  ref_count
  tiket_cost
}

bot_name:channels [
  chat_id, ...
]

bot_name:events {
  event_id: end_date
}

bot_name:user_id:tikets [
  tiket_id, ...
]

bot_name:user_id:refs = 0

*/