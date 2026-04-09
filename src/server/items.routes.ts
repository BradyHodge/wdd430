import { Router } from 'express';
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Item = mongoose.models['Item'] ?? mongoose.model('Item', itemSchema);

export function createItemsRouter(): Router {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const items = await Item.find().sort({ createdAt: -1 }).lean();
      res.json(items);
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const item = await Item.findById(id).lean();
      if (!item) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const { title, description, done } = req.body ?? {};
      if (typeof title !== 'string' || !title.trim()) {
        res.status(400).json({ message: 'title is required' });
        return;
      }
      const item = await Item.create({
        title: title.trim(),
        description: typeof description === 'string' ? description : '',
        done: Boolean(done),
      });
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const { title, description, done } = req.body ?? {};
      const update: Record<string, unknown> = {};
      if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim()) {
          res.status(400).json({ message: 'title cannot be empty' });
          return;
        }
        update['title'] = title.trim();
      }
      if (description !== undefined) {
        update['description'] = String(description);
      }
      if (done !== undefined) {
        update['done'] = Boolean(done);
      }
      const item = await Item.findByIdAndUpdate(id, update, { new: true }).lean();
      if (!item) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: 'Invalid id' });
        return;
      }
      const deleted = await Item.findByIdAndDelete(id).lean();
      if (!deleted) {
        res.status(404).json({ message: 'Not found' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
