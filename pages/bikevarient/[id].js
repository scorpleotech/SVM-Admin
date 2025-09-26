import { useState, useEffect } from "react";
import axios from "axios";
// import { API_URL, IMG_URL } from "../../../config";
import router from "next/router";
import {
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Upload,
  Image,
  InputNumber,
  Select,
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
import { SketchPicker } from "react-color"; // Import SketchPicker from react-color
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import Link from "next/link";

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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient/${id}`)
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );

        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchData();
  }, []);
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
    if (Data.image != undefined && state.image != Data.image) {
      // axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/upload/deletebikevarientimage`,
      //   {
      //     path: state.image,
      //   }
      // );

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
    }

    if (Data.imageFront != undefined && state.imageFront != Data.imageFront) {
      // axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/upload/deletebikevarientimage`,
      //   {
      //     path: state.imageFront,
      //   }
      // );

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
    }

    if (Data.imageSide != undefined && state.imageSide != Data.imageSide) {
      // axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/upload/deletebikevarientimage`,
      //   {
      //     path: state.imageSide,
      //   }
      // );

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
    }

    // Handle video upload if present
    if (Data.video != undefined && state.video != Data.video) {
      // axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/upload/deletebikevarientvideo`,
      //   {
      //     path: state.video,
      //   }
      // );

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

    Data["colorCode"] = state.colorCode;

    // // Extract features from form data
    // const features = Data.features.map((item) => item.features);

    // // Replace feature array in Data with the extracted features
    // Data["features"] = features;

    console.log("final data that coming to the server", Data);

    axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient/${id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Bike Variant Not Updated" + res.data.messagge);
        } else {
          message.success("Bike Variant Updated Successfully");

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
      <Card className="card" title={"Bike Variant Edit"}>
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
            onChange={(e) => {
              seTstate({
                ...state,
                charging_time: e.target.value,
              });
            }}
          >
            <Input placeholder="4.5 Kwh" />
          </Form.Item>
          <Form.Item
            name="charging_time"
            label={"Charging Time"}
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
            onChange={(e) => {
              seTstate({
                ...state,
                colorName: e.target.value,
              });
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item name="colorCode" label={"Color Code"}>
            <SketchPicker
              color={state.colorCode}
              onChange={handleColorChange} // Pass the handler function
            />
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
            name="image"
            label={intl.messages["app.pages.brands.uploatedImage"]}
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + state.image}
              width={200}
            />
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
          <Form.Item name="imageFront" label={"Background Image"}>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + state.imageFront}
              width={200}
            />
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
          <Form.Item name="imageSide" label={"Side Image"}>
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + state.imageSide}
              width={200}
            />
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
              update
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
