import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import "@primer-io/checkout-web/dist/Checkout.css";
import "./PreLoad.css";
import { createPaymentClient, PaymentClient } from "@palta-brain/payments";
import { v4 as uuidv4 } from "uuid";
import { PaymentClientSettings } from "@palta-brain/payments";

const customerId = {
  type: "merchant-uuid",
  value: uuidv4(),
};

const idents = ["pora_premium_1m_9_99_usd", "pora_premium_3m_1_usd"];
let previousRender = Promise.resolve(1);

export const MultiForm = (): ReactElement => {
  const [priceId, setPriceId] = useState(1);

  const showPrice = (price: number) => {
    setPriceId(price);
  };

  const createClient = async (id: string, ident: string) => {
    const settings: PaymentClientSettings = {
      apiEndpoint: "https://api.payments.paltabrain.com",
      apiKey: "9facd59ffe994bbd9e7848dad192b8b0",
      metadata: { card: 1 },
      onError: (error: any, description: string) => {
        console.log(description);
        console.log(error);
      },
      onPaymentStatusChange: (status: string, method: string) => {
        console.log(status + " " + method);
      },
    };

    const client: PaymentClient = createPaymentClient(settings);

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

  useEffect(() => {
    previousRender = previousRender.then(() => {
      document.getElementById("checkout-container-card").innerHTML = "";
      createClient("#checkout-container-card", idents[priceId]);
    });
  }, [priceId]);

  return (
    <>
      <h1>Multi form example</h1>
      <div>
        <button disabled={priceId == 0} onClick={() => showPrice(0)}>
          Price 1
        </button>
        &nbsp;
        <button disabled={priceId == 1} onClick={() => showPrice(1)}>
          Price 2
        </button>
      </div>
      <div style={{ margin: "10px 0" }}>Current price point ident: <b>{idents[priceId]}</b></div>
      <div id={"checkout-container-card"}></div>
    </>
  );
};
