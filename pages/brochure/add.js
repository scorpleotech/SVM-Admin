import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  InputNumber,
  Button,
  Card,
  Alert,
  message,
  Divider,
  Form,
  Input,
  Radio,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import { SketchPicker } from "react-color"; // Import SketchPicker from react-color
import Link from "next/link";

// const { ColorPicker } = antd;

const image_type = [
  { val: "brochure", text: "Brochure" },
  { val: "spec_sheet", text: "Spec Sheet" },
];
const video_type = [
  { val: "local", text: "Upload Video" },
  { val: "youtube", text: "Youtube URL" },
];

const Default = () => {
  const intl = useIntl();

  const [state, seTstate] = useState({ colorCode: "#000" });
  const [displaySave, seTdisplaySave] = useState(true);
  const [imageType, setImageType] = useState("");
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

  const { user } = useSelector(({ login }) => login);
  const [form] = Form.useForm();

  const handleImageType = ({ target: { value } }) => {
    console.log("radio1 checked", value);
    setImageType(value);
  };

  console.log("imageType =", imageType);
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
    let img_url = "";
    console.log("data = ", Data);
    if (Data.image != undefined) {
      const formData = new FormData();
      formData.append("image", Data?.image?.file?.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadBroucher`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("dataImage = ", dataImage);
      img_url = dataImage?.data?.path;
      // img_url = `/uploads/${dataImage?.data?.imagedetails?.filename}`;
    } else {
      img_url = "";
    }

    let payload = {
      title: Data?.title,
      file_type: Data?.uploadtype,
      file_name: Data?.image?.file?.name,
      file_url: img_url,
    };

    console.log("PAYLOAD =", payload);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/brochure`, payload)
      .then((res) => {
        console.log("res", res);
        if (res?.response?.status == 400) {
          message.error(res?.response?.data?.messagge);
        } else {
          message.success("Added Successfully");
          router.push("/brochure/list");
        }
      })
      .catch((err) => {
        console.log("err =", err);
        message.error(err?.response?.data?.message);
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
      <Link href="/brochure/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      {imageType === "image" && (
        <Alert
          className="mb-5"
          message="The image heigth should be 720px and width may be anything"
          type="warning"
          closable
          onClose={onClose}
        />
      )}
      <Card className="card" title={"Add Gallery"}>
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
            name="uploadtype"
            label={"Uplaod Type"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Radio.Group onChange={handleImageType} value={imageType}>
              {image_type.map((type) => (
                <Radio value={type.val} key={type.val}>
                  {type.text}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="title"
            label={intl.messages["app.pages.brands.title"]}
            // rules={[
            //   {
            //     required: true,
            //     message: intl.messages["app.pages.common.pleaseFill"],
            //   },
            // ]}
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
            label={"File"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Upload
              maxCount={1}
              beforeUpload={async (file) => {
                seTdisplaySave(true);
                return true;
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
