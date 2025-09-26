import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Card, Form, Input, message } from "antd";
import axios from "axios";
import { useIntl } from "react-intl";

import Link from "next/link";

const EditVisitus = () => {
  const router = useRouter();
  const { id } = router.query;
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [visitusData, setVisitusData] = useState(null);
  const [state, seTstate] = useState({});

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
      // Fetch visitus data based on ID
      fetchVisitusData(id);
    }
  }, [id]);

  const fetchVisitusData = async (id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/visitus/${id}`
      );
      if (response.status === 200) {
        setVisitusData(response.data);
      }
    } catch (error) {
      console.error("Error fetching visitus data:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/visitus/${id}`,
        values
      );
      if (response.status === 200) {
        message.success("Visitus Updated Successfully");
        // Redirect to visitus list page
        router.push("/visitus/list");
      }
    } catch (error) {
      message.error(error.response.data.message);
      message.error("Visitus Not Updated");
    } finally {
      setLoading(false);
    }
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
      <Card className="card" title={"Visit Us Edit"}>
        {visitusData && (
          <Form
            {...formItemLayout}
            name="editVisitusForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={visitusData}
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
              label="Location"
              name="location"
              rules={[{ required: true, message: "Please enter location" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Contact Address"
              name="contact_address"
              rules={[
                { required: true, message: "Please enter contact address" },
              ]}
            >
              <Input />
            </Form.Item> */}

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

export default EditVisitus;
