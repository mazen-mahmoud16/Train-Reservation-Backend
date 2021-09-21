//Requires
const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");
const Trip = require("./models/trip");
const Ticket = require("./models/ticket");
const Payment = require("./models/payment");
const dotenv=require('dotenv').config();
const path=require('path')

//Instantiations
var jsonParser = bodyParser.json();
const app = express();

//To run frontend with backend
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

//Database connection
const dbURI =process.env.DBURI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(process.env.PORT || 4000))
  .catch((err) => console.log(err));

//To make frontend call backend
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Return all trips
app.get("/", (req, res) => {
    res.send('<h1>Hello</h1>');
});

app.post("/create", jsonParser, (req, res) => {
  //If any data is missing
  if (!req.body.firstName) {
    return res.status(200).send({
      message: "Fill first name",
    });
  }
  if (!req.body.lastName) {
    return res.status(200).send({
      message: "Fill last name",
    });
  }
  if (!req.body.phoneNo) {
    return res.status(200).send({
      message: "Fill phone number",
    });
  }
  if (!req.body.username) {
    return res.status(200).send({
      message: "Fill username",
    });
  }
  if (!req.body.email) {
    return res.status(200).send({
      message: "Fill email",
    });
  }
  if (!req.body.password) {
    return res.status(200).send({
      message: "Fill password",
    });
  } else {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNo: req.body.phoneNo,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    //Save user in database
    user
      .save()
      .then((result) => {
        res.status(200).send({
          message: "User added",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

//Verification for user's entered login details
app.post("/login", jsonParser, (req, res) => {
  if (req.body.username === "admin" && req.body.password === "admin") {
    return res.status(200).send({
      message: "Admin",
    });
  }

  let messageTemp = "";
  User.find().then((result) => {
    result.forEach((user) => {
      if (
        messageTemp != "Successful login" &&
        messageTemp != "Password incorrect"
      ) {
        if (user.username == req.body.username) {
          if (user.password == req.body.password) {
            messageTemp = "Successful login";
          } else {
            messageTemp = "Password incorrect";
          }
        } else {
          messageTemp = "User not found";
        }
      }
    });
    return res.status(200).send({
      message: messageTemp,
    });
  });
});

//Return all trips
app.get("/moreInfo", jsonParser, (req, res) => {
  Trip.find().then((result) => {
    res.send(result);
  });
});

//Returns user data to be shown in profile page
app.post("/profile", jsonParser, (req, res) => {
  User.find().then((result) => {
    result.forEach((user) => {
      if (user.username == req.body.username) {
        return res.status(200).send({
          email: user.email,
          phoneNo: user.phoneNo,
        });
      }
    });
  });
});

//Checks whether there are trips compatible with user entered desired booking
app.post("/trains", jsonParser, (req, res) => {
  var temp = req.body;
  var tempStart = "no";
  var tempReturn = "no";
  var price = 0;

  Trip.find().then((result) => {
    result.forEach((details) => {
      if (details.trip_time == temp.startTime) {
        if (details.from == temp.from) {
          if (details.to == temp.to) {
            tempStart = details;
            price = details.price;
          }
        }
      }
      //If user wants to book a return tickets too
      if (temp.returnTime !== null) {
        if (details.trip_time == temp.returnTime) {
          if (details.from == temp.to) {
            if (details.to == temp.from) {
              tempReturn = details;
              price += details.price;
            }
          }
        }
      }
    });
    //To calculate prices
    var ticketsNo = parseInt(temp.noOfTickets);
    price = parseInt(price);
    price = price * ticketsNo;
    if (temp.returnTime === null) {
      tempReturn = null;
    }

    return res.status(200).send({
      tripNoStart: tempStart,
      tripNoReturn: tempReturn,
      price: price,
    });
  });
});

//To store user entered payment details in database
app.post("/payment", jsonParser, (req, res) => {
  const payment = new Payment(req.body.paymentTemp);
  payment.save().catch((err) => {
    console.log(err);
  });
  var request = req.body.request;
  var info = req.body.info;
  var ticket = new Ticket({});
  if (info.tripNoReturn === null) {
    ticket = new Ticket({
      username: request.username,
      seat_no: Math.floor(Math.random() * (100 - 1 + 1) + 1),
      cart_number: Math.floor(Math.random() * (5 - 1 + 1) + 1),
      startDate: request.startDate,
      returnDate: request.returnDate,
      noOfTickets: request.noOfTickets,
      trip_no_start: info.tripNoStart.trip_no,
      trip_no_return: null,
    });
  } else {
    ticket = new Ticket({
      username: request.username,
      seat_no: Math.floor(Math.random() * (100 - 1 + 1) + 1),
      cart_number: Math.floor(Math.random() * (5 - 1 + 1) + 1),
      startDate: request.startDate,
      returnDate: request.returnDate,
      noOfTickets: request.noOfTickets,
      trip_no_start: info.tripNoStart.trip_no,
      trip_no_return: info.tripNoReturn.trip_no,
    });
  }
  //To store ticket in database after the user pays
  ticket
    .save()
    .then((result) => {
      res.status(200).send({
        message: "Succesful",
        ticket: ticket,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//For admin page
app.post("/admin", jsonParser, (req, res) => {
  //If any data is missing
  if (!req.body.TripNo) {
    return res.status(200).send({
      message: "Enter trip number",
    });
  }
  if (!req.body.TrainNo) {
    return res.status(200).send({
      message: "Enter train number",
    });
  }
  
  if (!req.body.TrainType) {
    return res.status(200).send({
      message: "Enter train type",
    });
  }
  if (!req.body.TicketPrice) {
    return res.status(200).send({
      message: "Enter price",
    });
  }
  if (!req.body.From) {
    return res.status(200).send({
      message: "Enter from where",
    });
  }
  if (!req.body.To) {
    return res.status(200).send({
      message: "Enter destination",
    });
  }
  if (!req.body.Time) {
    return res.status(200).send({
      message: "Enter time",
    });
  } else {
    var trainImg=""
    if(req.body.TrainType==="premium"){
      trainImg="roundedtrain"
    }else if(req.body.TrainType==="express"){
      trainImg="rounded2"
    } else{
      trainImg="rounded3"
    }
    const trip = new Trip({
      trip_no: req.body.TripNo,
      train_no: req.body.TrainNo,
      train_img: trainImg,
      price: req.body.TicketPrice,
      trip_time: req.body.Time,
      train_type: req.body.TrainType,
      from: req.body.From,
      to: req.body.To,
    });
    //Save user in database
    trip
      .save()
      .then((result) => {
        res.status(200).send({
          message: "Successful",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
