module.exports = async function(option = {}) {
  const {
    count = 1,
    type = "buy",
    date = new Date().getTime(),
    user = "",
    EX = false,
    generator = (seed = 0, len = 10, tag = "#") => {
      const lib = '1234567890qazxswedcvfrtgbnhyujmkiolp'
      let res = ''
      for (let i = 0; i < len; i++) {
        res += lib.charAt(Math.floor(Math.random() * lib.length))
      }
      return `${tag}${res}`
    }
  } = option

  let counter = 0

  let res = []

  while(counter < count) {
    const generatedTiketName = generator()
    if (!await this.db.get(`${this.name}:ticket:${generatedTiketName}`)) {
      await this.db.set(`${this.name}:ticket:${generatedTiketName}`, {
        type, date, user, id: generatedTiketName
      }, EX)

      res.push(generatedTiketName)
      
      counter++
    }
  }

  return res
}