const path = require('path')
const { spawn } = require('child_process')

module.exports = {
  convert: (appFileInput, pngFileOutput) => {
    return new Promise((resolve, reject) => {
      const progPath = path.join(process.cwd(), 'build', 'app2png-rs')
      const app2png = spawn(progPath, [appFileInput, pngFileOutput])
      const err = []
      app2png.stderr.on('data', (data) => err.push(data))
      app2png.on('close', (code) => {
        code === 0 ? resolve() : reject(err.join(''))
      })
    })
  }
}
