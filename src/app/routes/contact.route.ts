import express from 'express';
import { ContactController } from '../controllers/contact.controller';

const router = express.Router();
router.post('/', ContactController.ContactUs);

export const ContactRouter = router;