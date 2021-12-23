var express = require('express');
var router = express.Router();
const app = express();
var usermodel = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'
var XLSX = require('xlsx')


router.put("/updateUser", async function (req, res, next) {
  const {
    email,
    lastname,
    firstname,
  
  } = req.body;
  console.log(email,lastname,firstname)
  const user = await usermodel.findOne({ email });
  
  user.email=email;
  user.lastname=lastname;
  user.firstname=firstname;
  

  try {
    const response = await user.save();
    const token = jwt.sign(
      {
        _id: user._id,
        email:user.email,
        lastname:user.lastname,
        firstname:user.firstname,
      },
      "secretkey",
      { expiresIn: "3600s" },
      JWT_SECRET
      );
      const Done=true;
      return res.json({ status: "ok", data: token,done:Done });    
  } catch (error) {
    console.error(error.code);
    res.status(500).send({ message: "Could not update user" });
  }
});

router.post("/register/", async function (req, res, next) {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    password: plainTextPassword,
    email,
    lastname,
    firstname,
    direction,
  } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);
  console.log("pass", password);
  try {
    const response = await usermodel.create({
      password,
      email,
      lastname,
      firstname,
      direction
    });
    var token = jwt.sign(
      {
        _id: response._id,
      },
      "secretkey",
      { expiresIn: "3600s" },
      JWT_SECRET
      );
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "email already in use" });
    }
    throw error;
  }

  return res.json({ status: "ok", data: token });
});
router.post("/login/", async (req, res) => {
  const { email, password } = req.body;
  console.log(password);

  const user = await usermodel.findOne({ email }).lean();
  console.log(user);
  if (!user) {
    return res.json({ status: "error", error: "Invalid email/password" });
  }
  if ((await bcrypt.compare(password, user.password)) == false) {
    return res.json({ status: "error", error: "Invalid password" });
  } else if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        _id: user._id,
        email:user.email,
        lastname:user.lastname,
        firstname:user.firstname,
      },
      "secretkey",
      { expiresIn: "3600s" },
      JWT_SECRET
      );
      const Done=true;
      return res.json({ status: "ok", data: token,done:Done });
  }
});

router.get("/Alluser", function (req, res, next) {
  usermodel.find(function (err, data) {
    if (err) console.log(err);
    res.json(data);
    console.log(data);
  });
});

router.delete('/deleteuser/:id',function(req,res,next)
{
  usermodel.findByIdAndRemove(req.params.id,
        function(err,data)
        {
			
            if (err)
                console.log(err);
            res.json(data)
        })
});

module.exports = router;
