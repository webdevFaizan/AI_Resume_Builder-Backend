import User from "../schema/UserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import winston from "winston";
import { Resume } from "../schema/ResumeSchema.js";

// Logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ],
});

// Token generation function
const generateToken = (userId, role = 'user') => {
    //This commented one is actually a better code since it signifies that the token not only contains the id of the user but also contains the role associated to that userId. But since this code is not used in GreatStack learning, commenting it.
    // return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '2d' });
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '2d'});
};

// Validation middleware
// const validateUserInput = [
//   body('email').isEmail().withMessage('Invalid email address'),
//   body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//   body('name').notEmpty().withMessage('Name is required'),
// ];

// Controller for user registration
// POST: /api/users/register
const registerUser = async (req, res) => { 
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
        const newUser = new User({ name, email, password: hashedPassword });

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


// Controller for existing user login
// POST: /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({message: "Invalid email or password."});
        }

        // When a user logs in, you don't rehash the provided password. Instead, you use bcrypt.compare, which compares the plain-text password entered by the user with the hashed password stored in the database.
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // The following code would also work, as we are writing down the comparePassword method inside the UserSchema.js file and calling it within the file itself. But commenting it as of now.

        // if(!user.comparePassword(password) ) {
        //     return res.status(400).json({message : 'Invalid email or password'})
        // }
        
        const token = generateToken(user._id);
        user.password = undefined;
        const userResponse = user.toObject();

        return res.status(201).json({
            message: "User Logged in  Successfully.",
            token: token,
            user: userResponse,
        });

    }
    catch(error){
        res.status(400).json({message: "User not found, register to login."})
    }
}


//Controller to get the user data by email id.
//POST: /api/users/data
const getUserById = async (req, res) =>{
    try {
        const userId = req.userId;
        //Note - Here const { userId } = req.body; is not written because, this userId is not being input from the actual person, this will be created by us in the middleware to fetch the user data based on id.   req.body only contains the data that are being collected from the form that we send to the API while calling it.

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "User does not exist"});
        }

        user.password = undefined;
        return res.status(200).json({user})
    }
    catch(error){
        return res.status(500).json({message: error.message});
    }

}


//Controller to get user resumes 
//GET: /api/users/resume
const getUserResumeById = async(req, res) => {
    try{
        const userId = req.userId;
        const resumeData = await Resume.find(userId);
        if(!resumeData){
            return res.status(404).json({message: 'No such data available.'});
        }
        return res.status(200).json({resumeData});
    }
    catch(error){
            return res.status(504).json({message: error.message});
    }
}

export { registerUser, loginUser, getUserById, getUserResumeById };
