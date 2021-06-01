var spicedPg = require('spiced-pg');
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

exports.getImages = () => {
    return db.query(`SELECT url, title, id FROM images ORDER BY id DESC;`);
};

exports.getImage = (id) => {
    return db.query(`SELECT url, title, description, username FROM images WHERE id = ($1)`, [id]);
};

exports.addImage = (url, title, description, username) => {
    const params = [url, title, description, username];
    return db.query(`INSERT INTO images (url, title, description, username) VALUES($1, $2, $3, $4) `, params);
};