const express = require("express");
const app = express();
const db = require("./db.js");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/uploads");
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

app.use(express.json());

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages().then((data) => {
        res.json(data);
    });
});

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    if (req.file) {
        console.log("req.file in post upload: ", req.file);
        // console.log("req.body in submit: ", req.body);
        const url = `https://roboerotica.s3.eu-central-1.amazonaws.com/${req.file.filename}`;
        db.addImage(
            url,
            req.body.title || null,
            req.body.description || null,
            req.body.username || null
        )
            .then((data) => {
                // console.log("data: ", data);

                res.json({
                    title: req.body.title,
                    url,
                    username: req.body.username,
                    description: req.body.description,
                    id: data.rows[0].id,
                    success: true,
                });
            })
            .catch((e) => {
                console.log("e: ", e);
                res.json({
                    failure: true,
                });
            });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get("/component/:id", (req, res) => {
    db.getImage(req.params.id).then((data) => {
        // console.log("data in getImage", data);
        if (!data.rowCount) {
            return res.json({ failure: true });
        }
        const {
            username,
            description,
            title,
            url,
            created_at,
            prevId,
            nextId,
        } = data.rows[0];
        res.json({
            url,
            username,
            title,
            description,
            created_at,
            prevId,
            nextId,
        });
    });
});

app.get("/more/:id", (req, res) => {
    db.getMoreImages(req.params.id).then((data) => {
        // console.log("data: ", data);
        res.json(data.rows);
    });
});

app.get("/comment/:id", (req, res) => {
    db.getComments(req.params.id).then((data) => {
        // console.log("data in get comments: ", data);
        const comments = [];
        for (var i = 0; i < data.rows.length; i++) {
            const {
                username,
                comment_text: comment,
                created_at,
            } = data.rows[i];
            comments.push({
                username,
                comment,
                created_at,
            });
        }

        res.json(comments);
    });
});

app.post("/comment", (req, res) => {
    // console.log("req.body: ", req.body);
    db.addComment(req.body.comment, req.body.username, req.body.id).then(
        (data) => {
            db.getComment(data.rows[0].id).then((data) => {
                const {
                    username,
                    comment_text: comment,
                    created_at,
                } = data.rows[0];
                res.json({
                    username,
                    comment,
                    created_at,
                });
            });
        }
    );
});

app.get("/notifications/:id", (req, res) => {
    db.getNotification(req.params.id).then((data) => {
        if (data.rows.length == 1) {
            res.json({
                notifications: data.rowCount,
                id: data.rows[0].id || null,
            });
        } else {
            res.json({
                notifications: data.rowCount,
            });
        }
    });
});

app.get("/newImage/:id", (req, res) => {
    db.getImage(req.params.id).then((data) => {
        res.json({ data: data.rows[0] });
    });
});

app.get("/delete/:id", (req, res) => {
    db.deleteImage(req.params.id).then((data) => {
        db.deleteComments(req.params.id).then((data) => {
            res.json({
                success: true,
            });
        });
    });
});

app.listen(process.env.PORT || 8080, () => console.log("my heart beating like an 808"));
