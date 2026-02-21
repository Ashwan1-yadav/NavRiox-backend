const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();

app.use(cors(
  { 
    origin: true, // Put frontend url here
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true 
  }
));

app.use(helmet());
app.use(morgan("dev"));
app.use(
  "/api/payment/webhook",
  require("express").raw({ type: "application/json" })
);
app.use(express.json());
app.use(cookieParser());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/payment", require("./modules/payment/payment.routes"));
app.use("/api/passport", require("./modules/passport/passport.routes"));

app.get("/", (_, res) => {
  res.send("Navriox Backend API is up and running");
});

module.exports = app;
