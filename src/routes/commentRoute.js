const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/comments/:id', ticketController.createComment);
router.get('/comments/:id', ticketController.getCommentsByTicketId);

module.exports = router;