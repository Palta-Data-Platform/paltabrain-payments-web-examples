import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import "@primer-io/checkout-web/dist/Checkout.css";
import { createPaymentClient, PaymentClient } from "@palta-brain/payments";

const customerId = {
  type: "merchant-uuid",
  value: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
};

const settings = {
  apiEndpoint: `${process.env.API_ENDPOINT}`,
  apiKey: `${process.env.API_KEY}`,
  customerId: customerId,
};

export const PaymentScreen = (): ReactElement => {
  const loadCheckout = async () => {

    const client: PaymentClient = createPaymentClient(settings);
    const pricePoints = await client.getPricePoints();
    await client.renderPaymentForm({
      containerId: "#checkout-container",
      sku: pricePoints[0].sku,
    });
  };

  useEffect(() => {
    loadCheckout().then(() => {});
  }, []);

  return (
    <>
      Payment Screen
      <br />
      <div id={"checkout-container"}></div>
    </>
  );
};
