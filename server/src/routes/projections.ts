import { Router, Request, Response } from 'express';
import { projectRetirement } from '../services/projection.service';

const router = Router();

router.post('/', (req: Request, res: Response) => {
  const result = projectRetirement(req.body ?? {});
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(200).json(result.value);
});

export default router;
