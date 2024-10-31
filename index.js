const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const user = require("./models/user");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");

//Login page
app.get("/", (req, res) => {
  res.render("index");
});

//Creating the user
app.post("/create", (req, res) => {
  const { name, email, password } = req.body;

  //hashing the password
  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(password, salt, (err, hash) => {
        if (!err) {
          const newUser = new user({
            name,
            email,
            password: hash,
          });
          newUser.save();

          const token = jwt.sign({ email }, "secret");
          res.cookie("token", token);
          res.send("created ");
        }
      });
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

//Logging
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await user.findOne({ email });
  if (!result) {
    res.send("something went wrong");
  }

  //checking the password
  bcrypt.compare(password, result.password, (err, check) => {
    if (err) {
      res.send("something went wrong");
    }
    if(check){
const token=jwt.sign({email:result.email},"secret")
        res.cookie("token",token)

        res.json({
            message: `you are login ${result.name}`,
            pass:password,
          });
    }else
    res.send("something went wrong")
  });
});

// Logout route
app.get('/logout',(req,res)=>{
    res.render('logout')
})

app.post("/logout", (req, res) => {
    res.clearCookie("token"); // Clear the token cookie
    res.send("You have been logged out successfully.");
});


//lsitening the request
const port = 1111;
app.listen(port, () => console.log("server is live"));
