import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// ─── SIGNUP CONTROLLER ───────────────────────────────────────
export const signup = async (req: Request, res: Response) => {

    // Get data from request body (what user sent)
    const { name, email, password } = req.body;

    try {
        // STEP 1: Check if email already exists in database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Email already taken, send error
            return res.status(400).json({ message: 'Email already registered. Please login.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,  // Store hashed password
        });


        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};


// ─── LOGIN CONTROLLER ─────────────────────────────────────────
export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {
        // STEP 1: Find user by email in database
        const user = await User.findOne({ email });
        if (!user) {
            // No user found with this email
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

    
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            // Password doesn't match
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};