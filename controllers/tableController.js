import { Table } from '../models/index.js';

export const getTables = async (req, res) => {
  const tables = await Table.findAll();
  res.json(tables);
};

export const createTable = async (req, res) => {
  const { name, data } = req.body;
  const table = await Table.create({ name, data });
  res.status(201).json(table);
};