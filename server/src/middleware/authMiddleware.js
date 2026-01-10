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
        if (user.role !== 'admin') {
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
