import { useState, useEffect } from "react";
import axios from "axios";
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
  Image,
  InputNumber,
  Upload,
  Button,
  Card,
  message,
  Radio,
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

const Default = ({ getData = [] }) => {
  const Editor = dynamic(() => import("../../app/components/Editor/index"));
  const intl = useIntl();
  const [form] = Form.useForm();
  const [state, seTstate] = useState(getData);
  const [displaySave, seTdisplaySave] = useState(true);
  const [tags, setTags] = useState([]);

  const [description, setDescription] = useState("");

  const [selectedWorkType, setSelectedWorkType] = useState(null);

  const handleWorkTypeChange = (value) => {
    setSelectedWorkType(value);
  };

  const handleChange = (value) => {
    setTags(value);
  };

  const handleChangeEditor = (value) => {
    // setTags(value);
    setDescription(value);
  };

  const [fields, seTfields] = useState(
    Object.entries(getData).map(([name, value]) => ({ name, value }))
  );
  console.log("fields", fields);
  const { id } = router.query;

  async function getDataFc() {
    await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/career/${id}`)
      .then((response) => {
        var output = response.data;
        seTstate(output);
        setSelectedWorkType(output.work_type);
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
    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/career/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Career Not Updated" + res.data.messagge);
        } else {
          message.success("Carrer Updated Successfully");

          router.push("/career/list");
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
      <Link href="/career/list">
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
        <Card className="card" title={"Career Edit"}>
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
            <Input placeholder="eg: Full Stack Developer - Project Alpha" />
          </Form.Item>

          <Form.Item
            name="work_type"
            label="Work Type"
            rules={[
              {
                required: true,
                message: "Please select the work type",
              },
            ]}
          >
            <Select onChange={handleWorkTypeChange}>
              <Select.Option value="Full-Time">Full-Time</Select.Option>
              <Select.Option value="Part-Time">Part-Time</Select.Option>
              <Select.Option value="Contract">Contract</Select.Option>
              <Select.Option value="Internship">Internship</Select.Option>
              <Select.Option value="Freelance">Freelance</Select.Option>
              <Select.Option value="Remote">Remote</Select.Option>
            </Select>
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
            <ReactQuill
              value={description}
              modules={modules}
              onChange={handleChangeEditor}
              style={{ height: "350px" }}
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

          <Form.Item
            name="salary_range"
            label={"Salary Range"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input placeholder="eg: 1000k - 2000k" />
          </Form.Item>

          <Form.Item
            name="city"
            label={"City"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input placeholder="coimbatore" />
          </Form.Item>
          <Form.Item
            name="state"
            label={"State"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input placeholder="Tamil Nadu" />
          </Form.Item>
          <Form.Item
            name="country"
            label={"Country"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input placeholder="India" />
          </Form.Item>

          <Form.Item
            name="isRemote"
            label="Is Remote?"
            rules={[
              {
                required: true,
                message: "Please select whether the job is remote or not",
              },
            ]}
          >
            <Radio.Group>
              <Radio value={true}>Remote</Radio>
              <Radio value={false}>Not Remote</Radio>
            </Radio.Group>
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
            <Button type="primary" htmlType="submit" disabled={!displaySave}>
              update
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
      `${process.env.NEXT_PUBLIC_API_URL}/career/` + query.id,
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
