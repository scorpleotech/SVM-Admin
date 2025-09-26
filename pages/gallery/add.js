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
  { val: "image", text: "Image" },
  { val: "video", text: "Video" },
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
  const [videoType, setVideoType] = useState("");
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

  const { user } = useSelector(({ login }) => login);
  const [form] = Form.useForm();

  const handleImageType = ({ target: { value } }) => {
    console.log("radio1 checked", value);
    setImageType(value);
  };

  const handleVideoType = ({ target: { value } }) => {
    console.log("radio1 checked", value);
    setVideoType(value);
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

  const checkImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const { width, height } = img;
          if (height === 720) {
            resolve(true);
          } else {
            message.error("Image height must be 720px");
            resolve(false);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (Data) => {
    let img_url = "";
    console.log("data = ", Data);
    if (Data.image != undefined) {
      const formData = new FormData();
      formData.append("image", Data?.image?.file?.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadFile`,
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
      file_name: "",
      url_type: "",
      file_url: "",
    };

    if (Data?.uploadtype === "image") {
      payload["file_url"] = img_url;
      payload["file_name"] = Data?.image?.file?.name;
    } else {
      // if (Data?.videotype === "youtube") {
      payload["url_type"] = "youtube";
      payload["file_url"] = Data?.url;
      payload["file_name"] = "This is youtube video";

      // } else {
      //   payload["file_url"] = img_url;
      //   payload["file_name"] = Data?.image?.file?.name;
      //   payload["url_type"] = Data?.videotype;

      // }
    }
    console.log("PAYLOAD =", payload);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, payload)
      .then((res) => {
        console.log("res", res);
        if (res?.response?.status == 400) {
          message.error(res?.response?.data?.messagge);
        } else {
          message.success("Added Successfully");
          router.push("/gallery/list");
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
      <Link href="/gallery/list">
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

          {imageType === "image" && (
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
                beforeUpload={async (file) => {
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
                  }
                  const isValidDimensions = await checkImageDimensions(file);
                  if (!isValidDimensions) {
                    seTdisplaySave(false);
                    return false;
                  }
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
          )}
          {imageType === "video" && (
            <>
              {/* <Form.Item
                name="videotype"
                label={"Video Type"}
                rules={[
                  {
                    required: true,
                    message: intl.messages["app.pages.common.pleaseFill"],
                  },
                ]}
              >
                <Radio.Group onChange={handleVideoType} value={videoType}>
                  {video_type.map((type) => (
                    <Radio value={type?.val} key={type?.val}>
                      {type?.text}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item> */}
              {videoType === "local" ? (
                <Form.Item
                  name="image"
                  label={"Video"}
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
                      const isJPG = file.type === "video/mp4";
                      if (!isJPG) {
                        message.error("Only video is accepted");
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
              ) : (
                <Form.Item
                  name="url"
                  label={"URL"}
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
              )}
            </>
          )}

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
