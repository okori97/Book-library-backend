const app = require("./src/app");

const PORT = process.env.PGPORT;

app.listen(() => {
  console.log(`App is listening on ${PORT}`);
});
