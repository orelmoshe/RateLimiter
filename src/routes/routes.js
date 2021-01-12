import express from 'express';
import Controller from '../controllers/controllers';

const router = express.Router({ strict: true });

const controller = new Controller();

router.get('/getPing', controller.getPing);

export default router;
