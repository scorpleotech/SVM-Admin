import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  DatePicker,
  Image,
  Select,
  TimePicker,
} from "antd";
import axios from "axios";
import { useIntl } from "react-intl";
import moment from "moment";
import Link from "next/link";

const EditDemo = () => {
  const router = useRouter();
  const { id } = router.query;
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [cities, setCities] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [pincodes, setPincodes] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [demoData, setDemoData] = useState(null);
  const [selectedDealerId, setSelectedDealerId] = useState([]);

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

  useEffect(() => {
    if (id) {
      // Fetch demo data based on ID
      fetchDemoData(id);
    }
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/bikevarient`
        );

        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };
    const fetchStates = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/store/data`
        );
        // console.log("States", response.data);
        const uniqueCities = response.data.filter(
          (state, index, self) =>
            index === self.findIndex((s) => s.state === state.state)
        );
        setStates(uniqueCities);
        // setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchData();
    fetchStates();
  }, []);

  const handleStateChange = async (value) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/data?state=${value}`
      );
      // console.log("Cities", response.data);
      setSelectedState(value);
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleCityChange = async (value) => {
    try {
      // console.log("Value", value);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/data?state=${selectedState}&city=${value}`
      );
      setSelectedCity(value);
      setPincodes(response.data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };
  const handlePincodeChange = async (value) => {
    try {
      // console.log("Value", value);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/data?state=${selectedState}&city=${selectedCity}&pincode=${value}`
      );
      setDealers(response.data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    }
  };

  const fetchDemoData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/testdrive/${id}`
      );
      console.log("response for id ", response.data);
      if (response.status === 200) {
        setDemoData(response.data);
      }
    } catch (error) {
      console.error("Error fetching demo data:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    console.log("values", selectedDealerId);

    const updatedValues = { ...values, dealer_name: selectedDealerId };
    console.log("updatedValues", updatedValues);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/testdrive/${id}`,
        updatedValues
      );
      if (response.status === 200) {
        message.success("Demo Bokking Updated Successfully");
        // Redirect to demo list page
        router.push("/demo/list");
      }
    } catch (error) {
      message.error("Demo Booking Not Updated " + error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleDealerChange = (value) => {
    const selectedDealer = dealers.find((dealer) => dealer.name === value);

    const dealerId = selectedDealer._id;

    setSelectedDealerId(dealerId);
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
  };

  return (
    <div>
      <Link href="/demo/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Demo Booking Edit"}>
        {demoData && (
          <Form
            {...formItemLayout}
            name="editDemoForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            // layout="vertical"
            initialValues={{
              ...demoData,
              // Convert string dates to Moment objects
              booking_date: moment(demoData.booking_date),
              booking_time: moment(demoData.booking_time),
            }}
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
              label="Phone"
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

            <Form.Item label="State" name="state">
              <Select onChange={handleStateChange}>
                {states.map((state) => (
                  <Select.Option key={state._id} value={state.state}>
                    {state.state}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="City" name="city">
              <Select onChange={handleCityChange}>
                {cities.map((cities) => (
                  <Select.Option key={cities._id} value={cities.city}>
                    {cities.city}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Pincode" name="pincode">
              <Select onChange={handlePincodeChange}>
                {pincodes.map((pincodes) => (
                  <Select.Option key={pincodes._id} value={pincodes.pincode}>
                    {pincodes.pincode}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Dealer Name" name="dealer_name">
              <Select onChange={handleDealerChange}>
                {dealers.map((dealers) => (
                  <Select.Option key={dealers._id} value={dealers.name}>
                    {dealers.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Booking Date"
              name="booking_date"
              rules={[{ required: true, message: "Please enter Booking Date" }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              label="Booking Time"
              name="booking_time"
              rules={[{ required: true, message: "Please enter Booking Time" }]}
            >
              <TimePicker />
            </Form.Item>
            <Form.Item
              label="Booking Model"
              name="model"
              rules={[{ required: true, message: "Please select a Model" }]}
            >
              <Select onChange={handleModelChange} placeholder="Select a Model">
                {models.map((model) => (
                  <Select.Option key={model._id} value={model._id}>
                    {model.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedModel && (
              <Form.Item label="Image">
                <Image
                  src={
                    models.find((model) => model._id === selectedModel)?.image
                  }
                  alt="Model Image"
                  style={{ maxWidth: 200 }}
                />
              </Form.Item>
            )}

            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                update
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EditDemo;
