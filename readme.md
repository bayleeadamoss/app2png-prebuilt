## APP 2 PNG Prebuilt for Node

WARNING: This rust implementation was slower than node, so this will no longer
be maintained.

Extract a Mac App's icon to a png file to be used for Node.

## Installation

~~~
npm install --save app2png-prebuilt
~~~

## Usage Example

~~~ javascript
const app2png = require('app2png-prebuilt')

app2png.convert('/Applications/Zazu.app', './Zazu.png').then(() => {
  console.log('done')
})
~~~
