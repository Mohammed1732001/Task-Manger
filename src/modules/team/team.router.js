import { Router } from "express";
import * as teamController from './controller/team.js'
import { auth } from "../../middleWare/autorization.js";

const router = Router()


router.get('/', teamController.teamHome)
router.get('/all',auth ,teamController.allTeams)
router.get('/one-team/:id',auth ,teamController.oneTeam)
router.get('/my-team',auth ,teamController.myTeam)
router.post('/add-team',auth ,teamController.addTeam)
router.put('/update-team/:id',auth ,teamController.updateTeam)
router.delete('/delete-team/:id',auth ,teamController.deleteTeam)
router.patch('/add-member/:id',auth ,teamController.addTeamMember)
router.patch('/delete-memeber/:id',auth ,teamController.removeTeamMember)














export default router