
// To listen on port 3000.
Deno.serve({ port: 3000 }, (req) => {
  console.log('server running on port 3000 ')
  
});

// const server = Deno.serve({ port: 3000 });

// for await (const req of server) {
//   req.respond({ body: "Hello World\n" });
// }
