import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./../assets/scss/App.scss";
import { PaymentScreen } from "./PaymentScreen";
import { ReactElement } from "react";
import { PreLoad } from "./PreLoad";
import { MultiForm } from "./MultiForm";
import { Test } from './Test';

export const App = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<PaymentScreen />} />
      </Routes>
      <Routes>
        <Route path={"/test"} element={<Test />} />
      </Routes>
      <Routes>
        <Route path={"/preload"} element={<PreLoad />} />
      </Routes>
      <Routes>
        <Route path={"/multiform"} element={<MultiForm />} />
      </Routes>
    </BrowserRouter>
  );
};
