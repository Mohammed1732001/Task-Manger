import bcrypt from "bcrypt"


export const hash = ({ plainText = "", saltRound = parseInt(process.env.SALT_ROUND || 7) } = {}) => {
    const hashValue = bcrypt.hashSync(plainText, saltRound)
    return hashValue
}
export const compare = ({ plainText = " ", hashValue = " " } = {}) => {
    if (!plainText || !hashValue) return next(new Error("in valid data"));
    const match = bcrypt.compareSync(plainText, hashValue)
    return match
}