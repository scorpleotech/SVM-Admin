import { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import Link from "next/link";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Image,
  Button,
  Card,
  message,
  Divider,
  Alert,
  Form,
  Input,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import "video-react/dist/video-react.css";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [state, seTstate] = useState(getData);
  const [displaySave, seTdisplaySave] = useState(true);
  const [models, setModels] = useState([]);
  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );

  const [form] = Form.useForm();
  const { id } = router.query;

  function getDataFc() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accessories/${id}`)
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

  const onSubmit = async (Data) => {
    if (Data.image != undefined && state.image != Data.image) {
      // axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/upload/deleteaccessoriesimage`,
      //   {
      //     path: state.image,
      //   }
      // );

      const formData = new FormData();
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadaccessoriesimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["image"] = dataImage.data.path.replace("../admin/public/", "/");
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/accessories/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            "Accessories Not Updated" + res.error.response.data.message
          );
        } else {
          message.success("Accessories Updated");

          router.push("/accessories/list");
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
      <Link href="/accessories/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Alert
        className="mb-5"
        message="Image size should be 1920x1080 pixels"
        type="info"
        closable
      />
      <Card className="card" title={"Accessories Edit"}>
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
            label={"Variant Name"}
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
            name="couponCode"
            label={"Coupon Code"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                couponCode: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label={"Price"}
            onChange={(e) => {
              seTstate({
                ...state,
                price: e.target.value,
              });
            }}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="image"
            label={intl.messages["app.pages.brands.image"]}
          >
            <Upload
              maxCount={1}
              accept=".jpeg,.png,.jpg,.gif"
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

          <Form.Item
            name="image"
            label={intl.messages["app.pages.brands.uploatedImage"]}
          >
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
      `${process.env.NEXT_PUBLIC_API_URL}/bikevarient/` + query.id,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );
    const geTdataManipulate = getData.data;

    return { getData: geTdataManipulate };
  }
};

export default Default;
