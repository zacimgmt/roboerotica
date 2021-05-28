const express = require("express");
const app = express();
const db = require("./db.js");

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages().then((data) => {
        console.log("data: ", data);
        res.json(data);
    });
});

app.listen(8080, () => console.log("my heart beating like an 808"));
