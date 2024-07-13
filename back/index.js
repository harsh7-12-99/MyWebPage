// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const multer = require("multer");

// this is the multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + "-" + file.originalname;
    cb(null, filename);
    // Save the filename in the request object for later use
    req.savedFilename = filename;
  },
});
const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());
// serve the fronend
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

// to upload the file
app.post("/upload_files", upload.array("file"), uploadFiles);
function uploadFiles(req, res) {
  // get the file info such as the full name and the
  //name of the file by which multer will save it in the uploads folder
  const fileInfo = {
    originalName: req.files[0].originalname,
    savedName: req.savedFilename,
  };
  // store that info the json so we can use it when we need to
  // download the file using the filename
  fs.writeFileSync("fileInfo.json", JSON.stringify(fileInfo));
  res.json({ message: "Successfully uploaded files" });
}

app.post("/download", (req, res) => {
  const fileInfo = JSON.parse(fs.readFileSync("fileInfo.json"));
  const savedName = fileInfo.savedName;
  const filePath = path.join(__dirname, "uploads", savedName);

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
    } else {
      console.log("File downloaded successfully");
    }
  });
});
app.listen(5000, () => {
  console.log(`Server started...`);
});
