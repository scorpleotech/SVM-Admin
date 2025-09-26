import { Button, Form, Input, message, Row, Col, Typography } from "antd";
// import { API_URL } from "../../config";
import IntlMessages from "../util/IntlMessages";
import Router from "next/router";
import axios from "axios";
import { useIntl } from "react-intl";

const VerifyOtp = () => {
  const intl = useIntl();

  const onSubmit = (Data) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/agent/verify/otp`, Data)
      .then((res) => {
        if (res.status !== 200) {
          message.error(intl.messages["app.userAuth.userNotFound"]);
        } else {
          console.log("Error here", res.data);
          message.success("Password Changed Successfully, Check your email");
          Router.push("/signin");
        }
      })
      .catch((err) => {
        console.log("err", err);
        message.error(err.response.data.message);
      });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={6} offset={3} xs={18}>
          <Typography.Title className="text-center mt-5">SVM</Typography.Title>
          {/* <div level={5} className="text-center fs-10 mb-5"> */}
          <div className="text-center fs-10 mb-5">Verify OTP</div>

          <Form
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            layout="vertical"
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: intl.messages["app.pages.common.inputNotValid"],
                },
              ]}
              name="otp"
              label={"Enter OTP"}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="mb-0 w-full"
                size="large"
                htmlType="submit"
              >
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
          <Button type="link" onClick={() => Router.push("/signin")}>
            <IntlMessages id="app.userAuth.signIn" />
          </Button>
        </Col>
        <Col sm={3} xs={0} />

        <Col sm={12} xs={24}>
          <div className="loginBanner"></div>
        </Col>
      </Row>
    </>
  );
};

export default VerifyOtp;
