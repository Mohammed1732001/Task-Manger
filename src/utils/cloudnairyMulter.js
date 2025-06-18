import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

export const fileValidation = {
  image: ["image/png", "image/jpeg", "image/gif"],
  document: [
    "application/pdf",                                 // PDF
    "application/msword",                              // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel",                        // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       // .xlsx
    "application/vnd.ms-powerpoint",                   // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/octet-stream",  // ⬅️ مهم جدًا لبعض ملفات الأوفيس
    "application/vnd.ms-office", // ⬅️ بعض إصدارات الأوفيس القديمة
    "text/csv"
  ],
  video: [
    "video/mp4",
    "video/mkv",
    "video/avi",
    "video/mov",
    "video/webm",
    "video/ogg"
  ]
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ...fileValidation.image,
    ...fileValidation.document,
    ...fileValidation.video
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
        console.log("❌ Rejected file with type:", file.mimetype);
    cb(new Error("Invalid file type"), false);
  }
};
export function fileUpload() {
  return multer({ storage, fileFilter });
}
