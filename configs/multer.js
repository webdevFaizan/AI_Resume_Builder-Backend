import multer from 'multer';

// Set up a storage engine for multer to store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the folder where images will be stored
  },
  filename: (req, file, cb) => {
    // Use the original file name or change it (e.g., adding a timestamp)
    cb(null, Date.now() + path.extname(file.originalname)); // timestamp + file extension
  }
});

// Filter the file types (only allow images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter });

export {storage, upload};