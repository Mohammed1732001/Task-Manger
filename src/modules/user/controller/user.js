import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js"
import cloudinary from "../../../utils/cloudnairy.js";
import fs from "fs";
import { compare, hash } from "../../../utils/hashAndCompare.js";
import { checkRole, checkUser } from "../../../utils/user.utily.js";


export const userHome = asyncHandler(async (req, res, next) => {
    res.send('Hello User Model !')
})

export const allUsers = asyncHandler(async (req, res, next) => {

    if (!req.user.id) {
        return next(new Error("Not Rigister Account"))
    }
    const user = await userModel.findById(req.user.id)
    if (user.role !== 'Owner' && user.role !== 'Manager') {
        return next(new Error("Not Owner or Manager"))
    }
    const allUsers = await userModel.find().populate("team")
    res.status(200).json({ message: "all users", allUsers })

})


export const addImage = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.user.id !== id) {
        return next(new Error("Not owner this user"))
    }

    if (!req.file) {
        return res.status(400).json({ message: "File upload required" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user/piciat",
    });
    fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete local image:", err);
    });
    const user = await userModel.findByIdAndUpdate(id, { image: result.secure_url, imagePuplicId: result.public_id }, { new: true })
    res.status(200).json({ message: "image added", user })
})


export const oneUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const allowedRoles = ['Owner', 'Manager', 'TeamLeader'];
    if (req.user.id !== id && !allowedRoles.includes(req.user.role)) {
        return next(new Error("Not allow"))
    }
    const user = await userModel.findById(id)
        .populate("team").populate({ path: "tasks", populate: { path: "project", model: "Project" } });
    if (!user) {
        return next(new Error("user not found"))
    }
    res.status(200).json({ message: "one user", user })
})

export const updateUserDetails = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user = await userModel.findById(id)
    if (!user) {
        return next(new Error("user not found"))
    }
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true })
    res.status(200).json({ message: "user updated", updatedUser })

})
export const updateUserDetailsPAssword = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { oldPassword, newPassword, cNewPassword } = req.body
    if (req.user.id !== id) {
        return next(new Error("Not owner this user"))
    }
    const user = await userModel.findById(id)
    if (!user) {
        return next(new Error("user not found"))
    }
    const comparePassword = await compare({ plainText: oldPassword, hashValue: user.password })
    if (!comparePassword) {
        return next(new Error("in valid password"))
    }
    if (newPassword !== cNewPassword) {
        return next(new Error("passwords do not match"))
    }
    const hashedPassword = hash({ plainText: newPassword })
    const newUser = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
    res.status(200).json({ message: "user updated", newUser })

})

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    checkRole(req.user.role)
    await checkUser(id)
    const hashedPassword = hash({ plainText: "123456" })
    const newUser = await userModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
    res.status(200).json({ message: "user updated", newUser })

})

export const updateUserActive = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    checkRole(req.user.role)
    const user = await userModel.findById(id);
    if (!user) {
        return next(new Error("user not found"))
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: "User updated", user });
})

export const saveDelete = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    await checkUser(id)
    checkRole(req.user.role)
    const user = await userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    res.status(200).json({ message: "user deleted", user })
})

export const restoreUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    await checkUser(id)
    checkRole(req.user.role)
    const user = await userModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    res.status(200).json({ message: "user deleted", user })
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await checkUser(id)
    checkRole(req.user.role)
    const deletedUser = await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User permanently deleted" });

})
