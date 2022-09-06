import fs from 'fs';
import { exec } from 'child_process'

export function migrateFiles(now: Date): void {
  console.log(`${now} - time to migrate files!`)
  const nowS = Date.now();
  const migrationReadyTimestamp = nowS - ((+process.env.READY_TO_MIRATE_AFTER_S!)*1000)
  exec('df -P | awk \'{print $6}\'', (err,stdout,stderr) => {
    if (err) {
      console.log('Couldnt retrieve info about connected devices! File migration failed')
      return
    }
    let isDeviceConnected = 0;
    stdout.split('\n').forEach((deviceName) => {
      if (process.env.TARGET_PATH!.includes(deviceName)) {
        isDeviceConnected = 1;
      }
    })
    if (!isDeviceConnected) {
      console.log('Couldnt retrieve info target device - might be disconnected! File migration failed')
      return
    }
    fs.readdir(process.env.DATA_PATH!, (err,files) => {
      files.forEach(file => {
        console.log('Validating file creation date:', file)
        fs.lstat(`${process.env.DATA_PATH!}/${file}`, (err, stats) => {
          if (stats.birthtimeMs<=migrationReadyTimestamp) {
            console.log('Merging file:', file)
            return fs.readFile(`${process.env.DATA_PATH!}/${file}`, (err, data) => {
              fs.writeFile(`${process.env.TARGET_PATH!}/${file}`, data, () => {
                console.log(`Migrating file ${file} succeded!`);
              })
              if (process.env.DELETE_SOURCE_FILES!) {
                fs.unlinkSync(`${process.env.DATA_PATH!}/${file}`)
              }
            })
          } else {
            console.log('Migration skipped, file is to young', file);
          }
        })
      }) 
    })
  })
}