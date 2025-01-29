// import fs from 'fs';
import fs from 'fs/promises';
// import path from 'path';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// provides the current file's filename
const __filename = fileURLToPath(import.meta.url);
// creates the path
const __dirname = dirname(__filename);

export  const resHandler = (req, res, next) => {
  // using promises
  fs.readFile('my-page.html', 'utf8')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));

  // fs.readFile('my-page.html', 'utf8', (err, data) => {
  //   res.send(data);
  // });
  
  // res.sendFile(path.join(__dirname, 'my-page.html'));
};

// module.exports = resHandler;
// export default resHandler;