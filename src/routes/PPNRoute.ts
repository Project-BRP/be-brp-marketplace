import { Router } from 'express';
import { PPNController } from '../controllers/PPNController';
import { authMiddleware } from '../middlewares';

export const ppnRoute: Router = Router();

ppnRoute.get('/', PPNController.getCurrentPPN);
ppnRoute.patch('/', PPNController.updatePPN);
