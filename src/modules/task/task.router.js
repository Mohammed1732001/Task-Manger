import { Router } from "express";
import * as taskController from './controller/task.js'
import { auth } from "../../middleWare/autorization.js";
import { fileUpload } from "../../utils/cloudnairyMulter.js";

const router = Router()



router.get("/" ,taskController.taskHome) 
router.get("/all" ,auth,taskController.getAllTasks)
router.get("/one-task/:id" ,auth,taskController.getOneTask)
router.post("/add-task" ,auth,taskController.createdTask)
router.put("/update-task/:id" ,auth,taskController.updateTask)
router.patch("/update-task-status/:id" ,auth,taskController.updateTaskStatus)  
router.delete("/delete-task/:id" ,auth,taskController.deleteTask)
router.put("/add-comment/:id" ,auth,taskController.addCommentforTask)
router.put("/delete-comment/:id" ,auth,taskController.deleteCommentFromTask)
router.put("/assign-task/:id" ,auth,taskController.assignTaskToUser)
router.patch("/add-attachment/:id" ,auth,fileUpload().array("attachments"),taskController.addAttachment)



export default router