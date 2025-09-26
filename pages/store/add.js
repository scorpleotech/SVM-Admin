import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Tag,
  TreeSelect,
  InputNumber,
  Upload,
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
import func from "../../util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

const Default = ({ getCategories = [] }) => {
  const Editor = dynamic(() => import("../../app/components/Editor/index"));
  const intl = useIntl();
  const [state, seTstate] = useState({ categories_id: null, type: 0 });
  const { user } = useSelector(({ login }) => login);
  const [displaySave, seTdisplaySave] = useState(true);

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
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const onSubmit = async (Data) => {
    console.log("Data", Data);

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/store`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Store Not Added" + res.data.messagge);
        } else {
          message.success("Store Added Successfully");

          router.push("/store/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };

  return (
    <div>
      <Link href="/store/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Form
        {...formItemLayout}
        form={form}
        name="add"
        onFinishFailed={onFinishFailed}
        onFinish={onSubmit}
        fields={[
          {
            name: "state",
            value: state.state,
          },

          {
            name: "name",
            value: state.name,
          },
          {
            name: "address",
            value: state.address,
          },
          {
            name: "phone",
            value: state.phone,
          },
        ]}
        scrollToFirstError
      >
        <Card className="card" title={intl.messages["app.pages.store.add"]}>
          <Form.Item
            name="state"
            label={intl.messages["app.pages.common.state"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  state: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="city"
            label={"City"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  city: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={intl.messages["app.pages.common.name"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  name: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="store_type"
            label={"Store Type"}
            rules={[
              {
                required: true,
                store_type: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Select
              onChange={(value) => {
                seTstate({
                  ...state,
                  store_type: value,
                });
              }}
            >
              <Select.Option value="showroom">Showroom</Select.Option>
              <Select.Option value="service_center">
                Service Center
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label={intl.messages["app.pages.common.address"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  address: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label={intl.messages["app.pages.common.phone"]}
            rules={[
              {
                required: true,
                phone: intl.messages["app.pages.common.pleaseFill"],
              },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  phone: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            label={"Email"}
            rules={[
              {
                required: true,
                email: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  email: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="website"
            label={"Website"}
            rules={[
              {
                required: true,
                website: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  website: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="pincode"
            label={"Pincode"}
            rules={[
              {
                required: true,
                pincode: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              type="number"
              onChange={(e) => {
                seTstate({
                  ...state,
                  pincode: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="map"
            label={"Map Link"}
            rules={[
              {
                required: true,
                map: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  map: e.target.value,
                });
              }}
            />
          </Form.Item>
        </Card>

        <Card className="card">
          <Form.Item className="float-right">
            <Button type="primary" htmlType="submit">
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

export default Default;
