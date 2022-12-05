// aplication runner
(async () => {
  // env configuration
  process.env.Production || await require('dotenv').config({ debug: false })

  // import configs
  const { config, description } = await require("./package.json")

  // import libs
  const { readdirSync } = await require('fs')
  const { REST, Routes, Client, GatewayIntentBits } = await require('discord.js');

  // init discord bot && rest obj
  const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessageReactions
  ] });
  const rest = new REST({ version: '10' }).setToken( process.env.TOKEN );

  // import configs to discord bot object
  bot.config = config

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

  // init custom prototypes
  bot.addons['moded_prototypes']()

  // init db
  bot.db = new bot.addons["redis_db"](process.env.REDIS_URL)

  // init error cath method and add to discord bot object
  try {
    // validate env
    if (!process.env.ERROR_WEBHOOK_URL || !process.env.CLIENT_ID) throw "wrong env";
    
    // init addon
    bot.catch_err = bot.addons['errorCallback']({
      webhook_url: process.env.ERROR_WEBHOOK_URL,
      username: process.env.CLIENT_ID,
    })

  } catch (error) {
    console.error("[Error catch module can`t be imported]:", error);
  }

  // import and register commands
  bot.cmds = await importer(config.path.commands)
  bot.cmdKeyLib = {}
  const exit = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID))
  
  const now = Object.keys(bot.cmds)
  const old = exit.filter(c => (!now.includes(c.name)))

  for (const item of old) {
    await rest.delete(`${Routes.applicationCommands(process.env.CLIENT_ID)}/${item.id}`)
  }

  if (bot.cmds) {
    for (const command in bot.cmds) {
      const { id } = await rest.post(Routes.applicationCommands(process.env.CLIENT_ID), { body: bot.cmds[command].info })
      bot.cmds[command].id = id
      bot.cmdKeyLib[command] = command
      bot.cmdKeyLib[id] = command
    }
  }

  const _cmds = {}
  const _arr = (await rest.get(Routes.applicationCommands(process.env.CLIENT_ID)))

  for (const x of _arr) {
    _cmds[x.name] = x.id
  }
  
  // let _description = description
  // const ms = description.matchAll(/\$[a-z]{1,32}/gm)
  
  // for (const m of ms) {
  //   const c = m[0].slice(1)
  //   if (_cmds[c]) {
  //     _description = _description.replaceAll(m[0],`</${c}:${_cmds[c]}>`)
  //   }
  // }

  // _description = _description.slice(0,400 - 3)
  // _description += "..."

  // bot.addons['descriptionManage']({testerToken: process.env.TESTER_TOKEN, appID:process.env.CLIENT_ID, description:_description})
  // .catch(e => console.log(e))

  // import and register events
  const events = await importer(config.path.events)
  if (events) {
    for (const key in events) {
      bot.on(key, events[key])
    }
  }

  // run bot
  bot.login( process.env.TOKEN )
})()
// @@@
// - create голосування з параметрами: варіанти відповіді (з позначенням правильної), текст-питання, фото
// (встановлення часу на голосування, по дефолту можна поставити хвилин 10)
// - top 10 переможців
// - reset top
// const cfg = {
//   timingLimit: 1000, //ms
//   userLimit: 0, // if 0 unlimit
//   params : [
//     { value: 'Answer021100000000000000000000000000000...', isCorrect: true },
//     { value: 'Answer 21sssssssssssssssssssssssssssssssssssss2', isCorrect: false },
//     { value: 'Answer 123'},
//   ],
//   users: [
//     ['snowFlake0','snowFlake01','snowFlake02','snowFlake02','snowFlake02','snowFlake02'],
//     [],
//     ['snowFlake2'],
//   ]
// }

// const render = await require("./render")

// const canvas = await render(cfg)
