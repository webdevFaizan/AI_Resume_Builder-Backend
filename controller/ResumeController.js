

//Create Resume
import { Resume } from "../schema/ResumeSchema.js";
import fs from 'fs';
import User from "../schema/UserSchema.js"
import imagekit from "../configs/imagekit.js";

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

//get user resume by Id
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

//get resume by id public
//GET: /api/resumes/public
const getPublicResumeById = async (req, res) => {
    try{
        const { resumeId } = req.params;
        let resume = await Resume.findOne({public: true, _id: resumeId});
        if(!resume){
            return res.status(501).json({message: "Resume not found."});
        }

        return res.status(200).json({resume});
    }
    catch(error){
        return res.status(501).json({message: error.message});
    }
}

//update resume data
//PUT: /api/resumes/update
//This is a sample update function that updates any data that is provided to the function in the body. The structure of data being recieved could be changed but the logic of updating the data would not change. And the structure of the data being recieved is saved inside the ResumeSchema.js file, the data being collected from the front end may be in a different format, but in the end the data to be saved in the backend would have to be saved in the format that is defined in the resumeSchema.js file.
// const updateResume = async (req, res) => {
//     try {
//         const { resumeId } = req.params;
//         const { name, experience, skills, education, contactInfo } = req.body;

//         // Validate input (you can expand this validation as needed)
//         if (!name && !experience && !skills && !education && !contactInfo && req.body.public === undefined) {
//             return res.status(400).json({ message: "No fields provided for update." });
//         }

//         // Find the resume by ID
//         const resume = await Resume.findById(resumeId);

//         // Check if the resume exists
//         if (!resume) {
//             return res.status(404).json({ message: "Resume not found." });
//         }

//         // Update fields in the resume (only the fields that are provided)
//         if (name) resume.name = name;
//         if (experience) resume.experience = experience;
//         if (skills) resume.skills = skills;
//         if (education) resume.education = education;
//         if (contactInfo) resume.contactInfo = contactInfo;
//         if (req.body.public !== undefined) resume.public = req.body.public;

//         // Save the updated resume
//         await resume.save();

//         return res.status(200).json({ message: "Resume updated successfully.", resume });

//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };


//update resume data
//PUT: /api/resumes/update
const updateResume =  async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.image;
        const resumeDataCopy = resumeData;
        
        if(image ){
            const imageBufferData = fs.createReadStream('path/to/file');
            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation : {
                    pre: 'w-300,h-300, fo-face, z-0.75' +
                    (removeBackground ? ',e-bgremove' : '')
                }
            });
            resumeDataCopy.personal_info.image = response;
        }
        const resume = await Resume.findByIdAndUpdate({userId: userId, _id: resumeId}, resumeDataCopy, {new: true});
        if(!resume){
            return res.status(500).json({message: "Internal Server Error"});
        }
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
    
}

export {createResume, deleteResume, getResumeById, getPublicResumeById, updateResume };