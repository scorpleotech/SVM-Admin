import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  InputNumber,
  Button,
  Select,
  Card,
  message,
  Divider,
  Form,
  Input,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

import Link from "next/link";

const Default = () => {
  const intl = useIntl();

  const [state, seTstate] = useState({ colorCode: "#000" });
  const [displaySave, seTdisplaySave] = useState(true);
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

  const { user } = useSelector(({ login }) => login);
  const [form] = Form.useForm();

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
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Enquiry not added" + res.data.messagge);
        } else {
          message.success("Enquiry Added");
          router.push("/enquiry/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Link href="/enquiry/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Enquiry Add"}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={"Name"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                name: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={"Email"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                email: e.target.value,
              });
            }}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            name="mobile"
            label={"Mobile"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                mobile: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="enquiry"
            label={"Message"}
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
                  enquiry: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Default;
