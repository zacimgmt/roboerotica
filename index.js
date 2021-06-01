const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require('./s3');

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, (__dirname + "/uploads"));
    },
    filename: (req, file, callback) => {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages().then((data) => {
        res.json(data);
    });
});

app.post("/upload", uploader.single("image"), s3.upload,(req, res) => {
    if(req.file) {
        console.log('req.file in post upload: ', req.file);
        const url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
        db.addImage(url, req.body.title, req.body.description, req.body.username).catch((e) => console.log('e: ', e));
        res.json({
            title: req.body.title,
            url,
            username: req.body.username,
            description: req.body.description,
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.get('/component/:id', (req, res) => {
    console.log('req.params: ', req.params);
    db.getImage(req.params.id).then((data) => {
        console.log('data', data);
        const {username, description, title, url} = data.rows[0];
        res.json({
            url,
            username,
            title,
            description
        });
    });
});

app.listen(8080, () => console.log("my heart beating like an 808"));
