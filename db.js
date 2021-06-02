var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/images"
);

exports.getImages = () => {
    return db.query(
        `SELECT url, title, id FROM images ORDER BY id DESC  LIMIT 6;`
    );
};

exports.getImage = (id) => {
    return db.query(
        `SELECT url, title, description, username, (SELECT id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 1 ) AS "prevId",(SELECT id FROM images WHERE id > $1 LIMIT 1) AS "nextId", created_at  FROM images WHERE id = ($1)`,
        [id]
    );
};

exports.addImage = (url, title, description, username) => {
    const params = [url, title, description, username];
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES($1, $2, $3, $4) RETURNING id`,
        params
    );
};

exports.getMoreImages = (id) => {
    return db.query(
        `SELECT url, title, id, 
    (SELECT id FROM images ORDER BY id ASC LIMIT 1) AS "lowestId"
     FROM images
     WHERE id < $1
     ORDER BY id DESC
     LIMIT 3;`,
        [id]
    );
};

exports.addComment = (comment, username, imageId) => {
    return db.query(
        `
    INSERT INTO comments (comment_text, username, image_id) VALUES ($1, $2, $3) RETURNING ID;`,
        [comment, username, imageId]
    );
};


exports.getComment = (id) => {
    return db.query(
        `SELECT comment_text, username, image_id, created_at FROM comments WHERE id = $1;`, [id]
    );
};

exports.getComments = (imageId) => {
    return db.query(
        `SELECT comment_text, username, image_id, created_at FROM comments WHERE image_id = $1 ORDER BY id DESC;`, [imageId]
    );
};


exports.getNotification = (id) => { 
    return db.query(`SELECT id FROM images WHERE id > $1`, [id]);
}