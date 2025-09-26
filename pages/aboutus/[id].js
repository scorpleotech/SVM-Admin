import { useState, useEffect } from "react";
import axios from "axios";
// import { API_URL, IMG_URL } from "../../../config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Image,
  InputNumber,
  Alert,
  Button,
  Card,
  message,
  Divider,
  Form,
  Input,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import Link from "next/link";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [state, seTstate] = useState(getData);
  const [displaySave, seTdisplaySave] = useState(true);
  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );

  const [form] = Form.useForm();
  const { id } = router.query;

  function getDataFc() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/aboutus/${id}`)
      .then((response) => {
        seTstate(response.data);
        seTfields(
          Object.entries(response.data).map(([name, value]) => ({
            name,
            value,
          }))
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

  const validateImageSize = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        if (this.width === 1920 && this.height === 1080) {
          resolve(true);
        } else {
          reject(false);
        }
      };
      img.onerror = function () {
        reject(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = async (Data) => {
    if (Data.image != undefined && state.image != Data.image) {
      // axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/upload/deleteaboutusimage`,
      //   {
      //     path: state.image,
      //   }
      // );

      // try {
      //   await validateImageSize(Data.image.file.originFileObj);
      // } catch (error) {
      //   message.error("Image size should be 1920x1080 without whitespaces");
      //   return;
      // }

      const formData = new FormData();
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadaboutusimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["image"] = dataImage.data.path.replace("../admin/public/", "/");
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/aboutus/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            "About us Not Updated" + res.error.response.data.message
          );
        } else {
          message.success("About us Updated");

          router.push("/aboutus/list");
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
  const onClose = (e) => {
    console.log(e, "I was closed.");
  };

  return (
    <div>
      <Link href="/aboutus/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Alert
        className="mb-5"
        message="Image size should be 1920x1080 pixels"
        type="info"
        closable
        onClose={onClose}
      />
      <Card className="card" title={"About Us Edit"}>
        <Form
          {...formItemLayout}
          form={form}
          name="add"
          onFinishFailed={onFinishFailed}
          onFinish={onSubmit}
          fields={fields}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label={"Name"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                name: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label={intl.messages["app.pages.brands.image"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Upload
              maxCount={1}
              accept="image/*"
              beforeUpload={(file) => {
                const isJPG =
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ||
                  file.type === "image/jpg" ||
                  file.type === "image/gif" ||
                  file.type === "image/webp" ||
                  file.type === "image/svg+xml";
                if (!isJPG) {
                  message.error(
                    "You can only upload JPEG, JPG, PNG, GIF, SVG, file!"
                  );
                  seTdisplaySave(false);
                  return false;
                } else {
                  seTdisplaySave(true);
                  return true;
                }
              }}
              showUploadList={{
                removeIcon: (
                  <DeleteOutlined onClick={() => seTdisplaySave(true)} />
                ),
              }}
            >
              <Button icon={<UploadOutlined />}>
                <IntlMessages id="app.pages.common.selectFile" />
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item name="image" label={"upload image"}>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + state.image}
              width={200}
            />
          </Form.Item>

          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              <span>update</span>
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

Default.getInitialProps = async ({ req, query }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/aboutus/` + query.id,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );
    const geTdataManipulate = getData.data;

    return { getData: geTdataManipulate };
  }
};

export default Default;
