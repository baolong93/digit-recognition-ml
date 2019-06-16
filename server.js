const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const port = 3000
const base64Img = require('base64-img');
const cryptoRandomString = require('crypto-random-string');
const bodyParser = require('body-parser');
const KerasJS = require('keras-js')
const sharp = require('sharp');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))
app.use('/', express.static(path.join(__dirname, 'public')))

const model = new KerasJS.Model({
  filepath: 'https://transcranial.github.io/keras-js-demos-data/mnist_cnn/mnist_cnn.bin',
})


app.post('/predictDigit', (req, res) => {
  console.log('sdsdsds')
  const fileName = cryptoRandomString(10)
  base64Img.img(req.body.img,'./temp',fileName, function(err, filepath) {
    let scaledImagePath = `./scaled_images/${fileName}.` + filepath.split('.')[1]
    sharp(filepath)
      .resize(28,28)
      .toFile(scaledImagePath).then((scaled) => {
        console.log("image successfully saved to : " + scaledImagePath)
        console.log(scaled)
      })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
