const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.port || 3000;

// By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const multer = require("multer");
const upload = multer({
  dest: "images",
  limits: {
    fileSize: 1000000,
  },

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(doc|docx)$/))
      return cb(new Error("Please upload a document word file."));

    cb(undefined, true); // Indicating that uploaded file is acceptable
  },
});
app.post("/upload", upload.single("upload"), async (req, res) => {
  res.send();
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
