import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Select, Card, Form, Input, message } from "antd";
import axios from "axios";
import { useIntl } from "react-intl";
import Link from "next/link";

const EditDemo = () => {
  const router = useRouter();
  const { id } = router.query;
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [demoData, setDemoData] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch demo data based on ID
      fetchDemoData(id);
    }
  }, [id]);

  const fetchDemoData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/store/${id}`
      );
      if (response.status === 200) {
        setDemoData(response.data);
      }
    } catch (error) {
      console.error("Error fetching demo data:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/store/${id}`,
        values
      );
      if (response.status === 200) {
        message.success("Store Updated Successfully");
        // Redirect to demo list page
        router.push("/store/list");
      }
    } catch (error) {
      message.error(error.response.data.message);
      message.error("Store Not Updated");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Link href="/store/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Store Edit"}>
        {demoData && (
          <Form
            name="editStoreForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            initialValues={demoData}
          >
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item name="store_type" label={"Store Type"}>
              <Select>
                <Select.Option value="showroom">Showroom</Select.Option>
                <Select.Option value="service_center">
                  Service Center
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input />
            </Form.Item>
            <Form.Item
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
              label="phone"
              name="phone"
            >
              <Input />
            </Form.Item>
            <Form.Item name="email" label={"Email"}>
              <Input />
            </Form.Item>
            <Form.Item name="website" label={"Website"}>
              <Input />
            </Form.Item>
            <Form.Item name="map" label={"Map Link"}>
              <Input />
            </Form.Item>
            <Form.Item name="pincode" label={"Pincode"}>
              <Input type="number" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default EditDemo;
