import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Upload,
  Alert,
  Select,
  Button,
  Card,
  message,
  Divider,
  Form,
  Input,
} from "antd";
import Link from "next/link";

import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import { SketchPicker } from "react-color"; // Import SketchPicker from react-color

// const { ColorPicker } = antd;

const Default = () => {
  const intl = useIntl();

  const [state, seTstate] = useState({ colorCode: "#000", features: [] });
  const [displaySave, seTdisplaySave] = useState(true);
  const [models, setModels] = useState([]);
  const [fields, seTfields] = useState(
    Object.entries(state).map(([name, value]) => ({ name, value }))
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error.response.data.message);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (Data) => {
    if (Data.image != undefined) {
      // try {
      //   await validateImageSize(Data.image.file.originFileObj);
      // } catch (error) {
      //   message.error("Image size should be 1920x1080 without whitespaces");
      //   return;
      // }

      const formData = new FormData();
      formData.append("image", Data.image.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbikevarientimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["image"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["image"] = "";
    }

    if (Data.imageFront != undefined) {
      // try {
      //   await validateImageSize(Data.imageFront.file.originFileObj);
      // } catch (error) {
      //   message.error("Image size should be 1920x1080 without whitespaces");
      //   return;
      // }

      const formData = new FormData();
      formData.append("image", Data.imageFront.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbikevarientimage`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      Data["imageFront"] = dataImage.data.path.replace("../admin/public/", "/");
    } else {
      Data["imageFront"] = "";
    }

    if (Data.imageSide != undefined) {
      // try {
      //   await validateImageSize(Data.imageSide.file.originFileObj);
      // } catch (error) {
      //   message.error("Image size should be 1920x1080 without whitespaces");
      //   return;
      // }

      const formData = new FormData();
      formData.append("image", Data.imageSide.file.originFileObj);

      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbikevarientimage`,
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
          `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadbikevarientvideo`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        Data["video"] = response.data.path.replace("../admin/public/", "/");
      } catch (error) {
        console.error("Error uploading video:", error.response.data.message);
        message.error("Failed to upload video");
        return;
      }
    } else {
      Data["video"] = "";
    }

    Data["colorCode"] = state.colorCode;

    console.log("features data here", Data);

    console.log("final data that coming to the server", Data);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error(
            "Bike Variant Not Added Successfully" + res.data.messagge
          );
        } else {
          message.success("Bike Variant Added Successfully");
          router.push("/bikevarient/list");
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

  // Handler function to update selected color
  // Handler function to update selected color

  const handleColorChange = (color) => {
    const hexColor = color.hex.toString(); // Convert hex color to string
    seTstate({ ...state, colorCode: hexColor });
    console.log("hexColor", hexColor);
    console.log(typeof hexColor);
  };

  return (
    <div>
      <Link href="/bikevarient/list">
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
      <Card className="card" title={"Bike Variant Add"}>
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
            label="Select Category"
            name="category_id"
            rules={[{ required: true, message: "Please select a Category" }]}
          >
            <Select
              // onChange={handleModelChange}
              placeholder="Select a Category"
            >
              {models.map((model) => (
                <Select.Option key={model._id} value={model._id}>
                  {model.title}
                </Select.Option>
              ))}
            </Select>
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
            name="colorName"
            label={"Color Name"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
            onChange={(e) => {
              seTstate({
                ...state,
                colorName: e.target.value,
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
            name="imageFront"
            label={"Background Image"}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
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

export default Default;
