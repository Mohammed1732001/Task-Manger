import teamModel from "../../../DB/models/team.model.js"
import userModel from "../../../DB/models/user.model.js"
import { asyncHandler } from "../../../utils/errorHandling.js"
import { checkRole } from "../../../utils/user.utily.js"



export const teamHome = asyncHandler(async (req, res, next) => {

    res.json({ message: "Hello Team Model !" })
})

export const allTeams = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const allTeams = await teamModel.find().populate("teamLeader").populate("members")
    res.status(200).json({ message: "all teams", allTeams })
})

export const oneTeam = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const { id } = req.params
    const team = await teamModel.findById(id).populate('teamLeader', 'name').populate("members", "name email").populate("projects")
    if (!team) {
        return next(new Error("team not found"))
    }
    res.status(200).json({ message: "team", team })
})

export const addTeam = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const { name, teamLeader } = req.body
    const user = await userModel.findById(teamLeader)
    if (!user) {
     return next(new Error("team leader not found"))   
    }

    const team = await teamModel.create({ name, teamLeader })
    const updatedUser = await userModel.findByIdAndUpdate(teamLeader, { team: team._id }, { new: true });
    res.status(200).json({ message: "team created", team })

})

export const updateTeam = asyncHandler(async (req, res, next) => {
    checkRole(req.user.role)
    const { id } = req.params
    const { name, teamLeader } = req.body
    const team = await teamModel.findById(id)
    if (!team) {
        return next(new Error("team not found"))
    }
    team.name = name;
    team.teamLeader = teamLeader;
    await team.save();

    res.status(200).json({ message: "team updated", team })

})

export const deleteTeam = asyncHandler(async (req, res, next) => {

    checkRole(req.user.role)
    const { id } = req.params
    const team = await teamModel.findById(id)
    const members = team.members;
    for (const member of members) {
        await userModel.findByIdAndUpdate(member, { team: null }, { new: true });
    }
    await teamModel.findByIdAndDelete(id)
    res.status(200).json({ message: "team deleted" })

})

export const addTeamMember = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "TeamLeader" && req.user.role !== "Owner") {
        return next(new Error("talk to team leader to allow"))
    }
    const { id } = req.params;
    let { members } = req.body;


    if (!Array.isArray(members)) {
        if (!members) {
            return next(new Error("No member(s) provided"));
        }
        members = [members];
    }

    const team = await teamModel.findById(id);
    if (!team) {
        return next(new Error("Team not found"));
    }

    const uniqueMembers = Array.from(new Set([...team.members.map(id => id.toString()), ...members]));

    team.members = uniqueMembers;
    await team.save();


    const updatedUser = await userModel.findByIdAndUpdate(members, { team: id }, { new: true });
    console.log(updatedUser);

    const updatedTeam = await teamModel.findById(id)
        .populate("members")
        .populate("teamLeader");

    res.status(200).json({ message: "Members added successfully", team: updatedTeam });


})
export const removeTeamMember = asyncHandler(async (req, res, next) => {
    if (req.user.role !== "TeamLeader" && req.user.role !== "Owner") {
        return next(new Error("Only Team Leader or Owner can remove members"));
    }

    const { id } = req.params;
    const { members } = req.body;

    if (!members) {
        return next(new Error("Members to remove must be provided"));
    }

    const membersToRemove = Array.isArray(members) ? members : [members];

    const team = await teamModel.findById(id);
    if (!team) {
        return next(new Error("Team not found"));
    }

    team.members = team.members.filter(
        (memberId) => !membersToRemove.includes(memberId.toString())
    );

    const updatedUser = await userModel.findByIdAndUpdate(members, { team: null }, { new: true });
    console.log(updatedUser);


    await team.save();

    res.status(200).json({ message: "Members removed", team });
});

export const myTeam = asyncHandler(async (req, res, next) => {
    if (req.user.role === "TeamLeader") {
        const team = await teamModel.findOne({ teamLeader: req.user.id })
        return res.status(200).json({ message: "your team", team })
    } else {
        return next(new Error("you are not team leader"))
    }

})