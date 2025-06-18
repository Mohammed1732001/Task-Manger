import projectModel from "../../../DB/models/project.model.js";
import teamModel from "../../../DB/models/team.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js"
import { checkRole } from "../../../utils/user.utily.js"


export const createProject = asyncHandler(async (req, res, next) => {
  checkRole(req.user.role);

  const { name, description, teams ,createdBy } = req.body;

  const uniqueTeams = [...new Set(teams.map(team => team.toString()))];

  if (uniqueTeams.length !== teams.length) {
    return next(new Error("Duplicate teams are not allowed in the project."));
  }

  const project = await projectModel.create({
    name,
    description,
    teams: uniqueTeams,
    createdBy
  });

  const updatedTeams = await Promise.all(
    uniqueTeams.map(async teamId => {
      const team = await teamModel.findById(teamId);
      team.projects.push(project._id);
      await team.save();
      return team;
    })
  );

  res.status(201).json({ message: "Project created", project });
});
export const getAllProjects = asyncHandler(async (req, res, next) => {
  checkRole(req.user.role)
  const projects = await projectModel.find().populate("teams").populate("tasks").populate("createdBy");
  res.status(200).json({ message: "All projects", projects });
});
export const getProjectById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const project = await projectModel.findById(id).populate("teams").populate({
    path: "tasks",
    populate: { path: "assignedToUser assignedToTeam" }
  }).populate("createdBy");

  if (!project) return next(new Error("Project not found"));

  res.status(200).json({ message: "Project details", project });
});
export const updateProject = asyncHandler(async (req, res, next) => {
  checkRole(req.user.role);

  const { id } = req.params;
  const { name, description, teams } = req.body;

  const project = await projectModel.findById(id);
  if (!project) return next(new Error("Project not found"));


  if (name) project.name = name;
  if (description) project.description = description;

  if (teams && Array.isArray(teams)) {
    for (const team of teams) {
      const alreadyExists = project.teams.some(t => t.toString() === team);
      if (!alreadyExists) {
        project.teams.push(team);
      }
    }
  }

  await project.save();

  res.status(200).json({ message: "Project updated", project });
});
export const deleteProject = asyncHandler(async (req, res, next) => {
  checkRole(req.user.role)
  const { id } = req.params;

  const project = await projectModel.findByIdAndDelete(id);
  if (!project) return next(new Error("Project not found"));

  res.status(200).json({ message: "Project deleted", project });
});

export const deleteTeamFromProject = asyncHandler(async (req, res, next) => {
  checkRole(req.user.role)
  const { id } = req.params;
  const { teamId } = req.body
  const project = await projectModel.findById(id);

  const team = await teamModel.findById(teamId);
  if (!team) {
    return next(new Error("Team not found"));
  }
  if (!project) return next(new Error("Project not found"));
  updateProject.teams = project.teams.filter(t => t.toString() !== teamId);

  const updatedTeam = await projectModel.findByIdAndUpdate(id, { teams: updateProject.teams }, { new: true });
  const updatedProject = await teamModel.findByIdAndUpdate(teamId, { projects: team.projects.filter(p => p.toString() !== id) }, { new: true });
  const all = await Promise.all([updatedTeam, updatedProject])
  res.status(200).json({ message: "Team deleted from project", all });
})