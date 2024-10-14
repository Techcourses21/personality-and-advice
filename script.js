import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import expressFlash from 'express-flash';
import session from 'express-session';

const app = express();
const port = 3000;

app.use(express.static("public"));


app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(expressFlash());


app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  app.post("/submit", (req, res) => {
    const user = req.body.userName;
    if (!user || user.trim() === "") {
      req.flash("error", "Please input your username");
      res.redirect("/");
    } else {
      res.redirect(`/api/advice?username=${user}`);
    }
  });
  
  
  app.get("/api/advice", async (req, res) => {
    try {
      const result = await axios.get("https://api.adviceslip.com/advice");
      const user = req.query.username;
  res.render("advice.ejs", {
        advice: result.data.slip.advice,
        username:user.toUpperCase()
    });
    } catch (error) {
      console.log(error.response.data);  
      res.status(500);
    }
  });
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  