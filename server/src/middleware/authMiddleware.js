import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const userProtect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            return next(error);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            return next(error);
        }
        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

const isAdminRole = (role) => ["admin", "superAdmin"].includes(role);

// Protects routes for admin and superAdmin
export const adminProtect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            return next(error);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            return next(error);
        }
        if (!isAdminRole(user.role)) {
            const error = new Error('Not authorized, admin access required');
            error.statusCode = 403;
            return next(error);
        }
        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

// Protects routes for superAdmin only
export const superAdminProtect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            return next(error);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            return next(error);
        }
        if (user.role !== 'superAdmin') {
            const error = new Error('Not authorized, super admin access required');
            error.statusCode = 403;
            return next(error);
        }
        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

// Protects routes for blogger role (and admin/superAdmin who can also manage blogs)
export const bloggerProtect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            return next(error);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            return next(error);
        }
        if (!['bloger', 'admin', 'superAdmin'].includes(user.role)) {
            const error = new Error('Not authorized, blogger access required');
            error.statusCode = 403;
            return next(error);
        }
        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};

export const rmProtect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = new Error('Not authorized, token missing');
            error.statusCode = 401;
            return next(error);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            return next(error);
        }
        if (user.role !== 'rm') {
            const error = new Error('Not authorized, RM access required');
            error.statusCode = 403;
            return next(error);
        }
        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        next(error);
    }
};
