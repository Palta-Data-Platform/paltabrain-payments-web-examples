import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./../assets/scss/App.scss";
import { PaymentScreen } from "./PaymentScreen";
import { ReactElement } from "react";

export const App = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<PaymentScreen />} />
      </Routes>
    </BrowserRouter>
  );
};
