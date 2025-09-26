import { useEffect } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Row,
  Col,
  Typography,
  Select,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../util/IntlMessages";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { switchLanguage, login_r, isAuthenticated_r } from "../redux/actions";
// import { languageData } from "../../config";
// import { languageData } from "../settings";

import AuthService from "../util/services/authservice";

const SignInPage = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(({ login }) => login);

  const { locale } = useSelector(({ settings }) => settings);

  useEffect(() => {
    if (isAuthenticated) {
      Router.push("/dashboard");
    }
  }, [isAuthenticated]);

  const onSubmit = (Data) => {
    AuthService.login(Data)
      .then((data) => {
        console.log("data", data);
        const { isAuthenticated, user } = data;
        // const { user } = data;
        dispatch(login_r(user));

        console.log("2fa enabled or not user", user.two_fa);
        if (user.two_fa) {
          Router.push("/2fa/validate");
          isAuthenticated_r(false);
        } else if (isAuthenticated) {
          dispatch(login_r(user));
          dispatch(isAuthenticated_r(true));

          Router.push("/dashboard");
          message.success("User Login successfully");
        } else {
          console.log("error", data.error.response.data.message);
          if (data.error.response.data.message) {
            message.error(data.error.response.data.message);
          } else {
            message.error(data.error.response.data + " Invalid Credentials");
          }
          Router.replace("/signin");
        }
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error);
          console.log(error.response);
          console.log(error.response.data);
          const errorMessage = error.response.data.message;
          message.error(errorMessage);
        } else if (error.request) {
          // The request was made but no response was received
          message.error("No response received from the server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error.message);
          message.error("An error occurred. Please try again later.");
        }
      });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col sm={6} offset={3} xs={18} className="my-5">
          <Typography.Title className="text-center mt-5">
            Login
          </Typography.Title>
          {/* <div level={5} className="text-center fs-10 mb-5"> */}
          {/* <div className="text-center fs-10 mb-5">Green Champion Register</div> */}
          <Form
            initialValues={{ remember: true }}
            onFinish={onSubmit}
            layout="vertical"
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.userAuth.The input is not valid E-mail!" />
                  ),
                },
              ]}
              name="username"
              label={<IntlMessages id="app.userAuth.E-mail" />}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: (
                    <IntlMessages id="app.userAuth.Please input your Password!" />
                  ),
                },
              ]}
              name="password"
              label={<IntlMessages id="app.userAuth.Password" />}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                className="mb-0 w-full"
                size="large"
                htmlType="submit"
              >
                <IntlMessages id="app.userAuth.signIn" />
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="link"
            className="float-left"
            onClick={() => Router.push("/forgotpassword")}
          >
            <IntlMessages id="app.userAuth.Forgot Password" />
          </Button>
          {/* <Button
            type="link"
            className="float-right"
            onClick={() => Router.push("/signup")}
          >
            <IntlMessages id="app.userAuth.Champion Register" />
          </Button> */}
          {/* <Select
            showSearch
            className="float-right w-30"
            defaultValue={JSON.stringify(locale)}
            bordered={false}
            filterOption={(input, option) =>
              option.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={(newValue) => {
              dispatch(switchLanguage(JSON.parse(newValue)));
            }}
          >
            {languageData.map((language) => (
              <Select.Option
                key={JSON.stringify(language)}
                value={JSON.stringify(language)}
              >
                {String(language.name)}
              </Select.Option>
            ))}
          </Select> */}
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
