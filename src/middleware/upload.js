const multer = require('multer');
const path = require('path')

const imagesDir = path.join(__dirname, '..', 'image');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {cb(null, imagesDir);},

    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const fileTitle = path.basename(file.originalname, extension);
        const name = `${Date.now()}-${fileTitle}${extension}`;
        cb(null, name);
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 5*1024*1024}
});


function single(fieldName = 'image') {
  return upload.single(fieldName);
}

function getPublicPathFromFile(file) {
  if (!file || !file.filename) return null;
  return `/image/${file.filename}`;
}

module.exports = {
    single,
    getPublicPathFromFile
}
