import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Switch,
  TreeSelect,
  InputNumber,
  Select,
  Upload,
  Button,
  Card,
  message,
  Divider,
  Form,
  Input,
} from "antd";
import func from "../../util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import Link from "next/link";

const Default = ({ getCategories = [] }) => {
  const intl = useIntl();
  const [state, seTstate] = useState({ categories_id: null });
  const [displaySave, seTdisplaySave] = useState(true);
  const fields = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));
  const [dataCategories, seTdataCategories] = useState([
    { label: intl.messages["app.pages.category.rootCategory"], value: null },
    ...getCategories,
  ]);
  const { user } = useSelector(({ login }) => login);
  const [form] = Form.useForm();

  const getDataCategory = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = func.getCategoriesTreeOptions(res.data);
          data.unshift({
            label: intl.messages["app.pages.category.rootCategory"],
            value: null,
          });
          seTdataCategories(data);
        }
      })
      .catch((err) => console.log(err));
  };

  // componentDidMount = useEffect
  useEffect(() => {
    getDataCategory();
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
    Data["created_user"] = { name: user.name, id: user.id };

    if (Data.image != undefined) {
      const formData = new FormData();
      console.log("Data", Data.image.file.originFileObj);
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadcategoriesimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["image"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["image"] = "";
    }

    if (Data.imageFront != undefined) {
      const formData = new FormData();
      formData.append("image", Data.imageFront.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadcategoriesimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["imageFront"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["imageFront"] = "";
    }

    if (Data.imageSide != undefined) {
      const formData = new FormData();
      formData.append("image", Data.imageSide.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadcategoriesimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["imageSide"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["imageSide"] = "";
    }

    // Handle video upload if present
    if (Data.video != undefined) {
      const formData = new FormData();
      formData.append("video", Data.video.file.originFileObj);

      try {
        // Upload video file to the server
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadcategoriesvideo`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // If video upload is successful, update Data object with the path
        Data["video"] = response.data.path.replace("../admin/public/", "/");
      } catch (error) {
        console.error("Error uploading video:", error);
        message.error("Failed to upload video");
        return; // Exit function if video upload fails
      }
    } else {
      // If video is not present, set empty string in Data
      Data["video"] = "";
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/categories`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Category Not Added" + res.data.messagge);
        } else {
          message.success("Category added successfully");

          router.push("/categories/list");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  return (
    <div>
      <Link href="/categories/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>

      <Card className="card" title={intl.messages["app.pages.category.add"]}>
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
            name="description"
            label={intl.messages["app.pages.common.description"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label={"Price"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
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
            name="modes"
            label={"Mode"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                modes: e.target.value,
              });
            }}
          >
            <Input placeholder="Eco, Normal. Sports &hyper" />
          </Form.Item>
          <Form.Item
            name="cluster"
            label={"Cluster"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                modes: e.target.value,
              });
            }}
          >
            <Input placeholder="Digital / Digital" />
          </Form.Item>
          <Form.Item
            name="emi_price"
            label={"Emi Price"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                emi_price: e.target.value,
              });
            }}
          >
            <Input placeholder="Emi starts at ₹2999" />
          </Form.Item>

          <Form.Item
            name="certified_range"
            label={"Certified Range"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                certified_range: e.target.value,
              });
            }}
          >
            <Input placeholder="151 km IDC" />
          </Form.Item>

          <Form.Item
            name="topSpeed"
            label={"Top Speed"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                topSpeed: e.target.value,
              });
            }}
          >
            <Input placeholder="123 km/h" />
          </Form.Item>

          <Form.Item
            name="torque"
            label={"Torque"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                torque: e.target.value,
              });
            }}
          >
            <Input placeholder="0 - 60 km/h < 4 sec" />
          </Form.Item>

          <Form.Item
            name="battery_capacity"
            label={"Battery Capacity"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                battery_capacity: e.target.value,
              });
            }}
          >
            <Input placeholder="4.5 Kwh" />
          </Form.Item>

          <Form.Item
            name="charging_time"
            label={"Charging Time"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                charging_time: e.target.value,
              });
            }}
          >
            <Input placeholder="5.5 Hrs" />
          </Form.Item>

          <Form.Item
            name="mileage"
            label={"Mileage"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                mileage: e.target.value,
              });
            }}
          >
            <Input placeholder="126 km drives on Single Charge" />
          </Form.Item>

          <Form.Item
            name="peek_power"
            label={"Peek Power"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                peek_power: e.target.value,
              });
            }}
          >
            <Input placeholder="11 KW" />
          </Form.Item>

          <Form.Item
            name="key_type"
            label={"Key Type"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                key_type: e.target.value,
              });
            }}
          >
            <Input placeholder="Digital Key" />
          </Form.Item>

          <Form.Item
            name="features"
            label="Features"
            rules={[
              {
                required: true,
                message: "Please enter feature",
              },
            ]}
          >
            <Form.List name="features">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...field}
                      key={field.key}
                      rules={[
                        {
                          required: true,
                          message: "Please enter feature or delete this field.",
                        },
                      ]}
                    >
                      <Input.Group compact>
                        <Form.Item name={[field.name, "features"]} noStyle>
                          <Input
                            placeholder="Enter feature"
                            style={{ width: "85%" }}
                          />
                        </Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => remove(field.name)}
                          style={{ width: "15%" }}
                        >
                          <DeleteOutlined />
                        </Button>
                      </Input.Group>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{ width: "100%" }}
                    >
                      <PlusOutlined /> Add feature
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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
              accept="image/*"
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
            name="imageFront"
            label={"Front Image"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Upload
              accept="image/*"
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
            name="imageSide"
            label={"Side Image"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Upload
              accept="image/*"
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

          <Form.Item name="video" label={"Product Video"}>
            <Upload
              maxCount={1}
              accept=".mp4, .mpeg, .quicktime" // Specify accepted file types
              beforeUpload={(file) => {
                const isVideo =
                  file.type === "video/mp4" ||
                  file.type === "video/mpeg" ||
                  file.type === "video/quicktime";

                if (!isVideo) {
                  message.error(intl.messages["app.pages.brands.onlyVideo"]);
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

    return { getCategories: getDataCategories.data };
  }
};

export default Default;
