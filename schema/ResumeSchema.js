import mongoose from 'mongoose';

// Define a schema for the "experience" sub-document
const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true, default: 'Unknown Company' },
    position: { type: String, required: true, default: 'Unknown Position' },
    start_date: { type: String, required: true, default: 'Unknown Start Date' },
    end_date: { type: String, required: false, default: 'Present' }, // Defaults to "Present" for current jobs
    description: { type: String, required: true, default: 'No description provided.' },
    is_current: { type: Boolean, required: true, default: true }, // Defaults to true for current job if not specified
}, { _id: false }); // Prevent generating an ID for this sub-document

// Define a schema for the "education" sub-document
const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true, default: 'Unknown Institution' },
    degree: { type: String, required: true, default: 'Unknown Degree' },
    field: { type: String, required: false, default: 'Unknown Field' },
    graduation_date: { type: String, required: true, default: 'Unknown Graduation Date' },
    gpa: { type: String, required: false, default: 'N/A' }, // Defaults to 'N/A' for GPA if not provided
}, { _id: false }); // Prevent generating an ID for this sub-document

// Define a schema for the "project" sub-document
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true, default: 'Untitled Project' },
    type: { type: String, required: true, default: 'Web Application' },
    description: { type: String, required: true, default: 'No description provided.' },
}, { _id: false }); // Prevent generating an ID for this sub-document

// Define the main schema for the Resume
const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true, default: "User's Resume" }, // Default title for the resume
    public: { type: Boolean, required: true, default: true }, // Defaults to true (resume is public)
    professional_summary: { type: String, required: true, default: 'No summary provided.' },
    skills: [{ type: String, required: true, default: ['JavaScript', 'Node.js', 'React']}], // Defaults to some common skills
    personal_info: {
        full_name: { type: String, required: true, default: 'Anonymous' }, // Default name if not provided
        email: { type: String, required: true, default: 'example@example.com' }, // Default email
        phone: { type: String, required: true, default: '000-000-0000' }, // Default phone number
        location: { type: String, required: true, default: 'Unknown Location' },
        linkedin: { type: String, required: false, default: '' }, // No default, optional
        website: { type: String, required: false, default: '' }, // No default, optional
        profession: { type: String, required: true, default: 'Unspecified Profession' },
        image: { type: String, required: true, default: 'default-image-url.jpg' }, // Default image if no URL provided
    },
    experience: [experienceSchema], // Array of experiences using experienceSchema
    education: [educationSchema], // Array of education entries using educationSchema
    template: { type: String, required: true, default: 'minimal-image' },
    accent_color: { type: String, required: true, default: '#14B8A6' }, // Default color value
    project: [projectSchema], // Array of projects using projectSchema
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Define a schema for the list of resumes
const listOfResumesSchema = new mongoose.Schema({
    resumes: [resumeSchema], // Array of resumes using resumeSchema
});

// Create models for the Resume and ResumeList schemas
const Resume = mongoose.model('Resume', resumeSchema);
const ResumeList = mongoose.model('ResumeList', listOfResumesSchema);

export { Resume, ResumeList };



//Sample data
// const dummy_data =
// {
//         // ----------------------------------------------------- Resume 1 ------------------------------------------------------
//         personal_info: {
//             full_name: "Alex Smith",
//             email: "alex@example.com",
//             phone: "0 123456789",
//             location: "NY, USA",
//             linkedin: "https://www.linkedin.com",
//             website: "https://www.example.com",
//             profession: "Full Stack Developer",
//             image: dummy_profile
//         },
//         _id: "68d2a31a1c4dd38875bb037e",
//         userId: "68c180acdf1775dfd02c6d87",
//         title: "Alex's Resume",
//         public: true,
//         professional_summary: "Highly analytical Data Analyst with 6 years of experience transforming complex datasets into actionable insights using SQL, Python, and advanced visualization tools. ",
//         skills: ["JavaScript", "React JS", "Full Stack Development", "Git", "GitHub", "NextJS", "Express", "NodeJS", "TypeScript"],
//         experience: [
//             {
//                 company: "Example Technologies.",
//                 position: "Senior Full Stack Developer",
//                 start_date: "2023-06",
//                 end_date: "Present",
//                 description: "Architected, developed, and deployed innovative full-stack applications at Example Technologies.\ncreating robust back-end systems and intuitive front- end interfaces to deliver meaningful digital experiences ",
//                 is_current: true,
//                 _id: "68d2a31a1c4dd38875bb037f"
//             },
//             {
//                 company: "Example Technologies.",
//                 position: "Full Stack Developer",
//                 start_date: "2019-08",
//                 end_date: "2023-05",
//                 description: "Engineered and deployed scalable full-stack web applications for Example Technologies, translating complex requirements into robust front-end interfaces and efficient back-end services.",
//                 is_current: false,
//                 _id: "68d4f7abc8f0d46dc8a8b114"
//             }
//         ],
//         education: [
//             {
//                 institution: "Example Institute of Technology",
//                 degree: "B.TECH",
//                 field: "CSE",
//                 graduation_date: "2023-05",
//                 gpa: "8.7",
//                 _id: "68d2a31a1c4dd38875bb0380"
//             },
//             {
//                 institution: "Example Public School",
//                 degree: "HIGHER SECONDARY",
//                 field: "PCM",
//                 graduation_date: "2019-03",
//                 gpa: "",
//                 _id: "68d2a31a1c4dd38875bb0381"
//             },
//             {
//                 institution: "Example Academy",
//                 degree: "SECONDARY SCHOOL",
//                 field: "",
//                 graduation_date: "2017-03",
//                 gpa: "",
//                 _id: "68d2a31a1c4dd38875bb0382"
//             }
//         ],
//         template: "minimal-image",
//         accent_color: "#14B8A6",
//         project: [
//             {
//                 name: "Team Task Management System",
//                 type: "Web Application (Productivity Tool)",
//                 description: "TaskTrackr is a collaborative task management system designed for teams to create, assign, track, and manage tasks in real time. ",
//                 _id: "68d4f882c8f0d46dc8a8b139"
//             },
//             {
//                 name: "EduHub - Online Learning Platform",
//                 type: "Web Application (EdTech Platform)",
//                 description: "EduHub is an online learning platform where instructors can create courses with video lessons, quizzes, and downloadable resources.",
//                 _id: "68d4f89dc8f0d46dc8a8b147"
//             }
//         ],
//         updatedAt: "2025-09-23T13:39:38.395Z",
//         createdAt: "2025-09-23T13:39:38.395Z"
//     }