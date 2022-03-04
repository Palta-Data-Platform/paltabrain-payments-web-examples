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
      async onTokenizeSuccess(paymentMethod) {
        console.log("onTokenizeSuccess");
        console.log(paymentMethod);

        const resp = await fetch("http://localhost:8080/api/pay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethodToken: paymentMethod.token,
          }),
        });

        // Send the Payment Method Token to your server
        // to create a payment using Payments API
        //const response = await createPayment(paymentMethod.token);
        // If a new clientToken is available, resolve the Promise to refresh the client session.
        // The checkout will automatically perform the action required by the Workflow.
        // if (response.requiredAction.clientToken) {
        //   return { clientToken: response.requiredAction.clientToken };
        // }
        // Display the success screen.
        return true;
      },
      async onResumeSuccess(data) {
        console.log("onResumeSuccess");
        console.log(data);
        // Send the resume token to your server to resume the payment
        //const response = await resumePayment(data.resumeToken);
        // If a new clientToken is available, resolve the Promise with it to refresh the client session
        // The checkout will automatically perform the action required by the Workflow
        // if (response.requiredAction.clientToken) {
        //   return { clientToken: response.requiredAction.clientToken };
        // }
        // Display the success screen
        return true;
      },
      async onClientSessionActions(data) {
        console.log("onClientSessionActions");
        console.log(data);
        // Send the actions to your server to update the client session
        //const response = await updateClientSession(data.actions);
        // Refresh the checkout with the latest data from the client session
        //return { clientToken: response.clientToken };
      },
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
