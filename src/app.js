require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const indexRouter = require("./routes/index.routes");
const { connectDB } = require("./db");
const expressSession = require("express-session");
const logger = require("morgan");
const ErrorHandler = require("./utils/ErrorHandler");
const { generatedError } = require("./middlewares/generateError");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const MongoStore = require("connect-mongo");
app.use(logger("tiny"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({ origin: true, withCredentials: true }));

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
  }),
);
app.use(cookieParser());

connectDB();

app.use("/", indexRouter);

app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://www.google.com/");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next(new ErrorHandler(404, `requested URL ${req.url} is invalid`));
});

app.use(generatedError);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
