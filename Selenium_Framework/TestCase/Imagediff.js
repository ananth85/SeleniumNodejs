var imageDiff = require('image-diff');

imageDiff({
  actualImage: 'F:\\Dev\\Pranitha\\Selenium_Framework\\screenshots\\11bae829-db11-4c34-b1da-579b30c423b8\\4d3bce4c-6a38-4064-9dc8-a7513a9314d4.png',
  expectedImage: 'F:\\Dev\\Pranitha\\Selenium_Framework\\screenshots\\7455d525-f6ab-423a-a9a0-422fe1a1cc33\\fbd304eb-74a9-4bb2-bd86-37633788e79a.png',
  diffImage: '/difference.png',
}, function (err, imagesAreSame) {
  console.log(err)
});