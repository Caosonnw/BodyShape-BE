import { diskStorage } from 'multer';
import { join } from 'path';

export const uploadOptions = {
  storage: diskStorage({
    destination: join(process.cwd(), 'public/images'),
    filename: (req, file, callback) => {
      const mSecond = new Date().getTime();
      const uniqueSuffix = mSecond + '_' + Math.round(Math.random() * 1e9);
      const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
      callback(null, `${uniqueSuffix}_${sanitizedFilename}`);
    },
  }),
};

export const uploadVideoOptions = {
  storage: diskStorage({
    destination: join(process.cwd(), 'public/videos'),
    filename: (req, file, callback) => {
      const mSecond = new Date().getTime();
      const uniqueSuffix = mSecond + '_' + Math.round(Math.random() * 1e9);
      const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
      callback(null, `${uniqueSuffix}_${sanitizedFilename}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error('Only MP4, MPEG, and QuickTime video formats are allowed.'),
        false,
      );
    }
  },
};
