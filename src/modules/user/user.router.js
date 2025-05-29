import { Router } from "express";
import * as userController from './controller/user.js'
import { auth } from "../../middleWare/autorization.js";
import { fileUpload, fileValidation } from "../../utils/cloudnairyMulter.js"
const router = Router();


router.get('/', userController.userHome)
router.get('/all', auth, userController.allUsers)
router.patch('/add-image/:id', auth, fileUpload(fileValidation.image).single("image"), userController.addImage)
router.get('/one-user/:id', auth, userController.oneUser)
router.put('/update-user-details-password/:id', auth, userController.updateUserDetailsPAssword)
router.put('/reset-password/:id', auth, userController.resetPassword)
router.patch('/status-user/:id', auth, userController.updateUserActive)
router.put('/save-delete/:id', auth, userController.saveDelete)
router.put('/restore-user/:id', auth, userController.restoreUser)
router.delete('/delete-user/:id',auth ,userController.deleteUser)




export default router