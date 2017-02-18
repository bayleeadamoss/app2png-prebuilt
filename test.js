const app2png = require('./')

app2png.convert('/Applications/Messages.app', './Messages.png').then(() => {
  console.log('done')
  process.exit(0)
}).catch((error) => {
  console.log('failed', error)
  process.exit(1)
})
