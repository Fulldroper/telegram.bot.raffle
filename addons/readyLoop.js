module.exports = async (fn, interval = 1000, bind) => {
  if(!fn) return
  console.log(`[readyLoop] started with interval ${interval}ms`);
  while (true) {
    if (bind) {
      await fn.call(bind)
    } else {
      await fn()
    }
    await interval.sleep() 
  }  
}