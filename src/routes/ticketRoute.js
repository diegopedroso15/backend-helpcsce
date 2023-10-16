// src/routes/ticketRoute.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getAllTickets);
router.delete('/:id', ticketController.deleteTicket);
router.get('/:id', ticketController.getTicketById);

module.exports = router;
