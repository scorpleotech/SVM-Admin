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
  Typography,
} from "antd";
import func from "../../util/helpers/func";
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
    console.log("data, ", Data);

    const newData = {
      vehicle: Data["vehicle"],
      manufacturer: Data["manufacturer"],
      model: Data["model"],
      vehicleClass: Data["vehicleClass"],
      topSpeed: Data["topSpeed"],
      acceleration: Data["acceleration"],
      battery_capacity: Data["battery_capacity"],
      releaseDate: Data["releaseDate"],
      operatingCosts: {
        range: parseFloat(Data["operatingCosts.range"]),
        chargingTime: parseFloat(Data["operatingCosts.chargingTime"]),
      },
      acquisition: { cost: parseFloat(Data["acquisition.cost"]) },
    };
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/tco`, newData)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Tco not added" + res.data.messagge);
        } else {
          message.success("Tco Added successfully");
          router.push("/tco/list");
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
      <Link href="/tco/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"TCO Add"}>
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
            name="vehicle"
            label={"Vehicle"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                vehicle: e.target.value,
              });
            }}
          >
            <Select placeholder="Select Vehicle Type" size="large">
              <Select.Option value="ICE">ICE</Select.Option>
              <Select.Option value="SVM">SVM</Select.Option>
              <Select.Option value="E2W">E2W</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="manufacturer"
            label={"Manufacturer"}
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
                  manufacturer: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="model"
            label={"Model"}
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
                  model: e.target.value,
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="vehicleClass"
            label={"Vehicle Class/Type"}
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
                  vehicleClass: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="topSpeed"
            label={"Top Speed (KMH)"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              type="number"
              onChange={(e) => {
                seTstate({
                  ...state,
                  topSpeed: e.target.value,
                });
              }}
            />
          </Form.Item>

          <Form.Item
            name="acceleration"
            label={"0-60 KMH (Sec)"}
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
                  acceleration: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label={"Release Date"}
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
                  releaseDate: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="battery_capacity"
            label={"Battery Capacity"}
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
                  battery_capacity: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Typography.Title
            level={5}
            style={{
              textAlign: "center",
              // fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Acquisition
          </Typography.Title>
          <Form.Item
            name="acquisition.cost"
            label={"Cost"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              type="number"
              onChange={(e) => {
                seTstate({
                  ...state,
                  acquisition: {
                    cost: parseFloat(e.target.value),
                  },
                });
              }}
            />
          </Form.Item>
          <Typography.Title
            level={5}
            style={{
              textAlign: "center",
              // fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Operating Costs (p.a.)
          </Typography.Title>
          <Form.Item
            name="operatingCosts.range"
            label={"Range/Charge or Litre"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              type="number"
              onChange={(e) => {
                seTstate({
                  ...state,
                  operatingCosts: {
                    ...state.operatingCosts,
                    range: parseFloat(e.target.value),
                  },
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="operatingCosts.chargingTime"
            label={"Charging time (to full)"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input
              type="number"
              onChange={(e) => {
                seTstate({
                  ...state,
                  operatingCosts: {
                    ...state.operatingCosts,
                    chargingTime: parseFloat(e.target.value),
                  },
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
