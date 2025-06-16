// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/authMiddleware');
// const bookController = require('../controllers/bookController');

// router.post('/', auth, bookController.addBook);
// router.get('/', auth, bookController.getAllBooks);
// router.get('/:id', auth, bookController.getBookById);
// router.get('/search/title', auth, bookController.searchBooks);

// module.exports = router;

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, bookController.addBook);
router.get('/', authenticate, bookController.getAllBooks);
router.get('/search', authenticate, bookController.searchBooks);
router.get('/:id', authenticate, bookController.getBookById);

module.exports = router;
