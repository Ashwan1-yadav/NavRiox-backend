require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

app.listen(process.env.PORT, () =>
  console.log(`Server up and running : http://localhost:${process.env.PORT}`)
);
