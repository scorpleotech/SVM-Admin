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
  Radio,
} from "antd";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

const image_type = [
  { val: "brochure", text: "Brochure" },
  { val: "spec_sheet", text: "Spec Sheet" },
];
const video_type = [
  { val: "local", text: "Upload Video" },
  { val: "youtube", text: "Youtube URL" },
];

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [state, seTstate] = useState(getData);
  const [displaySave, seTdisplaySave] = useState(true);
  const [imageType, setImageType] = useState("");
  const [videoType, setVideoType] = useState("");
  const [fileName, setFileName] = useState("");
  const [previewImg, setPreviewImg] = useState("");
  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );
  console.log("fields =", fields);
  const [form] = Form.useForm();
  const { id } = router.query;

  const handleImageType = ({ target: { value } }) => {
    console.log("radio1 checked", value);
    setImageType(value);
  };

  const handleVideoType = ({ target: { value } }) => {
    console.log("radio1 checked", value);
    setVideoType(value);
  };

  function getDataFc() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/brochure/${id}`)
      .then((response) => {
        console.log("response data =", response);
        seTstate(response.data);
        let { file_type, title, file_url, url_type, file_name } =
          response?.data;
        let obj = {
          uploadtype: file_type,
          title: title,
          image: file_url,
          videotype: url_type,
          url: file_url,
        };
        setImageType(file_type);
        setVideoType(url_type);
        setFileName(file_name);
        setPreviewImg(file_url);
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
    console.log("Data =", Data);

    let img_url = "";
    let img_name = fileName;
    if (Data?.file_url && typeof Data?.file_url !== "string") {
      // if (!Data?.file_url?.includes("upload")) {

      const formData = new FormData();
      formData.append("image", Data?.file_url?.file?.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadFile`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("dataImage dataImage =", dataImage);
      img_url = dataImage?.data?.path;

      img_name = Data?.image?.file?.name;
      // }
    } else {
      img_url = Data?.file_url;
    }

    let payload = {
      title: Data?.title,
      file_type: Data?.file_type,
      file_name: fileName,
      url_type: "",
      file_url: "",
    };
    console.log("Data?.uploadtype =", Data?.uploadtype);
    if (Data?.uploadtype === "image" || Data?.file_type === "image") {
      payload["file_url"] = img_url;
    } else {
      // if (Data?.url_type === "youtube") {
      payload["url_type"] = "youtube";
      payload["file_url"] = img_url;

      // } else {
      //   payload["file_url"] =  img_url;
      //   payload["url_type"] = Data?.url_type;

      // }
    }

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/brochure/${id}`, payload)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(err?.response?.data?.message);
        } else {
          message.success("Gallery Updated");

          router.push("/brochure/list");
        }
      })
      .catch((err) => {
        message.error(err?.response?.data?.message);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  const onClose = (e) => {
    console.log(e, "I was closed.");
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
            message.error("Image height must be 720px.");
            resolve(false);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div>
      {imageType === "image" && (
        <Alert
          className="mb-5"
          message="The image heigth should be 720px and width may be anything"
          type="warning"
          closable
          onClose={onClose}
        />
      )}
      <Card className="card" title={"Gallery Edit"}>
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
            name="file_type"
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

Default.getInitialProps = async ({ req, query }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const getData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/productbanner/` + query.id,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );
    const geTdataManipulate = getData.data;

    return { getData: geTdataManipulate };
  }
};

export default Default;
