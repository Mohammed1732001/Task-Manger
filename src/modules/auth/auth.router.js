import { Router } from "express";
import * as authController from './controller/auth.js'


const router = Router();


router.get('/', authController.authHome)
router.post('/signup', authController.signUp)
router.post('/login', authController.login)






export default router