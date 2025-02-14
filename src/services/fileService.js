const multer = require('multer');
const path = require('path');
const fs = require('fs');

function removePrefix(originalPath, prefix) {
    return path.normalize(originalPath.replace(prefix, ''));
}

const basePath = "/tmp";
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
        if (allowedTypes.length && !allowedTypes.includes(file.mimetype.split('/')?.[0])) {
            return cb(new Error("Invalid file type"));
        }
        cb(null, true);
    };
    const upload = multer({storage, fileFilter}).single(fieldName);

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                return res.status(500).send();
            }
            if (!req.file) {
                req.file = {
                    path: null
                };
                return next();
            }

            let newPath = removePrefix(req.file.path, basePath).replace('\\public\\storage', '');
            newPath = newPath.replace('\\tmp', 'tmp');
            console.log(newPath);
            req.file.path = newPath;
            next();
        });
    };
};

module.exports = {
    uploadFile,
}
