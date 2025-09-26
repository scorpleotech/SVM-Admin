import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import dynamic from "next/dynamic";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Tag,
  TreeSelect,
  InputNumber,
  Upload,
  Button,
  Card,
  message,
  Divider,
  Col,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import func from "../../util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import Link from "next/link";

const Default = ({ getCategories = [] }) => {
  const intl = useIntl();
  const [state, seTstate] = useState({ categories_id: null, type: 0 });
  const { user } = useSelector(({ login }) => login);
  const [displaySave, seTdisplaySave] = useState(true);

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
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const onSubmit = async (Data) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/faq`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Faq Not Added " + res.data.messagge);
        } else {
          message.success("Faq Added Successfully");

          router.push("/faq/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };

  return (
    <div>
      <Link href="/faq/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Form
        {...formItemLayout}
        form={form}
        name="add"
        onFinishFailed={onFinishFailed}
        onFinish={onSubmit}
        fields={[
          {
            name: "title",
            value: state.title,
          },

          {
            name: "description",
          },
        ]}
        scrollToFirstError
      >
        <Card className="card" title={"FAQ Add"}>
          <Form.Item
            name="question"
            label={"question"}
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
                  question: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="answer"
            label={"answer"}
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
                  answer: e.target.value,
                });
              }}
            />
          </Form.Item>
        </Card>

        <Card className="card">
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

Default.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getDataCategories = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );
    const geTdataCategoriesManipulate = [];
    if (getDataCategories.data.length > 0) {
      geTdataCategoriesManipulate.push(
        func.getCategoriesTreeOptions(getDataCategories.data, true)
      );
    }
    return { getCategories: geTdataCategoriesManipulate };
  }
};

export default Default;
