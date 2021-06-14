const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const directory = __dirname + '/uploads';

fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    console.log(file);
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});

const upload = multer({
  dest: directory+'/' // this saves your file into a directory called "uploads"
}); 

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// It's very crucial that the file name matches the name attribute in your html
app.post('/', upload.single('file-to-upload'), (req, res) => {
  console.log(mostRecentFile(directory));
  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Listening port 3000: http://localhost:3000");
});

const mostRecentFile = (directory) => {
  const files = fs.readdirSync(directory)
                .map(file => ({ file, mtime: fs.lstatSync(path.join(directory, file)).mtime }))
                .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  return files.length ? files[0] : undefined;
}; 