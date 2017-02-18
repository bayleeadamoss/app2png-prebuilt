const app2png = require('./')

app2png.convert('/Applications/Messages.app', './Messages.png').then(() => {
  console.log('done')
  process.exit(0)
}).catch(() => {
  console.log('failed')
  process.exit(1)
})
