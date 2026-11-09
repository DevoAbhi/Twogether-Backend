import multer from 'multer';

export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB
}).single('photo');
