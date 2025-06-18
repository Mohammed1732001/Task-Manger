import multer from 'multer';
import path from 'path';

// حدد مجلد حفظ الملفات مؤقتًا
const uploadFolder = path.resolve('uploads');

// إعداد multer
export const upload = multer({
  dest: uploadFolder,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500 ميجابايت كحد أقصى (تعديل حسب حاجتك)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'video/x-matroska') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only mp4 and mkv are allowed!'));
    }
  },

});
