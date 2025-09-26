import { useState, useEffect } from "react";
import { Form, Input, Button, message, Typography, Card } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { login_r, logout_r, isAuthenticated_r } from "../../redux/actions";
import axios from "axios";
import Router from "next/router";

const { Paragraph } = Typography;

const TwoFactorValidate = () => {
  const { isAuthenticated, user } = useSelector(({ login }) => login);

  const [isValidationSuccess, setIsValidationSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/otp/validate`,
        {
          email: user.username, // Use the email from the Redux state
          token: values.otp,
        }
      );

      if (response.data.isAuthenticated) {
        setIsValidationSuccess(true);
        dispatch(login_r(response.data.user));
        dispatch(isAuthenticated_r(true));
        Router.push("/dashboard");
        message.success("Login Successfully.");
      } else {
        dispatch(logout_r());
        dispatch(isAuthenticated_r(false));
        message.error("Invalid OTP. Please try again.");
        Router.replace("/signin");
      }
    } catch (error) {
      dispatch(logout_r());
      dispatch(isAuthenticated_r(false));
      message.error("Error verifying OTP", error);
      console.error("Error verifying OTP:", error);
      Router.replace("/signin");
    }
  };

  // useEffect(() => {
  //   if (isValidationSuccess) {
  //     // Redirect to the dashboard
  //     Router.push("/dashboard");
  //   } else {
  //     // Clear Redux data and redirect to the login page
  //     dispatch(logout_r());
  //     Router.push("/signin");
  //   }
  // }, [isValidationSuccess]);

  return (
    <Card
      className="mx-auto text-center"
      style={{
        width: 350,
        marginTop: "50px",
      }}
    >
      <Typography.Title level={3} className="mt-5">
        Authentication code
      </Typography.Title>

      <Form
        onFinish={handleFormSubmit}
        layout="vertical"
        className="items-center"
      >
        <Form.Item
          className="mt-5"
          name="otp"
          rules={[
            {
              required: true,
              message:
                "Please enter the 6-digit code from your authenticator app!",
            },
          ]}
        >
          <Input prefix={<KeyOutlined />} placeholder="Enter 6-digit code" />
        </Form.Item>

        <Paragraph>
          Open your two-factor authenticator (TOTP) app or browser extension to
          view your authentication code.
        </Paragraph>

        <Form.Item>
          <Button type="primary" block htmlType="submit">
            Verify
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TwoFactorValidate;
