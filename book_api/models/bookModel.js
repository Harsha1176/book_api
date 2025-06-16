const db = require('./db');

exports.insertBook = (title, author, genre, createdBy, callback) => {
  const sql = 'INSERT INTO books (title, author, genre, created_by) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, author, genre, createdBy], function(err) {
    callback(err, this?.lastID);
  });
};

exports.getBooks = (filters, params, limit, offset, callback) => {
  let sql = 'SELECT * FROM books';
  if (filters.length) sql += ' WHERE ' + filters.join(' AND ');
  sql += ' LIMIT ? OFFSET ?';
  db.all(sql, [...params, limit, offset], callback);
};

exports.getBookById = (bookId, callback) => {
  db.get('SELECT * FROM books WHERE id = ?', [bookId], callback);
};

exports.searchBooks = (query, callback) => {
  const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
  db.all(sql, [`%${query}%`, `%${query}%`], callback);
};

exports.getReviewsByBookId = (bookId, callback) => {
  db.all('SELECT * FROM reviews WHERE book_id = ?', [bookId], callback);
};