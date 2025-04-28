import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not Authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is not valid" });  
        }
        req.user = user;
        next();
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "You are not authorized" });
        }
        next();
    });
};

export const verifyDoctor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: "You are not authorized" });
        }
        next();
    });
};

export const verifyPatient = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'patient') {
            return res.status(403).json({ message: "You are not authorized" });
        }
        next();
    });
};