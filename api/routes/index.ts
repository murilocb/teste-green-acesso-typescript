import { Router, Request, Response } from 'express';
import boletosRoutes from './boletos';

const router = Router();

router.use('/', boletosRoutes);

router.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

export default router;
