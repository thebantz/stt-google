const speech = require('@google-cloud/speech');
const fs = require('fs');

async function main() {
  const client = new speech.SpeechClient();
  const filename = './resources/audio.raw'; //TODO: upload clips of you talking!

  const file = fs.readFileSync(filename);
  const audioBytes = file.toString('base64');

  const audio = {
    content: audioBytes,
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);

  
}