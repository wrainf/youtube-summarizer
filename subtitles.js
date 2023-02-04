const fs = require('fs')
const YoutubeMp3Downloader = require('youtube-mp3-downloader')
const { Deepgram } = require('@deepgram/sdk')
const ffmpeg = require('ffmpeg-static')
const dotenv = require('dotenv')

const { getSum } = require('./summarise')
dotenv.config()
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)
const YD = new YoutubeMp3Downloader({
  ffmpegPath: ffmpeg,
  outputPath: './',
  youtubeVideoQuality: 'highestaudio'
})

const getSubs = (videoID) => {
  return new Promise((resolve,reject) => {
    YD.download(videoID)

    YD.on('progress', data => {
      console.log(data.progress.percentage + '% downloaded')
    })
    
    YD.on('finished', async (err, video) => {
      if (err) return reject(err)
      const videoFileName = video.file
      console.log(`Downloaded ${videoFileName}`)
    
      const file = {
        buffer: fs.readFileSync(videoFileName),
        mimetype: 'audio/mp3'
      }
      const options = {
        punctuate: true
      }
    
      const result = await deepgram.transcription.preRecorded(file, options).catch(e => console.log(e))
      const transcript = result.results.channels[0].alternatives[0].transcript
    
      
      
      fs.unlinkSync(videoFileName)
      const summary = await getSum(transcript)
      resolve(summary);
  })
  })
}

module.exports = { getSubs }
