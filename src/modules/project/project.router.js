import { Router } from "express";
import * as projectController from './controller/project.js';
import { auth } from "../../middleWare/autorization.js";



const router = Router()



router.post("/add-project", auth, projectController.createProject);
router.get("/all", auth, projectController.getAllProjects);
router.get("/one-project/:id", auth, projectController.getProjectById);
router.patch("/update-project/:id", auth, projectController.updateProject);
router.delete("/delete-project/:id", auth, projectController.deleteProject);
router.patch("/delete-team-from-project/:id", auth, projectController.deleteTeamFromProject);





export default router