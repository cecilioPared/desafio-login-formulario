import express from "express";
import http from "http";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import hbs from "hbs";
import session from "express-session";
import MongoStore from "connect-mongo";
import bodyParser from "body-parser";
import viewRouter from "./routers/index.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", hbs.__express);

const PORT = 3000;

app.use(cookieParser("3!$H4s5K36#s"));
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://developer:xKC5-!M2BngHsNg@cluster0.lwkvzm9.mongodb.net/sessiones?retryWrites=true&w=majority",
      ttl: 10,
    }),
    secret: "3biXMV8#m5s7",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/", viewRouter);
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server running in port", PORT);
});
