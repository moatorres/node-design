// class
class Image {
  constructor(path) {
    this.path = path
  }
}

// factory function
function createImage(name) {
  return new Image(name)
}

// factory λ
const createImageλ = (name) => new Image(name)

// usage
const image1 = createImage('photo.jpeg')
const image2 = createImageλ('photo.jpeg')

console.log(image1, image2)
