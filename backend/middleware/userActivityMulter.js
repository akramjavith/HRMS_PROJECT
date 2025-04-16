//to upload file in our database and store file in local folder
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require('fs');
const uploadsDir = 'useractivity/';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}_${path.extname(file.originalname)}`);
    },
});

//to check the filetype
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
        console.log("screenshot added successfully");
    } else {
        console.log("Only 'jpeg','jpg','png' files are allowed");
        cb(null, false);
    }
};

const userActivityMulter = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = userActivityMulter;