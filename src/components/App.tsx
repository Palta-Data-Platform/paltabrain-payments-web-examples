import * as React from "react";
import { hot } from "react-hot-loader";

import "./../assets/scss/App.scss";
import { PaymentScreen } from "./PaymentScreen";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return <PaymentScreen />;
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
