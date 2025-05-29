import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js"
import { compare, hash } from "../../../utils/hashAndCompare.js";
import jwt from "jsonwebtoken"


export const authHome = asyncHandler((req, res, next) => {
    res.send('Hello Auth Model !')
})

export const signUp = asyncHandler(async (req, res, next) => {
    const userExists = await userModel.findOne({ email: req.body.email })
    if (userExists) {
        return next(new Error("user already exists"))
    }
    if (req.body.password !== req.body.cPassword) {
        return next(new Error("passwords do not match"))
    }
    const hashedPassword = hash({ plainText: req.body.password })
    req.body.password = hashedPassword
    const user = await userModel.create(req.body)
    res.status(200).json({ message: "user created", user })
})


export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const getUser = await userModel.findOne({ email })

    if (!getUser) {
        return next(new Error("user not found"))
    }

    if (getUser.isActive === false || getUser.isDeleted === true) {
        return next(new Error("user is not active or deleted"))
    }

    const isMatch = compare({ plainText: password, hashValue: getUser.password })
    if (!isMatch) {
        return next(new Error("in valid-password "))
    }

    const token = jwt.sign({ id: getUser._id, role: getUser.role }, process.env.SIGN_TOKEN)
    res.status(200).json({ message: "login success", token })

})