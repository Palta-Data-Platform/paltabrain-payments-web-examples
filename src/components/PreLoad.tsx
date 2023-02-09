import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import "@primer-io/checkout-web/dist/Checkout.css";
import { v4 as uuidv4 } from "uuid";
import "./PreLoad.css";

import {
  createPaymentClient,
  PaymentClient,
  PricePoint,
} from "@palta-brain/payments";

const customerId = {
  type: "merchant-uuid",
  value: uuidv4(),
};

const ident = "pora_premium_1m_9_99_usd";

export const PreLoad = (): ReactElement => {
  const [step, setStep] = useState<number>(2);
  const payments = useRef(null);
  const [clientCard, setClientCard] = useState<null | PaymentClient>(null);
  const [clientPayPal, setClientPayPal] = useState<null | PaymentClient>(null);

  const createClient = async (setClient, metadata, id) => {
    const settings = {
      //apiEndpoint: `${process.env.API_ENDPOINT}`,
      apiEndpoint: "https://api.payments.paltabrain.com",
      //apiKey: `${process.env.API_KEY}`,
      apiKey: "9facd59ffe994bbd9e7848dad192b8b0",
      metadata,
      onError: (error: any, description: string) => {
        console.log(description);
        console.log(error);
      },
      onPaymentStatusChange: (status: string) => {
        console.log(status);
      },
    };

    const client: PaymentClient = createPaymentClient(settings);
    setClient(client);

    client?.showPaymentForm(
      {
        ident: ident,
        countryCode: "US",
        platformCode: "desktop_web",
        orderId: uuidv4(),
        customerId: customerId,
        customer: {
          emailAddress: "testing@paltabrain.com",
          billingAddress: {
            addressLine1: "Main St",
            addressLine2: "175",
            city: "Montpelier",
            countryCode: "US",
            postalCode: "05602",
          },
        },
      },
      {
        container: id,
        locale: "en-US",
        vault: { visible: false },
        paypal: {
          buttonColor: "black",
          buttonShape: "pill",
          buttonSize: "large",
          buttonLabel: "buynow",
          paymentFlow: "PREFER_VAULT",
        },
      },
    );
  };

  const loadCheckout = async () => {
    await createClient(setClientCard, { card: 1 }, "#checkout-container-card");
    await createClient(
      setClientPayPal,
      { paypal: 1 },
      "#checkout-container-paypal",
    );
  };

  useEffect(() => {
    loadCheckout();
  }, []);

  let header = <> </>;
  if (0 == step) {
    header = (
      <>
        <h1>Step 1</h1>
        <div>This is our first step of onboarding.</div>
        <div>
          <button onClick={() => setStep(1)}>Next</button>
        </div>
      </>
    );
  } else if (1 == step) {
    header = (
      <>
        <h1>Step 2</h1>
        <div>This is our second step of onboarding.</div>
        <div>
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      </>
    );
  } else if (2 == step) {
    setTimeout(() => {
      setStep(3);
    }, 3000);
    header = (
      <>
        <h1>Step 3</h1>
        <div>This is our third step of onboarding.</div>
        <h2>
          Calculating <span className={"blink_me"}>...</span>
        </h2>
      </>
    );
  } else if (3 == step) {
    payments.current.style.display = "block";
    document.getElementById("checkout-container-card").style.display = "block";
    header = (
      <>
        <h1>Payment</h1>
      </>
    );
  }

  const changeVisibility = (e) => {
    const select = e.target;
    const payments = select.parentNode.childNodes;
    for (let i = 2; i < payments.length; i++) {
      payments[i].style.display = "none";
    }
    document.getElementById(select.value).style.display = "block";
  };

  return (
    <>
      {header}
      <div style={{ display: "none" }} ref={payments}>
        <h2 style={{ display: "inline" }}>Payment method:</h2>
        <select
          style={{ height: "50px", width: "150px", marginBottom: "20px" }}
          onChange={changeVisibility}
        >
          <option value={"checkout-container-card"}>Card</option>
          <option value={"checkout-container-paypal"}>PayPal</option>
        </select>
        <div style={{ display: "none" }} id={"checkout-container-card"}></div>
        <div style={{ display: "none" }} id={"checkout-container-paypal"}></div>
      </div>
    </>
  );
};
