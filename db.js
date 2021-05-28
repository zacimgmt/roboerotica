var spicedPg = require('spiced-pg');
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

exports.getImages = () => {
    return db.query(`SELECT url, title FROM images;`);
};