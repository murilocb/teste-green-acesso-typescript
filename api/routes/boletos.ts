import express, { Router, Request, Response } from 'express';
import clientesController from '../controller/boletos';
import multer from "multer";

const router: Router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get('/boletos', (req: Request, res: Response) => {
  clientesController.get(req, res);
});

router.post('/boleto', upload.single("file"), (req: Request, res: Response) => {
  clientesController.postBoleto(req, res);
});

router.post('/pdf', upload.single("file"), (req: Request, res: Response) => {
  clientesController.postPDF(req, res);
});

export default router;
