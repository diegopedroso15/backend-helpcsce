const db = require("../db");
const express = require("express");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

const createTicket = async (req, res) => {

  const {
    name,
    document,
    type,
    title,
    institution,
    category,
    priority,
    description,
    complement,
    email,
  } = req.body;

  if (!title || !description) {
    return res
      .status(500)
      .json({ message: 'Título e descrição são obrigatórios.' });
  }


  try {
    const query = `
      INSERT INTO public.tickets (name, document, type, title, institution, category, priority, description, complement, email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

    const result = await db.query(query, [
      name,
      document,
      type,
      title,
      institution,
      category,
      priority,
      description,
      complement,
      email,
    ]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getAllTickets = async (_req, res) => {
  try {
    const result = await db.query("SELECT * FROM public.tickets");
    return res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM public.tickets WHERE id = $1";
    const result = await db.query(query, [id]);
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteCommentsByTicketId(id);
    const query = "DELETE FROM public.tickets WHERE id = $1";
    await db.query(query, [id]);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const createComment = async (req, res) => {
  const { id } = req.params;
  const { name, comment } = req.body;

  try {
    const checkTicketQuery = "SELECT id FROM tickets WHERE id = $1";
    const checkTicketResult = await db.query(checkTicketQuery, [id]);

    if (checkTicketResult.rows.length === 0) {
      return res.status(404).json({ message: "Ticket não encontrado." });
    }

    const insertCommentQuery = `
      INSERT INTO comments (name, comment, data, ticket_id)
      VALUES ($1, $2, NOW(), $3)
      RETURNING *`;

    const result = await db.query(insertCommentQuery, [name, comment, id]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const getCommentsByTicketId = async (req, res) => {
  const { id } = req.params;

  try {
    const checkTicketQuery = "SELECT id FROM tickets WHERE id = $1";
    const checkTicketResult = await db.query(checkTicketQuery, [id]);

    if (checkTicketResult.rows.length === 0) {
      return res.status(404).json({ message: "Ticket não encontrado." });
    }

    const query = "SELECT * FROM comments WHERE ticket_id = $1";
    const result = await db.query(query, [id]);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

const deleteCommentsByTicketId = async (ticketId) => {
  try {
    const query = "DELETE FROM comments WHERE ticket_id = $1";
    await db.query(query, [ticketId]);
  } catch (error) {
    console.error("Erro ao excluir comentários:", error);
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  deleteTicket,
  getTicketById,
  createComment,
  getCommentsByTicketId,
};
