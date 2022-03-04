const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const portNumber = 3000;
const sourceDir = "dist";

function runAsyncWrapper(callback) {
  return function (req, res, next) {
    callback(req, res, next).catch(next);
  };
}

app.use(express.static(sourceDir));

app.post(
  "/client-token",
  runAsyncWrapper(async (req, res) => {
    request.post(
      {
        url: "https://api.sandbox.primer.io/client-session",
        headers: {
          "X-Api-Key": "1bd09573-caa2-4994-8178-28270829bb90",
          "X-Api-Version": "2021-10-19",
        },
      },
      function (error, response, body) {
        // console.log(error);
        // console.log(response);
        //console.log(body);
        res.send(body);
      },
    );
  }),
);

app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
  console.log(`Serving content from /${sourceDir}/`);
});
