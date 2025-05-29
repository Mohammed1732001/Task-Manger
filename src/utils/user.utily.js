import userModel from "../DB/models/user.model.js";

export const checkRole = (role) => {
    const allowedRoles = ['Owner', 'Manager']
    if (!allowedRoles.includes(role)) {
        throw new Error("Not allow")
    }

}

export const checkUser = async (id) => {

    const user = await userModel.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user
}