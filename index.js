const path = require('path')
const { spawn } = require('child_process')

module.exports = {
  convert: (appFileInput, pngFileOutput) => {
    return new Promise((resolve, reject) => {
      const progPath = path.join(process.cwd(), 'build', 'app2png-rs')
      const app2png = spawn(progPath, [appFileInput, pngFileOutput])
      app2png.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      app2png.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });
      app2png.on('close', (code) => {
        console.log('meow', code)
        code === 0 ? resolve() : reject()
      })
    })
  }
}
