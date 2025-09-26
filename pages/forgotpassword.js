import { Button, Form, Input, message, Row, Col, Typography } from "antd";
// import { API_URL } from "../../config";
import IntlMessages from "../util/IntlMessages";
import router from "next/router";
import axios from "axios";
import { useIntl } from "react-intl";

const SignInPage = () => {
  const intl = useIntl();

  const onSubmit = (Data) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/users/forgotPassword`, Data)
      .then((res) => {
        console.log(res.status == 200);
        if (res.status !== 200) {
          message.error(intl.messages["app.userAuth.userNotFound"]);
        } else {
          console.log(res.data);
          message.success(res.data.message);

          router.push("/verifyotp");
        }
      })
      .catch((err) => {
        console.log("err", err.response.data);
        message.error(err.response.data);
      });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={6} offset={3} xs={18}>
          <Typography.Title className="text-center mt-5">SVM</Typography.Title>
          {/* <div level={5} className="text-center fs-10 mb-5"> */}
          <div className="text-center fs-10 mb-5">Forget Password</div>

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
              name="phone"
              label={"Phone"}
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
                Send OTP
              </Button>
            </Form.Item>
          </Form>
          <Button type="link" onClick={() => router.push("/signin")}>
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

export default SignInPage;
