const app2png = require('./')

const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

exec('mdfind kind:app', (err, output) => {
  const apps = output.trim().split('\n').filter((app) => {
    const plistPath = path.join(app, 'Contents', 'Info.plist')
    return fs.existsSync(plistPath)
  }).reduce((uniqueAppList, currentApp) => {
    const currentAppName = path.basename(currentApp)
    const foundApp = uniqueAppList.find((uniqueApp) => {
      const uniqueAppName = path.basename(uniqueApp)
      return uniqueAppName === currentAppName
    })
    if (!foundApp) {
      uniqueAppList.push(currentApp)
    }
    return uniqueAppList
  }, [])

  const start = new Date()
  Promise.all(apps.map((app) => {
    const iconPath = path.join('convert_2', path.basename(app) + '.png')
    return app2png.convert_2(app, iconPath)
  })).then(() => {
    const end = new Date()
    const endSeconds = (end - start) / 1000
    console.log('done', endSeconds)
  }).catch((e) => {
    console.log('error', e)
  })
})
