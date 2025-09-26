// pages/2fa-setup.js
import { useState, useEffect } from "react";
import { Form, Input, Alert, Button, message, Typography, Divider } from "antd";
import {
  UserOutlined,
  KeyOutlined,
  SmileFilled,
  SmileOutlined,
} from "@ant-design/icons";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import axios from "axios";
import Router from "next/router";

const TwoFactorSetup = () => {
  const { Paragraph } = Typography;
  const { user } = useSelector(({ login }) => login);
  const [secretKey, setSecretKey] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isQrGenerated, setisQrGenerated] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const generateSecretKey = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/generateOTP`,
        {
          email: user.email,
        }
      );
      console.log("generate secret key response", response);
      setSecretKey(response.data.base32);
      setOtpauthUrl(response.data.otpauth_url);
      setisQrGenerated(true);
      setShowCodeInput(true);
      message.success("QR Code Generated");
    } catch (error) {
      message.error("Error generating secret key");
      console.error("Error generating secret key:", error);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/otp/verify`,
        {
          email: values.email,
          token: values.otp,
        }
      );

      // Add logic based on the verification response
      console.log("Verification response:", response.data);

      // Assuming verification is successful
      setIsSetupComplete(true);
      message.success("2FA Enabled Successfully");
    } catch (error) {
      message.error("Error verifying OTP", error);
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "auto ", marginTop: "20px" }}>
      {isSetupComplete ? (
        <>
          <Alert
            message="Two-Factor Authentication setup is complete!"
            description="Congratulations! You have successfully set up Two-Factor Authentication for your account. Your account is now more secure with an additional layer of protection."
            type="success"
            showIcon
          />
          <Button
            size="large"
            block
            className="mt-5"
            onClick={() => Router.push("/dashboard")}
          >
            Done
          </Button>
        </>
      ) : (
        <>
          <Typography.Title level={3} className="text-center mt-5">
            Setup authenticator app
          </Typography.Title>
          <Paragraph className="text-center text-xs">
            Authenticator apps and browser extensions like 1Password, Authy,
            Microsoft Authenticator, etc. generate one-time passwords that are
            used as a second factor to verify your identity when prompted during
            sign-in.
          </Paragraph>
          <Form onFinish={handleFormSubmit}>
            <Form.Item
              name="email"
              initialValue={user.email}
              rules={[{ required: true, message: "Please enter your email!" }]}
            >
              <Input prefix={<UserOutlined />} disabled placeholder="Email" />
            </Form.Item>
            {isQrGenerated && (
              <>
                <Paragraph level={5} className="text-sm ">
                  Scan the QR code Use an authenticator app or browser extension
                  to scan.
                </Paragraph>

                <QRCode className=" mt-5 mb-5" value={otpauthUrl} />

                <Paragraph className="text-sm mb-0">
                  You can use the Secret key to manually configure your
                  authenticator app.
                </Paragraph>
                <Typography.Title level={5} className="mb-5">
                  Secret Key:
                  <Paragraph
                    className="text-sm "
                    copyable={{
                      icon: [
                        <SmileOutlined key="copy-icon" />,
                        <SmileFilled key="copied-icon" />,
                      ],
                      tooltips: ["copy secret code", "secret code copied!!"],
                    }}
                  >
                    {secretKey}
                  </Paragraph>
                </Typography.Title>
              </>
            )}

            {showCodeInput ? (
              <Form.Item
                className="mt-5"
                name="otp"
                label="Verify the code from the app"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter the 6-digit code from your authenticator app!",
                  },
                ]}
              >
                <Input
                  prefix={<KeyOutlined />}
                  placeholder="Enter 6-digit code"
                />
              </Form.Item>
            ) : (
              <Form.Item>
                <Button type="primary" onClick={generateSecretKey}>
                  Generate Secret Key
                </Button>
              </Form.Item>
            )}
            {isQrGenerated && (
              <>
                <Form.Item className="mb-5">
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
          <Divider />
        </>
      )}
    </div>
  );
};

export default TwoFactorSetup;
