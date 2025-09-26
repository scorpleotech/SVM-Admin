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
  Card,
  Alert,
  message,
  Divider,
  Select,
  Form,
  Input,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import { SketchPicker } from "react-color"; // Import SketchPicker from react-color
import Link from "next/link";

// const { ColorPicker } = antd;

const Default = () => {
  const intl = useIntl();

  const [state, seTstate] = useState({ colorCode: "#000" });
  const [displaySave, seTdisplaySave] = useState(true);
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

  const { user } = useSelector(({ login }) => login);
  const [form] = Form.useForm();

  const [selectedType, setSelectedType] = useState(null);

  const handleTypeChange = (value) => {
    setSelectedType(value);
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

  const onSubmit = async (Data) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/values`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Values Not Added" + res.data.messagge);
        } else {
          message.success("Values Added Successfully");
          router.push("/values/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
        s;
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Link href="/values/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      {/* <Alert
        className="mb-5"
        message="values image should be same size 232x55"
        type="info"
        closable
      /> */}
      <Card className="card" title={"Values Add"}>
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
            label={"Value Name"}
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
            name="type"
            label={"Value Type"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                type: e.target.value,
              });
            }}
          >
            <Select onChange={handleTypeChange}>
              <Select.Option value="role">Roles</Select.Option>
              <Select.Option value="service_type">Service Type</Select.Option>
              <Select.Option value="incentive_status">
                Incentive Status
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="value"
            label={"Value"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                value: e.target.value,
              });
            }}
          >
            <Input />
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
