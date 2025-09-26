import { useState, useEffect } from "react";
import axios from "axios";
// import { API_URL } from "../../../config";
import router from "next/router";
import {
  Table,
  Popconfirm,
  Radio,
  Button,
  Card,
  message,
  Divider,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "antd";

import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

import Link from "next/link";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const { id } = router.query;
  const [state, seTstate] = useState({
    products: [],
    discount_price: 0,
    total_price: 0,
    cargo_price: 0,
  });
  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );

  const [customerSingle, seTcustomerSingle] = useState([]);

  const [form] = Form.useForm();

  function getDataFc() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`)
      .then((response) => {
        console.log("response.data", response.data);
        seTstate(response.data);
        seTfields(
          Object.entries(response.data).map(([name, value]) => ({
            name,
            value,
          }))
        );
      });
  }

  // componentDidMount = useEffect
  useEffect(() => {
    getDataFc();
    getDataOrderStatusFc();
    getDataCustomersFc();
    getDataPaymentMethodsFc();
    getDataCargoesFc();
    getDataProductsFc();
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  const onSubmit = async (Data) => {
    Data["customer"] = customerSingle;
    Data["products"] = state.products;
    Data["discount_price"] = state.discount_price;

    Data["total_price"] = state.total_price;
    Data["cargo_price"] = state.cargo_price;

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Order Not Updated" + res.data.messagge);
        } else {
          message.success("Order Updated Successfully");

          router.push("/orders/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Order Not Updated" + res.data.messagge);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const getDataCustomersFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/customers`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = [{ label: "Guest", value: null }];
          for (const i in res.data) {
            dataManipulate.push({
              label: res.data[i].name + " " + res.data[i].surname,
              value: res.data[i]._id,
            });
          }

          seTcustomerdata(dataManipulate);
          seTcustomerdataAll(res.data);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataProductsFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = [];
          for (const i in res.data) {
            dataManipulate.push({
              label: res.data[i].title,
              value: res.data[i]._id,
            });
          }

          seTproductsData(dataManipulate);
          seTproductDataAll(res.data);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataPaymentMethodsFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/paymentmethods`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = [];
          for (const i in res.data) {
            dataManipulate.push({
              label: res.data[i].title,
              value: res.data[i]._id,
            });
          }

          seTpaymentMethodsData(dataManipulate);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataCargoesFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/cargoes`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = [];
          for (const i in res.data) {
            dataManipulate.push({
              label: res.data[i].title,
              value: res.data[i]._id,
            });
          }

          seTcargoes(dataManipulate);
          seTallCargoes(res.data);
        }
      })
      .catch((err) => console.log(err));
  };
  const getDataOrderStatusFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orderstatus`)
      .then((res) => {
        if (res.data.length > 0) {
          const dataManipulate = [];
          for (const i in res.data) {
            dataManipulate.push({
              label: res.data[i].title,
              value: res.data[i]._id,
            });
          }

          seTorderStatus(dataManipulate);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Link href="/orders/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Order Edit"}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item name="ordernumber" label={"Order Number"}>
            <Input readOnly bordered={false} />
          </Form.Item>

          <Form.Item
            name="order_status"
            label={"Order Status"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
            <Select style={{ width: "100%" }}>
              {/* <Select.Option value="Admin">Admin</Select.Option> */}
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Booked">Booked</Select.Option>
              {/* <Select.Option value="Sales_Agent">Sales Agent</Select.Option> */}              
              {/* <Select.Option value="Service_Agent">Service Agent</Select.Option> */}
              <Select.Option value="In_Progress">In Progress</Select.Option>
              <Select.Option value="Loan_Process">Loan Process</Select.Option>
              <Select.Option value="RTO_Process">RTO Process</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Canceled">Canceled</Select.Option>
            </Select>
          </Form.Item>

          {/* // validation for phone number */}
          <Form.Item name="customer_name" label={"Customer Name"}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label={"Customer Email"}>
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label={"Customer Number"}
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
              {
                pattern: /^\d{10}$/,
                message: "Phone number must be 10 digits!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Model Name" name={"model_name"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="Model Category" name={"model_category"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="Model Booked Color" name={"model_booked_color"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="Coupon Code" name={"coupon_code"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="Agent Code" name={"agent_code"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="Price" name={"price"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="City" name={["address", "city"]}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item label="State" name={["address", "state"]}>
            <Input readOnly bordered={false} />
          </Form.Item>
          {/* <Form.Item label="Booking Date">
            {moment(order.booking_date).format("YYYY-MM-DD HH:mm:ss")}
          </Form.Item>
          <Form.Item label="Order Status">{order.order_status}</Form.Item>

         */}

          <div style={{ clear: "both" }}></div>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Default;
