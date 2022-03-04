const express = require("express");
const https = require("https");
const request = require("request");
const crypto = require("crypto");
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

app.post(
  "/pay",
  runAsyncWrapper(async (req, res) => {
    console.log(req)
    request.post(
      {
        url: "https://api.sandbox.primer.io/payments",
        headers: {
          "X-Api-Key": "6086f6fb-7ac9-4dfd-bd92-6839173b2471",
          "X-Api-Version": "2021-09-27",
          "X-Idempotency-Key": crypto.randomBytes(16).toString("hex"),
        },
        body: JSON.stringify({
          orderId: "order-" + crypto.randomBytes(16).toString("hex").substring(0, 5),
          amount: 800,
          currencyCode: "GBP",
          paymentMethodToken: req.body.paymentMethodToken,
        }),
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
