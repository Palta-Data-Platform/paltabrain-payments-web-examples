import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import "@primer-io/checkout-web/dist/Checkout.css";
import {
  createPaymentClient,
  PaymentClient,
  PricePoint,
} from "@palta-brain/payments";

const customerId = {
  type: "merchant-uuid",
  value: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
};

export const PaymentScreen = (): ReactElement => {
  const [pricePoints, setPricePoints] = useState<PricePoint[]>([]);
  const [client, setClient] = useState<null | PaymentClient>(null);

  const loadCheckout = async () => {
    const metadata: Record<string, any> = {};

    const params = new URLSearchParams(window ? window.location.search : {});
    params.forEach((val, key) => {
      metadata[key] = val;
    });

    const settings = {
      apiEndpoint: `${process.env.API_ENDPOINT}`,
      apiKey: `${process.env.API_KEY}`,
      customerId: customerId,
      metadata,
    };

    const client: PaymentClient = createPaymentClient(settings);
    setClient(client);
    const pricePoints = await client.getPricePoints();
    setPricePoints(pricePoints);
  };

  useEffect(() => {
    loadCheckout().then(() => {});
  }, []);

  const buy = (sku: string) => {
    return () => {
      client.renderPaymentForm({
        containerId: "#checkout-container",
        sku: sku,
      });
    };
  };

  return (
    <>
      Payment Screen
      <table>
        <tr>
          <td>SKU & Subscription type</td>
          <td>Intro price</td>
          <td>Subscription price</td>
        </tr>
        {pricePoints.map(function (pricePoint, i) {
          return (
            <tr>
              <td>
                {pricePoint.sku} - {pricePoint.subscriptionType}
              </td>
              <td>
                {pricePoint.introTotalPrice} {pricePoint.currencyCode}
              </td>
              <td>
                {pricePoint.subscriptionTotalPrice} {pricePoint.currencyCode}
              </td>
              <td>
                <button onClick={buy(pricePoint.sku)}>Buy</button>
              </td>
            </tr>
          );
        })}
      </table>
      <br />
      <div id={"checkout-container"}></div>
    </>
  );
};
