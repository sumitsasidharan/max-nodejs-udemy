## Packages Used for Validation.

### validator express-validator

Used for form validation. Used in auth routes & controller.

Useful resources:

Express-Validator Docs: https://express-validator.github.io/docs/

Validator.js (which is used behind the scenes) Docs: https://github.com/chriso/validator.js

## Section 19: Error Handling

- https://expressjs.com/en/guide/error-handling.html

## Section 20: Uploading Files

multer is used to parse files.

- Use pdfkit to create pdf files on the flow. Section 333. Shop.js controller.

Useful resources:

https://www.freecodecamp.org/news/simplify-your-file-upload-process-in-express-js/

Multer Official Docs: https://github.com/expressjs/multer

Streaming Files: https://medium.freecodecamp.org/node-js-streams-everything-you-need-to-know-c9141306be93

Generating PDFs with PDFKit: http://pdfkit.org/docs/getting_started.html

## Section 26: Web Socket Socket.io

- install socket.io in node.js, socket.io-client in react.

React.js code

```js
import openSocket from 'socket.io-client';

// after fetching posts successfully, getPosts() or useEffect()
// in Feed.js
const socket = openSocket('http://localhost:8080');
socket.on('posts', (data) => {
  if (data.action === 'create') {
    // adds the post in all users when a post is created by any user
    this.addPost(data.post);
  } else if (data.action === 'update') {
    this.updatePost(data.post);
  } else if (data.action === 'delete') {
    this.loadPosts(); // fething new posts, can also update state
  }
});
```
