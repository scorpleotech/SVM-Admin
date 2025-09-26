import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Button,
  Card,
  message,
  Divider,
  Form,
  Input,
  Alert,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import { SketchPicker } from "react-color";

import Link from "next/link";

const Default = () => {
  const intl = useIntl();

  const [state, seTstate] = useState({ colorCode: "#000" });
  const [displaySave, seTdisplaySave] = useState(true);
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

  const { user } = useSelector(({ login }) => login);
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
    if (Data.image != undefined) {
      const formData = new FormData();
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbannerimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Data["image"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["image"] = "";
    }
    if (Data.imageSmall != undefined) {
      // try {
      //   await validateImageSize(Data.image.file.originFileObj);
      // } catch (error) {
      //   message.error("Image size should be 1920x1080 without whitespaces");
      //   return;
      // }
      const formData = new FormData();
      formData.append("image", Data.imageSmall.file.originFileObj);

      const dataimageSmall = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbannerimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Data["imageSmall"] = dataimageSmall.data.path.replace(
        "../admin/public/",
        "/"
      );
    } else {
      Data["smallImage"] = "";
    }
    Data["colorCode"] = state.colorCode;

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/banner`, Data)
      .then((res) => {
        console.log("Response from the bakend", res);
        if (res.data.variant == "error") {
          message.error("Banner Added Failed" + res.data.messagge);
        } else {
          message.success("Banner Edited Success");
          router.push("/banner/list");
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
        message.error(err.response.data.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  // Handler function to update selected color
  // Handler function to update selected color
  const handleColorChange = (color) => {
    const hexColor = color.hex.toString(); // Convert hex color to string
    seTstate({ ...state, colorCode: hexColor });
    console.log("hexColor", hexColor);
    console.log(typeof hexColor);
  };
  const onClose = (e) => {
    console.log(e, "I was closed.");
  };

  return (
    <div>
      <Link href="/banner/list">
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
      <Card className="card" title={"Banner Add"}>
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
            label={intl.messages["app.pages.brands.title"]}
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
            name="colorCode"
            label={"Color Code"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <SketchPicker
              color={state.colorCode}
              onChange={handleColorChange} // Pass the handler function
            />
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
              beforeUpload={(file) => {
                const isJPG =
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ||
                  file.type === "image/jpg" ||
                  file.type === "image/gif" ||
                  file.type === "image/webp" ||
                  file.type === "image/svg+xml";
                if (!isJPG) {
                  message.error(intl.messages["app.pages.brands.onlyImage"]);
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
            name="imageSmall"
            label={"Image Small"}
            // rules={[
            //   {
            //     required: true,
            //     message: intl.messages["app.pages.common.pleaseFill"],
            //   },
            // ]}
          >
            <Upload
              maxCount={1}
              beforeUpload={(file) => {
                const isJPG =
                  file.type === "image/jpeg" ||
                  file.type === "image/png" ||
                  file.type === "image/jpg" ||
                  file.type === "image/gif" ||
                  file.type === "image/webp" ||
                  file.type === "image/svg+xml";
                if (!isJPG) {
                  message.error("Only Image is allowed");
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
          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              <IntlMessages id="app.pages.common.save" />
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Default;
