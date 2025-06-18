import axios from 'axios';
import cloudinary from "../../../utils/cloudnairy.js";
import fs from "fs";
import { asyncHandler } from '../../../utils/errorHandling.js';

export const getVideoOtp = async (req, res) => {
    try {
        const response = await axios.post(
            'https://dev.vdocipher.com/api/videos/f2752ab2a0994482bcb9d3ea4bd4fc22/otp',
            { ttl: 300 },
            {
                headers: {
                    Authorization: `Apisecret ${process.env.API_KEY_VDO}`, // غيّر API_SECRET_KEY بالمفتاح السري الحقيقي
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json(response.data); // إرسال OTP إلى الواجهة
    } catch (error) {
        console.error('Error getting OTP:', error.message);
        res.status(500).json({ error: 'Failed to get OTP' });
    }
};



export const addVideo = async (req, res) => {
    try {
        // تأكد إن في ملف مرفوع
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // رفع الفيديو على Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video"
        });
        console.log(uploadResult.secure_url);
        const urlssss = uploadResult.secure_url


        // رفع الفيديو على VdoCipher باستخدام رابط Cloudinary الصحيح
        const vdoResponse = await axios.post(
            "https://api.vdocipher.com/api/videos",
            {
                source: {
                    type: "url",
                    url: urlssss
                },
                title: req.body.title || "Untitled Video"
            },
            {
                headers: {
                    Authorization: `Apisecret ${process.env.API_KEY_VDO}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(vdoResponse);


        // // إنشاء فيديو جديد في الداتا بيز
        // const newVideo = new videoModel({
        //     title: req.body.title,
        //     description: req.body.description,
        //     vdoCipherVideoId: vdoResponse.data.videoId,
        //     level: req.body.level,
        //     course: req.body.course,
        //     order: req.body.order
        // });

        // await newVideo.save();

        // // إرسال رد ناجح
        // res.status(201).json({
        //     message: "Video uploaded successfully",
        //     video: newVideo
        // });

    } catch (error) {
        console.error("Error uploading video:", error.message);
        res.status(500).json({ message: error.message || "Server Error" });
    }
};







