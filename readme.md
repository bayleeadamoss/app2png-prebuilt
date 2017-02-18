~~~ javascript
const app2png = require('app2png-prebuilt')
app2png.convert('/Applications/Zazu.app', './Zazu.png').then(() => {
  console.log('done')
})
~~~
