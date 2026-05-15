import fs from "fs";
import path from "path";
import TeamMember from "../models/teamMemberModel.js";

const parseBool = (value) =>
  value === true || value === "true" || value === "1" || value === 1;

const nextOrderValue = async () => {
  const last = await TeamMember.findOne().sort({ order: -1 }).select("order").lean();
  return (last?.order ?? -1) + 1;
};

const unlinkIfTeamImage = (imagePath) => {
  if (!imagePath?.startsWith("/uploads/team-images/")) return;
  const abs = path.join(process.cwd(), imagePath.replace(/^\//, ""));
  fs.unlink(abs, () => {});
};

export const getAdminTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({
      message: "Team members fetched successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const { fullName, designation, bio = "", order, isActive } = req.body;
    if (!fullName?.trim() || !designation?.trim()) {
      const error = new Error("Name and designation are required");
      error.statusCode = 400;
      return next(error);
    }

    let image = "";
    if (req.file) {
      image = `/uploads/team-images/${req.file.filename}`;
    }

    const orderNum =
      order !== undefined && order !== "" && Number.isFinite(Number(order))
        ? Number(order)
        : await nextOrderValue();

    const member = await TeamMember.create({
      fullName: fullName.trim(),
      designation: designation.trim(),
      bio: String(bio ?? "").trim(),
      image,
      order: orderNum,
      isActive: parseBool(isActive),
    });

    res.status(201).json({
      message: "Team member created successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, designation, bio = "", order, isActive } = req.body;

    const member = await TeamMember.findById(id);
    if (!member) {
      const error = new Error("Team member not found");
      error.statusCode = 404;
      return next(error);
    }

    if (fullName !== undefined) member.fullName = String(fullName).trim();
    if (designation !== undefined) member.designation = String(designation).trim();
    if (!member.fullName || !member.designation) {
      const error = new Error("Name and designation are required");
      error.statusCode = 400;
      return next(error);
    }
    if (bio !== undefined) member.bio = String(bio).trim();

    if (order !== undefined && order !== "" && Number.isFinite(Number(order))) {
      member.order = Number(order);
    }

    if (isActive !== undefined) {
      member.isActive = parseBool(isActive);
    }

    if (req.file) {
      if (member.image) {
        unlinkIfTeamImage(member.image);
      }
      member.image = `/uploads/team-images/${req.file.filename}`;
    }

    await member.save();

    res.status(200).json({
      message: "Team member updated successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) {
      const error = new Error("Team member not found");
      error.statusCode = 404;
      return next(error);
    }
    if (member.image) {
      unlinkIfTeamImage(member.image);
    }
    res.status(200).json({
      message: "Team member deleted successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicTeamMembers = async (req, res, next) => {
  try {
    const members = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .select("fullName designation bio image order")
      .lean();

    res.status(200).json({
      message: "Team members fetched successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};
