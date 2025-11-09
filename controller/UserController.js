import User from "../schema/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import winston from "winston";

// Logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ],
});

// Token generation function
const generateToken = (userId, role = 'user') => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '2d' });
};

// Validation middleware
const validateUserInput = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
];

// Controller for user registration
const registerUser = async (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });

        await newUser.save();

        const token = generateToken(newUser._id);
        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: "User Created Successfully.",
            token: token,
            user: userResponse,
        });

    } catch (error) {
        logger.error(`Error during registration: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};

export { registerUser, validateUserInput };
