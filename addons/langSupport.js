module.exports = (text, values) => {
  for(const key in values){
    text = text.replace(`\$\{${key}\}`, values[key], "gm")
  }
  
  return text
}