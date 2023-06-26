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
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
} from "antd";

const customerId = {
  type: "merchant-uuid",
  value: uuidv4(),
};

type DataType = {
  paymentType: string;
  orderId: string;
  customerId: string;
  publicApiKey: string;
  privateAPIKey: string;
  apiEndpoint: string;
  ident: string;
  metadata: string;
};

const defaultData: DataType = {
  paymentType: "SUBSCRIPTION",
  orderId: uuidv4(),
  customerId: uuidv4(),
  publicApiKey: "",
  privateAPIKey: "",
  apiEndpoint: "https://api.payments.paltabrain.com",
  ident: "",
  metadata: "{}",
};

export const Test = (): ReactElement => {
  const formRef = React.useRef<FormInstance>(null);

  const [data, setData] = useState<DataType>(defaultData);

  const onDataChange = (field: DataType) => {
    const newData = {
      ...data,
      ...field,
    };
    saveToLocalStorage(newData);
    setData(newData);
  };

  useEffect(() => {
    const raw = localStorage.getItem("_pbp_test_data");
    if (raw) {
      const newData: DataType = JSON.parse(raw);
      Object.keys(newData).forEach((key) => {
        if (key !== "orderId" && key !== "customerId") {
          formRef.current?.setFieldValue(key, newData[key]);
        }
      });
      setData(newData);
    }
  }, []);

  const saveToLocalStorage = (obj) => {
    localStorage.setItem("_pbp_test_data", JSON.stringify(obj));
  };

  const onClear = () => {
    formRef.current?.resetFields();
    saveToLocalStorage(defaultData);
  };
  const onOneClickPayment = async () => {
    const resultElement = document.getElementById("paymentForm");
    resultElement.innerHTML = "... loading ...";

    const url = data.apiEndpoint + "/primer/purchase";
    const requestBody = {
      customerId: {
        type: "merchant-uuid",
        value: data.customerId,
      },
      ident: data.ident,
      paymentType: data.paymentType,
      metadata: JSON.parse(data.metadata),
    };

    await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": data.privateAPIKey,
        "x-paltabrain-trace-id": uuidv4(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        resultElement.textContent = JSON.stringify(data, null, 2);
      })
      .catch((error) => (resultElement.textContent = error));
  };

  const onShowPaymentForm = () => {
    document.getElementById("paymentForm").innerHTML = "";

    const settings = {
      apiEndpoint: data.apiEndpoint,
      apiKey: data.publicApiKey,
      metadata: JSON.parse(data.metadata),
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
        ident: data.ident,
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
        container: "paymentForm",
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

  return (
    <>
      <Row>
        <Col span={24}>
          <h1>Testing page</h1>
          <Form
            ref={formRef}
            name="basic"
            labelCol={{
              xs: { span: 24 },
              sm: { span: 6 },
              md: { span: 6 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              xs: { span: 24 },
              sm: { span: 16 },
              md: { span: 10 },
              lg: { span: 10 },
            }}
            onValuesChange={onDataChange}
            initialValues={defaultData}
            autoComplete="off"
          >
            <Form.Item label="Payment Type" name="paymentType">
              <Select
                options={[
                  { value: "SUBSCRIPTION", label: "SUBSCRIPTION" },
                  { value: "FIRST_PAYMENT", label: "FIRST_PAYMENT" },
                  { value: "ECOMMERCE", label: "ECOMMERCE" },
                ]}
              />
            </Form.Item>

            <Form.Item label="Order Id" name="orderId">
              <Input placeholder="Order id" />
            </Form.Item>

            <Form.Item label="Customer Id" name="customerId">
              <Input placeholder="Customer id" />
            </Form.Item>

            <Form.Item label="Public API Key" name="publicApiKey">
              <Input placeholder="Public API Key" />
            </Form.Item>

            <Form.Item label="Private API Key" name="privateApiKey">
              <Input placeholder="Private API Key" />
            </Form.Item>

            <Form.Item label="Api Endpoint" name="apiEndpoint">
              <Select
                options={[
                  {
                    value: "https://api.payments.paltabrain.com",
                    label: "Production",
                  },
                  {
                    value: "https://api.payments.dev.paltabrain.com",
                    label: "Developemnt",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item label="Price Point Ident" name="ident">
              <Input placeholder="Price Point Ident" />
            </Form.Item>

            <Form.Item label="Metadata" name="metadata">
              <Input placeholder="Metadata" />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space>
            <Button type={"primary"} onClick={onShowPaymentForm}>
              Show payment form
            </Button>
            <Button type={"primary"} onClick={onOneClickPayment}>
              One click payment
            </Button>
            <Button onClick={onClear}>Clear</Button>
          </Space>
        </Col>
      </Row>
      <Row>
        <Col>
          <div id={"paymentForm"} />
        </Col>
      </Row>
    </>
  );
};
