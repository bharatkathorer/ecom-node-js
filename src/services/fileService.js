const multer = require('multer');
const path = require('path');
const fs = require('fs');

function removePrefix(originalPath, prefix) {
    return path.normalize(originalPath.replace(prefix, ''));
}

const basePath = "./";
const uploadFile = (fieldName, folderName = '', allowedTypes = ['image']) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folderPath = path.join(basePath, folderName);
            // Ensure the folder exists
            fs.mkdirSync(folderPath, {recursive: true});
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });

    // File filter for validating file type and preventing empty files
    const fileFilter = (req, file, cb) => {
        if (!file.originalname || file.size === 0) {
            return cb(new Error("File is empty or missing"));
        }
        console.log(file.mimetype.split('/')?.[0])
        if (allowedTypes.length && !allowedTypes.includes(file.mimetype.split('/')?.[0])) {
            return cb(new Error("Invalid file type"));
        }
        cb(null, true);
    };
    const upload = multer({storage, fileFilter}).single(fieldName);

    return (req, res, next) => {
        console.log(req);
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!req.file) {
                req.file={
                    path:null
                };
                return next();
            }
            req.file.path = removePrefix(req.file.path, basePath);
            next();
        });
    };
};

module.exports = {
    uploadFile,
}
