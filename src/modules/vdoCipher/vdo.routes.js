import { Router } from "express";
import * as videoController from './controller/video.js'
import { fileUpload } from "../../utils/cloudnairyMulter.js";

const router = Router()

router.get("/", (req, res) => {
    res.json({ message: "hello vdoCipher" })
})


router.get('/get-otp', videoController.getVideoOtp)
router.patch("/add-video" ,fileUpload().single("file"),videoController.addVideo)


export default router