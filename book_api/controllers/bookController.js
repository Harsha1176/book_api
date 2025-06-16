const db = require('../models/db');

exports.addBook = (req, res) => {
  const { title, author, genre } = req.body;
  const userId = req.user.userId;
  const sql = 'INSERT INTO books (title, author, genre, created_by) VALUES (?, ?, ?, ?)';
  db.run(sql, [title, author, genre, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to add book' });
    res.status(201).json({ bookId: this.lastID });
  });
};

exports.getAllBooks = (req, res) => {
  const { author, genre, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  let sql = 'SELECT * FROM books';
  let filters = [];
  let params = [];

  if (author) { filters.push('author LIKE ?'); params.push(`%${author}%`); }
  if (genre) { filters.push('genre LIKE ?'); params.push(`%${genre}%`); }

  if (filters.length) sql += ' WHERE ' + filters.join(' AND ');
  sql += ' LIMIT ? OFFSET ?';
  db.all(sql, [...params, +limit, +offset], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch books' });
    res.json(rows);
  });
};

exports.getBookById = (req, res) => {
  const bookId = req.params.id;
  db.get('SELECT * FROM books WHERE id = ?', [bookId], (err, book) => {
    if (err || !book) return res.status(404).json({ error: 'Book not found' });
    db.all('SELECT * FROM reviews WHERE book_id = ?', [bookId], (err, reviews) => {
      if (err) return res.status(500).json({ error: 'Failed to load reviews' });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
      res.json({ ...book, avgRating, reviews });
    });
  });
};

exports.searchBooks = (req, res) => {
  const { q } = req.query;
  const sql = 'SELECT * FROM books WHERE title LIKE ? OR author LIKE ?';
  db.all(sql, [`%${q}%`, `%${q}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Search failed' });
    res.json(rows);
  });
};


