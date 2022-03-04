import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";
import { loadPrimer } from "@primer-io/checkout-web";
import "@primer-io/checkout-web/dist/Checkout.css";

export const PaymentScreen = (): ReactElement => {
  const loadCheckout = async () => {
    const resp = await fetch("http://localhost:8080/api/client-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const token = await resp.json();

    const Primer = await loadPrimer();
    const primer = new Primer({
      credentials: {
        // Your server-generated client session token
        clientToken: token.clientToken,
      },
    });
    const checkoutOptions = {
      // The HTML element to render the checkout in
      container: "#checkout-container",
    };
    // `.checkout()` initializes and renders the UI
    await primer.checkout(checkoutOptions);
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
