//Create Resume
import { Resume } from "../schema/ResumeSchema.js";
import fs from 'fs';
import User from "../schema/UserSchema.js"
import imagekit from "../configs/imagekit.js";
import mongoose from "mongoose";

//This method is just to create the resume, not to fill the db with data of what the user input from the front end. It will be done later.
//POST: /api/resumes/createResume
const createResume = async (req, res) => {
    try{
        const userId = req.userId;
        const { title } = req.body;
        const resume = await Resume.create({title: title, userId: userId, public: false});
        if(!resume){
            return res.status(501).json({message: "Resume not created"});
        }
        return res.status(200).json({message: "Resume created Successfully", resumeId: resume._id});
    }
    catch(error){
        return res.status(501).json({message: error.message});
    }
}


//MARK 1 - Upload Resume method.
//This code is having 2 step approaches - 1st create the document without much data, then update the same document with expected data, this is inefficient because there would be 2 times the db call and would be costly. But commiting the changes, and trying to build an efficient version.
//The following method is having multiple transaction which should succeed one after the other, and if any one of it fails mongo should be able to handle the case, this is handled using the session management and by any means when the control reaches the catch block the complete session would be terminated.
//Upload resume from pdf saved on localmachine.
//POST: /api/resumes/uploadResume
// const createResumeAndPrefillData = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try{
//         console.log("request reached here");
//         const userId = req.userId;
//         const { title, resumeText, removeBackground } = req.body;
//         const resume = await Resume.create([{title: title, userId: userId}], {session});
//         if(!resume){
//             return res.status(501).json({message: "Resume not created"});
//         }
//         const image = req.image;
//         const resumeDataCopy = resumeText;

//         let resumeId = resume[0]?._id?.toString();
//         if(image){
//             const imageBufferData = fs.createReadStream('path/to/file');
//             const response = await imagekit.files.upload({
//                 file: imageBufferData,
//                 fileName: 'resume.png',
//                 folder: 'user-resumes',
//                 transformation : {
//                     pre: 'w-300,h-300, fo-face, z-0.75' +
//                     (removeBackground ? ',e-bgremove' : '')
//                 }
//             });
//             resumeDataCopy.personal_info.image = response;
//         }
//         const updatedResume = await Resume.findOneAndUpdate({userId: userId, _id: resumeId}, resumeDataCopy, {new: true, session: session});
//         if(!resume){
//             return res.status(500).json({message: "Internal Server Error"});
//         }
//         await session.commitTransaction();
//         console.log("Resume with new data is now created, but trying to find out the bug.");
//         console.log(updatedResume);
//         return res.status(200).json({message: "Resume updated Successfully", resumeId: updatedResume._id});
//     }
//     catch(error){
//         await session.abortTransaction();
//         console.log("One of the mongoDB step could not complete hence rolling back the whole transaction.");
//         return res.status(501).json({message: error.message, error: error});
//     }finally {
//         session.endSession();
//     }
// }


//MARK 2 - Upload Resume method, with the creation and updation step added into one single command.
const createResumeAndPrefillData = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, resumeText, removeBackground, resumeId } = req.body;
        const image = req.image;

        // 1. Prepare your data copy (remove _id if it exists to avoid Mongo errors)
        // This handles your previous question about "copying the rest"
        const { _id, ...cleanResumeData } = resumeText;
        
        // Add the title and userId to the data object
        cleanResumeData.title = title;
        cleanResumeData.userId = userId;

        // 2. Handle Image Upload FIRST (Before DB call)
        if (image) {
            // Note: Ensure 'image' contains the correct path or buffer
            const imageBufferData = fs.createReadStream(image.path); 
            const uploadResponse = await imagekit.files.upload({
                file: imageBufferData,
                fileName: `resume_${userId}.png`,
                folder: 'user-resumes',
                transformation: {
                    pre: `w-300,h-300,fo-face,z-0.75${removeBackground ? ',e-bgremove' : ''}`
                }
            });
            
            // Inject the image URL into the prefill data
            cleanResumeData.personal_info = {
                ...cleanResumeData.personal_info,
                image: uploadResponse.url 
            };
        }

        // 3. THE COMBINED STEP: Upsert
        // We look for a specific resumeId. If not found, we create a new one.
        // If you want a NEW resume every time, pass a dummy ID or skip the filter.
        const query = { _id: resumeId || new mongoose.Types.ObjectId(), userId: userId };

        const updatedResume = await Resume.findOneAndUpdate(
            query, 
            { $set: cleanResumeData }, 
            { 
                new: true, 
                upsert: true, 
                setDefaultsOnInsert: true 
            }
        );

        return res.status(200).json({
            message: "Resume processed successfully",
            resumeId: updatedResume._id,
            data: updatedResume
        });

    } catch (error) {
        console.error("Error in Resume Process:", error);
        return res.status(500).json({ message: error.message });
    }
};


//delete resume
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

//get all resume by userId
//GET: /api/resumes/public
const getAllResumeByUserId = async (req, res) => {
    try{
        const userId = req.userId;
        let resumeList = await Resume.find({userId});
        if(!resumeList){
            return res.status(501).json({message: "Resumes not found."});
        }
        return res.status(200).json({resumeList: resumeList});
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
        
        if(image){
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
        const resume = await Resume.findOneAndUpdate({userId: userId, _id: resumeId}, resumeDataCopy, {new: true});
        if(!resume){
            return res.status(500).json({message: "Internal Server Error"});
        }
        return res.status(200).json({message: "Resume updated successfully"});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}


const changePublicVisibilityForResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { visibility, resumeId } = req.body;
        let response = await Resume.findOneAndUpdate({userId: userId, _id: resumeId}, {public: visibility});
        if(!response){
            return res.status(501).json({message: "Changing visibility status failed"});
        }
        return res.status(200).json({message: "Resume visibility status changed successfully."});
    } catch (error) {
            return res.status(501).json({message: "Changing visibility status failed"});
    }
}

//Added a resume master api which is can be used to update the generic data for all resume, like the public visibility of the resume was to be made private. And to run it directly from the browser, I have made the call as "GET" not "POST".
const ResumeMasterAPI = async(req, res) => {
    try {
        let response = await Resume.updateMany({}, {public: false});
        if(!response){
            return res.status(501).json({message: "Action Failed."});
        }
        return res.status(200).json({message: "Update successful."});
    } catch (error) {
        return res.status(501).json({message: "Action Failed."});
    }
}

export {createResume, deleteResume, getResumeById, getPublicResumeById, updateResume, getAllResumeByUserId, createResumeAndPrefillData, changePublicVisibilityForResume, ResumeMasterAPI };