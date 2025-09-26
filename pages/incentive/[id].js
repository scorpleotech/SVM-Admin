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
  DatePicker,
  TimePicker,
  Space,
} from "antd";

import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

import Link from "next/link";
import TextArea from "antd/lib/input/TextArea";
import { useSelector } from "react-redux";
import moment from "moment";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const { id } = router.query;

  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );

  const [state, seTstate] = useState([]);
  const { user } = useSelector(({ login }) => login);

  const { role } = user;

  const [form] = Form.useForm();
  const [trnDate, setTrnDate] = useState(null);

  function getDataFc() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/incentive/${id}`)
      .then((response) => {
        seTstate(response.data);
        setSelectedService(response.data.incentive_status);
        console.log("response", response);
        console.log("response", response.data.trndate);
        setTrnDate(new Date(response.data.trndate));
        seTfields(
          Object.entries(response.data).map(([name, value]) => ({
            name,
            value: name === "trndate" ? moment(value) : value,
          }))
        );
      });
  }

  const [selectedService, setSelectedService] = useState(null);
  const [values, setValues] = useState([]);

  async function getValueFc() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/values`
      );

      setValues(
        response.data.filter((value) => value.type === "incentive_status")
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleServiceChange = (value) => {
    setSelectedService(value);
  };

  // User role
  const userRole = user.rolename; // Replace this with the actual user role

  // Select options based on user role
  const selectOptions =
    userRole === "Admin"
      ? values
      : userRole === "ASM"
      ? values.filter(
          (value) =>
            value.value === "Under_Process" || value.value === "Reviewed"
        )
      : userRole === "HOD"
      ? values.filter(
          (value) =>
            value.value === "Reviewed" ||
            value.value === "Waiting_for_Approval" ||
            value.value === "Revised"
        )
      : userRole === "MD"
      ? values.filter(
          (value) =>
            value.value === "Waiting_for_Approval" ||
            value.value === "Rejected" ||
            value.value === "Approved" ||
            value.value === "Revised"
        )
      : userRole === "Accounts_Manager"
      ? values.filter(
          (value) =>
            value.value === "Approved" ||
            value.value === "Processed" ||
            value.value === "Revised"
        )
      : values.filter((value) => value.value === "Waiting_for_Approval");

  // componentDidMount = useEffect
  useEffect(() => {
    getDataFc();
    getValueFc();
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
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/incentive/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Incentive Not Updated" + res.data.messagge);
        } else {
          message.success("Incentive Updated Successfully");

          router.push("/incentive/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error("Incentive Not Updated" + res.data.messagge);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Link href="/incentive/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Incentive Edit"}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item name="ordernumber" label={"incentive Number"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item name="customer_name" label={"Customer Name"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item name="model" label={"Category Name"}>
            <Input readOnly bordered={false} />
          </Form.Item>
          <Form.Item name="category" label={"Bike Variant Name"}>
            <Input readOnly bordered={false} />
          </Form.Item>

          <Form.Item name="incentive_amount" label={"Incentive Amount"}>
            <Input />
          </Form.Item>

          <Form.Item
            name="incentive_status"
            label={"Incentive Status"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseSelect"],
                whitespace: true,
              },
            ]}
          >
            <Select onChange={handleServiceChange}>
              {selectOptions.map((value) => (
                <Select.Option key={value._id} value={value.value}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedService === "Processed" && (
            <>
              <Form.Item
                name="trn_id"
                label={"Transaction ID"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseSelect"],
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="trn_utr_number"
                label={"Transaction UTR number"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseSelect"],
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="trndate"
                label={"Transaction Date"}
                rules={[
                  { required: true, message: "Please enter Published Date" },
                ]}
              >
                <DatePicker
                  // onChange={handleDateChange}
                  showTime={{
                    defaultValue: moment("00:00:00", "HH:mm:ss"),
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
              <Form.Item
                name="txn_details"
                label={"Fill the transaction details"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseSelect"],
                    whitespace: true,
                  },
                ]}
              >
                <TextArea />
              </Form.Item>
            </>
          )}

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
