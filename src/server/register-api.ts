import type { Express } from 'express';
import express from 'express';
import cors from 'cors';
import { connectMongo } from './db';
import { createItemsRouter } from './items.routes';

export function registerApi(app: Express): void {
  app.use(cors());
  app.use(express.json());
  app.use('/api/items', async (_req, _res, next) => {
    try {
      await connectMongo();
      next();
    } catch (err) {
      next(err);
    }
  });
  app.use('/api/items', createItemsRouter());
}
