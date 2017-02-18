const path = require('path')
const { spawn } = require('child_process')

module.exports = {
  convert: (appFileInput, pngFileOutput) => {
    return new Promise((resolve, reject) => {
      const progPath = path.join(process.cwd(), 'build', 'app2png-rs')
      const app2png = spawn(progPath, [appFileInput, pngFileOutput])
      app2png.on('close', (code) => {
        code === 0 ? resolve() : reject()
      })
    })
  }
}
