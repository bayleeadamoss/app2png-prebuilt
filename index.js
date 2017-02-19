const path = require('path')
const { execFile, spawn } = require('child_process')

module.exports = {
  convert_1: (appFileInput, pngFileOutput) => {
    // spawn - rust
    return new Promise((resolve, reject) => {
      const progPath = path.join(process.cwd(), 'build', 'app2png-rs')
      const app2png = spawn(progPath, [appFileInput, pngFileOutput])
      const err = []
      app2png.stderr.on('data', (data) => err.push(data))
      app2png.on('close', (code) => {
        code === 0 ? resolve() : reject(err.join(''))
      })
    })
  },
  convert_2: (appFileInput, pngFileOutput) => {
    // execFile - rust
    return new Promise((resolve, reject) => {
      const progPath = path.join(process.cwd(), 'build', 'app2png-rs')
      execFile(progPath, [appFileInput, pngFileOutput], (error) => {
        error ? reject(error) : resolve()
      })
    })
  },
  convert_3: (appFileInput, pngFileOutput) => {
    // spawn - javascript
    const fs = require('fs')
    const exec = require('child_process').exec
    const plist = require('simple-plist')
    const getIconFile = (appFile) => {
      return new Promise((resolve, reject) => {
        const plistPath = path.join(appFileInput, 'Contents', 'Info.plist')
        plist.readFile(plistPath, (err, data) => {
          if (err) return reject(err)
          if (!data.CFBundleIconFile) {
            return resolve('/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns')
          }
          const iconFile = path.join(appFileInput, 'Contents', 'Resources', data.CFBundleIconFile)
          const iconFiles = [iconFile, iconFile + '.icns', iconFile + '.tiff']
          const existedIcon = iconFiles.find((iconFile) => {
            return fs.existsSync(iconFile)
          })
          resolve(existedIcon || '/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericApplicationIcon.icns')
        })
      })
    }
    const sortIcons = (icons) => {
      const aWins = -1
      const bWins = 1
      const catWins = 0
      return icons.sort((a, b) => {
        const aSize = parseInt(a.match(/(\d+)x\1/)[1], 10)
        const bSize = parseInt(b.match(/(\d+)x\1/)[1], 10)
        if (aSize === bSize) {
          if (a.indexOf('@2x') > -1) return aWins
          if (b.indexOf('@2x') > -1) return bWins
          return catWins
        }
        if (aSize > bSize) return aWins
        if (aSize < bSize) return bWins
        return catWins
      })
    }
    const icnsToPng = (iconFile, pngFileOutput) => {
      const outputDir = pngFileOutput + '.iconset'
      return new Promise((resolve, reject) => {
        exec(`iconutil --convert iconset '${iconFile}' --output '${outputDir}'`, (error) => {
          if (error) return reject(error)
          fs.readdir(outputDir, (error, files) => {
            if (error) return reject(error)
            const realIcons = files.map((file) => {
              return path.join(outputDir, file)
            })
            const biggestIcon = sortIcons(realIcons).find(Boolean)
            // Move to destination
            if (!biggestIcon) {
              console.log('--rename--', realIcons, iconFile, biggestIcon, pngFileOutput)
            }
            fs.rename(biggestIcon, pngFileOutput, (error) => {
              error ? reject(error) : resolve(realIcons.filter((file) => {
                return file !== biggestIcon
              }))
            })
          })
        })
      }).then((files) => {
        // Cleanup temp icons
        return Promise.all(files.map((file) => {
          return new Promise((resolve, reject) => {
            fs.unlink(file, (error) => {
              error ? reject(error) : resolve()
            })
          })
        }))
      }).then(() => {
        // Cleanup temp directory
        return new Promise((resolve, reject) => {
          fs.rmdir(outputDir, (error) => {
            error ? reject(error) : resolve()
          })
        })
      })
    }
    const tiffToPng = (iconFile, pngFileOutput) => {
      return new Promise((resolve, reject) => {
        exec(`sips -s format png '${iconFile}' --out '${pngFileOutput}'`, (error) => {
          error ? reject(error) : resolve()
        })
      })
    }
    return getIconFile(appFileInput).then((iconFile) => {
      if (iconFile.substr(-4) === 'icns') {
        return icnsToPng(iconFile, pngFileOutput)
      } else {
        return tiffToPng(iconFile, pngFileOutput)
      }
    })
  }
}
