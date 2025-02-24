import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/temp');

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    cb(null, `${baseName}-${timestamp}${fileExtension}`);
  },
});

// Initialize multer with the configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB limit
  },
});

export default upload;