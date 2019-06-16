window.addEventListener('load', () => {
  const canvas = new fabric.Canvas('canvas');
  canvas.isDrawingMode= true
  let width = 1200, height = 850

  canvas.setHeight(height);
  canvas.setWidth(width);
  canvas.backgroundColor="black";

  let pencil = new fabric.PencilBrush(canvas)
  pencil.width = 30
  pencil.color = 'white'

  canvas.freeDrawingBrush = pencil
  const guessButton = window.guess

  guessButton.addEventListener('click', () => {
    exportCanvas(canvas).then((res) => {
      postData('/predictDigit', {img:res}).then((response) => {
        console.log(response)
      })
    })
  })
})

function exportCanvas(canvas) {
  return new Promise((resolve) => {
    const exportedImage = canvas.toDataURL({
      format: 'png',
    });
    resolve(exportedImage)
  })
}

function postData(url, data) {
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      headers: new Headers({'content-type': 'application/json'}),
      body: JSON.stringify(data),
    }).then(function (res) {
      return res.json()
    }).then((data) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    });
  })
}
