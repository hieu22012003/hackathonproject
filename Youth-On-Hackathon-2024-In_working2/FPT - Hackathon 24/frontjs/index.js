const fs = require('fs')
const https = require('https')
const { execSync: exec } = require('child_process')
const { Deepgram } = require('@deepgram/sdk')
const ffmpegStatic = require('ffmpeg-static')
const deepgram = new Deepgram('b3d52716972828409a3a7c9a305d1955b7cd47fb')

async function ffmpeg(command) {
    return new Promise((resolve, reject) => {
      exec(`${ffmpegStatic} ${command}`, (err, stderr, stdout) => {
        if (err) reject(err)
        resolve(stdout)
      })
    })
  }

async function transcribeLocalVideo(filePath) {
    ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`)

    const audioFile = {
        buffer: fs.readFileSync(`${filePath}.wav`),
        mimetype: 'audio/wav',
    }
    const response = await deepgram.transcription.preRecorded(audioFile, {
        punctuation: true,
    })
    return response.results
    }

    transcribeLocalVideo('deepgram.mp4').then((transcript) =>
    console.dir(transcript, { depth: null })
)

async function downloadFile(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, (response) => {
        const fileName = url.split('/').slice(-1)[0] // Get the final part of the URL only
        const fileStream = fs.createWriteStream(fileName)
        response.pipe(fileStream)
        response.on('end', () => {
          fileStream.close()
          resolve(fileName)
        })
      })
    })
}

async function transcribeRemoteVideo(url) {
    const filePath = await downloadFile(url)
    const transcript = await transcribeLocalVideo(filePath)
    console.dir(transcript, { depth: null })
}