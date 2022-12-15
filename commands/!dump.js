module.exports.info = {
  "command": "dump",
  "description": "test command",
  "types": ["private"],
  "onlyAdmins": true
}

module.exports.run = async function(msg) {
  console.log(this, msg)
}