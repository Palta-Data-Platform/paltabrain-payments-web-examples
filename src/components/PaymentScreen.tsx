import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import "@primer-io/checkout-web/dist/Checkout.css";
import { v4 as uuidv4 } from "uuid";
import {
  createPaymentClient,
  PaymentClient,
  PricePoint,
} from "@palta-brain/payments";

const customerId = {
  type: "merchant-uuid",
  value: uuidv4(),
};

export const PaymentScreen = (): ReactElement => {
  const promoBox = useRef(null);
  const [pricePoints, setPricePoints] = useState<PricePoint[]>([]);
  const [promo, setPromo] = useState<string>("");
  const [client, setClient] = useState<null | PaymentClient>(null);

  const loadCheckout = async () => {
    const metadata: Record<string, any> = {
      card: 1,
    };

    const params = new URLSearchParams(window ? window.location.search : {});
    params.forEach((val, key) => {
      metadata[key] = val;
    });

    const settings = {
      apiEndpoint: `${process.env.API_ENDPOINT}`,
      apiKey: `${process.env.API_KEY}`,
      metadata,
      onError: (error: any, description: string) => {
        console.log(description);
        console.log(error);
      },
      onPaymentStatusChange: (status: string, method: string) => {
        console.log(status + " " + method);
      },
    };

    const client: PaymentClient = createPaymentClient(settings);
    setClient(client);

    const request = {
      customerId: customerId,
      availability_rules: false,
      ident: null,
      status: null,
      countryCode: "US",
      platformCode: "desktop_web",
      requestContext: null,
    };
    if (promo) {
      request.availability_rules = true;
      request.requestContext = { promo: promo };
    }

    const pricePoints = await client.getPricePoints(request);
    setPricePoints(pricePoints);
  };

  useEffect(() => {
    loadCheckout();
  }, [promo]);

  const applyPromo = () => {
    setPromo(promoBox.current.value);
  };

  const buy = (sku: string) => {
    return () => {
      client?.showPaymentForm(
        {
          ident: sku,
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
          container: "#checkout-container",
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
  };

  const discount = (price: number, percentage: number) => {
    if (0 < price) {
      return "discount is " + price;
    }
    if (0 < percentage) {
      return "discount is " + percentage + "%";
    }
    return "";
  };

  return (
    <>
      Payment Screen
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Intro price</th>
            <th>Subscription price</th>
            <th>Is promo?</th>
          </tr>
        </thead>
        <tbody>
          {pricePoints.map(function (pricePoint, i) {
            return (
              <tr key={`item-${i}`}>
                <td>
                  {pricePoint.ident} - {pricePoint.type}
                </td>
                <td>
                  {pricePoint.introTotalPrice}{" "}
                  {discount(
                    pricePoint.introDiscountPrice,
                    pricePoint.introDiscountPercentage,
                  )}{" "}
                  {pricePoint.currencyCode}
                </td>
                <td>
                  {pricePoint.subscriptionTotalPrice}{" "}
                  {discount(
                    pricePoint.subscriptionDiscountPrice,
                    pricePoint.subscriptionDiscountPercentage,
                  )}{" "}
                  {pricePoint.currencyCode}
                </td>
                <td>{pricePoint.parameters?.is_promo ? "true" : ""}</td>
                <td>
                  <button onClick={buy(pricePoint.ident)}>Buy</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <input ref={promoBox} type={"text"} />
      &nbsp;
      <button onClick={applyPromo}>Apply promo</button>
      <br />
      <div id={"checkout-container"}></div>
    </>
  );
};
