import User from "../schema/UserSchema.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const token  = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '2d'});
    return token;
}


// controller for user registration
// POST : /api/users/register
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: "Not all required fileds are filled up."});
        }

        const user = User.findOne({email});
        if(user){
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = User.create({email, password});

        const token = generateToken(newUser._id);
        newUser.password = undefined;

        res.status(201).json({message : "User Created Successfully.", token: token, user: newUser});
    } catch(error){
        res.status(400).json({message: error.message});
    }
}

export { registerUser };