import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import router from "next/router";
import dynamic from "next/dynamic";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Upload,
  Button,
  Card,
  message,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import func from "../../util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import Link from "next/link";

import "react-quill/dist/quill.snow.css"; // Import Quill styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Default = ({ getCategories = [] }) => {
  const Editor = dynamic(() => import("../../app/components/Editor/index"));
  const intl = useIntl();
  const [state, seTstate] = useState({ categories_id: null, type: 0 });
  const { user } = useSelector(({ login }) => login);
  const [displaySave, seTdisplaySave] = useState(true);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");

  const handleChange = (value) => {
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

  const handleChangeEditor = (value) => {
    // setTags(value);
    setDescription(value);
  };

  const onSubmit = async (Data) => {
    console.log("Data", Data);
    if (Data.image != undefined) {
      const formData = new FormData();
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadnewsimage`,
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
      .post(`${process.env.NEXT_PUBLIC_API_URL}/news`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("News Not Added");
        } else {
          message.success("News Added Successfully");

          router.push("/news/list");
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(err.response.data.message);
        s;
      });
  };

  return (
    <div>
      <Link href="/news/list">
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
        ]}
        scrollToFirstError
      >
        <Card className="card" title={"News Add"}>
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
            name="publishedBy"
            label={"PublishedBy"}
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
                  publishedBy: e.target.value,
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
            name="short_description"
            label="Short Description"
            rules={[
              {
                required: true,
                message: "Please enter a short description",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  short_description: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Url Path"
            rules={[
              {
                required: true,
                message: "Please enter a Url Path",
              },
            ]}
          >
            <Input
              onChange={(e) => {
                seTstate({
                  ...state,
                  slug: e.target.value,
                });
              }}
            />
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
            <ReactQuill
              value={description}
              modules={modules}
              onChange={handleChangeEditor}
              style={{ height: "350px" }}
            />
          </Form.Item>
          {/* published date */}

          <Form.Item
            label="Published Date"
            name="published_date"
            rules={[{ required: true, message: "Please enter Published Date" }]}
          >
            <DatePicker />
          </Form.Item>

          {/* 
          <Form.Item
            name="readingTime"
            label={"Reading Time"}
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
                  readingTime: e.target.value,
                });
              }}
            />
          </Form.Item>
          <Form.Item
            name="link"
            label={"News Link"}
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
                  link: e.target.value,
                });
              }}
            />
          </Form.Item> */}

          <Form.Item
            name="topic"
            label={"Topic"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Click Enter Topics"
              onChange={handleChange}
              value={tags}
            >
              {tags.map((tag, index) => (
                <Select.Option key={index} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="categories"
            label={"Categories"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Click Enter Categories"
              onChange={handleChange}
              value={tags}
            >
              {tags.map((tag, index) => (
                <Select.Option key={index} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label={"Tags"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Click Enter Tags"
              onChange={handleChange}
              value={tags}
            >
              {tags.map((tag, index) => (
                <Select.Option key={index} value={tag}>
                  {tag}
                </Select.Option>
              ))}
            </Select>
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
