DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://i1.sndcdn.com/artworks-000565144952-lob8s9-t500x500.jpg',
    'funkychicken',
    '',
    'This photo brings back so many great memories.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://d266gltxjnum49.cloudfront.net/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/c/o/e8/costume-sexy-bbbb10-557736silver_1.jpg',
    'discoduck',
    '',
    'We can''t go on together with suspicious minds.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://elements-video-cover-images-0.imgix.net/files/fe505f72-9a28-4d98-90dd-a07b3779ccec/inline_image_preview.jpg?auto=compress&crop=edges&fit=crop&fm=jpeg&h=800&w=1200&s=aabc7651a0892352e972d9862b1c8799',
    'discoduck',
    '',
    'That is the question.'
);
