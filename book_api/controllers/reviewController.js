const db = require('../models/db');

exports.addReview = (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.userId;
  const bookId = req.params.bookId;
  const sql = 'INSERT INTO reviews (user_id, book_id, rating, comment) VALUES (?, ?, ?, ?)';
  db.run(sql, [userId, bookId, rating, comment], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to add review' });
    res.status(201).json({ reviewId: this.lastID });
  });
};

exports.updateReview = (req, res) => {
  const { rating, comment } = req.body;
  const userId = req.user.userId;
  const reviewId = req.params.id;
  const sql = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?';
  db.run(sql, [rating, comment, reviewId, userId], function(err) {
    if (err || this.changes === 0) return res.status(403).json({ error: 'Update failed' });
    res.json({ message: 'Review updated' });
  });
};

exports.deleteReview = (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.id;
  const sql = 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
  db.run(sql, [reviewId, userId], function(err) {
    if (err || this.changes === 0) return res.status(403).json({ error: 'Delete failed' });
    res.json({ message: 'Review deleted' });
  });
};