import { useState, useEffect } from "react";
import axios from "axios";
// import { API_URL } from "../../../config";
import router from "next/router";

import { Button, Card, message, Form, Input } from "antd";
import func from "../../util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import Link from "next/link";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [state, seTstate] = useState(getData);
  const [displaySave, seTdisplaySave] = useState(true);
  console.log("State", state);

  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );
  console.log("fields", fields);
  const { id } = router.query;

  async function getDataFc() {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`)
      .then((response) => {
        var output = response.data;
        seTstate(output);
        seTfields(
          Object.entries(output).map(([name, value]) => ({ name, value }))
        );
      });
  }

  // componentDidMount = useEffect
  useEffect(() => {
    getDataFc();
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

  const onSubmit = async (Data) => {
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Faq Not Updated" + res.data.messagge);
        } else {
          message.success("Faq Updated Successfully");

          router.push("/faq/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
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
        fields={fields}
        scrollToFirstError
      >
        <Card className="card" title={"FAQ Edit"}>
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
          <Form.Item className="float-right">
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              <span>update</span>
            </Button>
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
};

Default.getInitialProps = async ({ req, query }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/faq/` + query.id,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    return {
      getData: getData.data,
    };
  }
};

export default Default;
