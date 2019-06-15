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
const getPixels = require("get-pixels")


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


const model = new KerasJS.Model({
  filepath: 'https://transcranial.github.io/keras-js-demos-data/mnist_cnn/mnist_cnn.bin',
})


app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))
app.use('/', express.static(path.join(__dirname, 'public')))

app.post('/makeGuess', (req, res) => {
  base64Img.img(req.body.img,'./uploads',cryptoRandomString(10), function(err, filepath) {
    let fileName = filepath.split('.')[0] += '_scaled.' + filepath.split('.')[1]
    sharp(filepath)
      .resize(28,28)
      .toFile(fileName).then(() => {
        getPixels(fileName, function(err, pixels) {
        if(err) {
          console.log("Bad image path")
          return
        }
        let data = pixels.data
        this.input = new Float32Array(784)
        for (let i = 0, len = data.length; i < len; i += 4) {
          this.input[i / 4] = data[i + 3] / 255
        }

        console.log(data.length)

        model.predict({ input: this.input }).then(outputData => {
          console.log(outputData)

          model.modelLayersMap.forEach((layer, name) => {
            console.log(name)
          })
        })
      })
      })
    })
})


// app.post('/makeGuess', (req, res) => {
//   this.input = new Float32Array(784)
//   let data = req.body.img
//
//   console.log(data)
//
// })


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
