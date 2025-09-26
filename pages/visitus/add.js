import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import { useIntl } from "react-intl";
import moment from "moment";

const AddVisitus = () => {
  const intl = useIntl();
  const [state, seTstate] = useState({});
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/visitus`,
        values
      );
      if (response.status === 201) {
        message.success("Visitus Created Successfully");
        Router.push("/visitus/list");
      }
    } catch (error) {
      message.error(error.response.data.message);
      message.error("Visitus Not Created");
    } finally {
      setLoading(false);
    }
  };
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
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Link href="/visitus/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Visitus  Add"}>
        <Form
          {...formItemLayout}
          name="addVisitusForm"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mobile"
            name="phone"
            rules={[
              { required: true, message: "Please enter mobile number" },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid mobile number",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label={"Description"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input.TextArea
              onChange={(e) => {
                seTstate({
                  ...state,
                  description: e.target.value,
                });
              }}
            />
          </Form.Item>
          {/* <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please enter state" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Dealer Name"
            name="dealer_name"
            rules={[
              { required: true, message: "Please enter contact address" },
            ]}
          >
            <Input />
          </Form.Item> */}

          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" loading={loading}>
              save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddVisitus;
