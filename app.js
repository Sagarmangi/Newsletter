const express = require('express');
const app = express();
const https = require('https');

app.use(express.urlencoded());
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }

    }]
  }



  const jsonData = JSON.stringify(data);

  const url = process.env.API;

  const options = {
    method: "post",
    auth: process.env.AUTH
  }

  const request = https.request(url, options, function(response) {
    const statusCode = response.statusCode;
    console.log(statusCode);
    if (statusCode >= 200 && statusCode < 300) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });






  app.post("/failure", function(req, res) {
    res.redirect("/");
  })




  request.write(jsonData);

  request.end();

});



app.listen("3000", function() {
  console.log("Server is running on Port 3000");
})
