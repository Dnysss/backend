const multer = require('multer');
const path = require('path');

//Destination to store the images
const imageStorage = multer.diskStorage({
    destination: function(req, res, cb) {
        let folder = "";

        if(req.baseUrl.includes("users")) {
            folder = "users";
        }

        cb(null, `public/imgs/${folder}`);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error("Envie apenas arquivos pnj ou jpg!"))
        }
        cb(undefined, true);
    },
})

module.exports = { imageUpload };
