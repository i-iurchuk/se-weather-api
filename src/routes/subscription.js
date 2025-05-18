import { Router } from 'express';
import { subscribe, confirm, unsubscribe } from '../controllers/subscriptionController.js';

const router = Router();

router.post('/subscribe', subscribe);
router.get('/confirm/:token', confirm);
router.get('/unsubscribe/:token', unsubscribe);

export default router;
