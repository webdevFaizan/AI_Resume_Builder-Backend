

//Create Resume

import { Resume } from "../schema/ResumeSchema";
import User from "../schema/UserSchema"

//This method is just to create the resume, not to fill the db with data of what the user input from the front end. It will be done later.
//POST: /api/resumes/createResume
const createResume = async (req, res) => {
    try{
        const userId = req.userId;
        const { title } = req.body;
        const resume = await Resume.create({title: title, userId: userId});
        if(!resume){
            return res.status(501).json({message: "Resume not created"});
        }
        return res.status(200).json({message: "Resume created Successfully"});
    }
    catch(error){
        return res.status(501).json({message: error.message});
    }
}


//POST: /api/resumes/delete
const deleteResume = async (req, res) => {
    try{
        const userId = req.userId;
        const { resumeId } = req.params;
        //_id: resumeId has to be written in this manner because on the Schema the id section for this particular resume is not saved as resumeId. Instead we will compare the id in the url params to the id of the resume that is in the backend.
        let resume = await Resume.findOneAndDelete({userId, _id: resumeId});
        if(!resume){
            return res.status(501).json({message: "Internal server error"});
        }
        return res.status(200).json({message: "Resume deleted Successfully"});
    }
    catch(error){
        return res.status(501).json({message: error.message});
    }
}

//GET user resume by Id
//POST: /api/resumes/get
const getResumeById = async (req, res) => {
    try{
        const userId = req.userId;
        const { resumeId } = req.params;
        let resume = await Resume.findOne({userId, _id: resumeId});
        if(!resume){
            return res.status(501).json({message: "Resume not found."});
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;
        return res.status(200).json({resume});
    }
    catch(error){
        return res.status(501).json({message: error.message});
    }
}