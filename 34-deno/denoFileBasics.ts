const text = 'this text should be stored in a file.';

const encoder = new TextEncoder();
const data = encoder.encode(text);

Deno.writeFile('msg.txt', data).then(() => {
  console.log('wrote to file...');
});
