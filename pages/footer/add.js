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
// import ReactQuill from "react-quill"; // Import ReactQuill

import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Default = () => {
  const [description, setDescription] = useState("");
  const intl = useIntl();
  const [state, seTstate] = useState({ categories_id: null, type: 0 });
  const { user } = useSelector(({ login }) => login);
  const [displaySave, seTdisplaySave] = useState(true);
  const [tags, setTags] = useState([]);

  const handleChange = (value) => {
    setDescription(value);
    setTags(value);
  };

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

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"],
    ],
  };

  const onSubmit = async (Data) => {
    console.log("Data", Data);
    if (Data.image != undefined) {
      const formData = new FormData();
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbannerimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("dataImage", dataImage);
      Data["image"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["image"] = "";
    }
    console.log("Data", Data);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/footer`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Footer Not Added" + res.data.messagge);
        } else {
          message.success("Footer Added Successfully");

          router.push("/footer/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
      });
  };

  return (
    <div>
      <Link href="/footer/list">
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
        <Card className="card" title={"Footer Add"}>
          <Form.Item
            name="title"
            label={intl.messages["app.pages.common.title"]}
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
                  title: e.target.value,
                  seo: func.replaceSeoUrl(e.target.value),
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="image"
            label={intl.messages["app.pages.brands.image"]}
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
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please enter a description",
              },
            ]}
          >
            {/* Render the rich text editor */}
            <ReactQuill
              value={description}
              modules={modules}
              onChange={handleChange}
              style={{ height: "350px" }}
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

export default Default;
