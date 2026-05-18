import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extending Request to include userId
// By default, Express Request doesn't have userId
// We add it so we can use req.userId in controllers
export interface AuthRequest extends Request {
    userId?: string;
}

// This middleware runs BEFORE protected route handlers
// It checks: "Is this user logged in?"
export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction  // next = "go to the next step"
) => {

    // Get token from request header
    // Frontend sends: Authorization: Bearer eyJhbGci...
    // We split by space and take second part (the token)
    const token = req.headers.authorization?.split(' ')[1];

    // If no token found, user is not logged in
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please login.' });
    }

    try {
        // Verify the token using our secret key
        // If token is fake or expired, this will throw an error
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // Add userId to the request so controllers can use it
        req.userId = decoded.id;

        // Token is valid! Move to the next function (the controller)
        next();

    } catch (error) {
        // Token is invalid or expired
        res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
};