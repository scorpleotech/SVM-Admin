import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import router from "next/router";
import { DeleteOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";

import {
  Upload,
  Button,
  Card,
  message,
  Modal,
  Divider,
  Popconfirm,
  Checkbox,
  Form,
  Input,
  Select,
} from "antd";

import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import Link from "next/link";

const Default = () => {
  const intl = useIntl();

  const { id } = router.query;
  const { user } = useSelector(({ login }) => login);

  const [state, seTstate] = useState({
    role: {
      staffonlyyou: true,
      "staff/add": false,
      "staff/id": true,
      "staff/list": false,
      staffdelete: false,
      staffview: true,

      dealeronlyyou: false,
      "dealer/add": false,
      "dealer/id": false,
      "dealer/list": false,
      "dealer/delete": false,
      dealerview: false,

      categoriesonlyyou: false,
      "categories/add": true,
      "categories/id": true,
      "categories/list": true,
      "categories/delete": true,
      categoriesview: true,

      bikevarientonlyyou: false,
      "bikevarient/add": true,
      "bikevarient/id": true,
      "bikevarient/list": true,
      "bikevarient/delete": true,
      bikevarientview: true,

      uploadcontentonlyyou: false,
      "uploadcontent/add": true,
      "uploadcontent/id": true,
      "uploadcontent/list": true,
      "uploadcontent/delete": true,
      uploadcontentview: true,

      testimonialonlyyou: false,
      "testimonial/add": true,
      "testimonial/id": true,
      "testimonial/list": true,
      "testimonial/delete": true,
      testimonialview: true,

      banneronlyyou: false,
      "banner/add": true,
      "banner/id": true,
      "banner/list": true,
      "banner/delete": true,
      bannerview: true,

      partneronlyyou: false,
      "partner/add": true,
      "partner/id": true,
      "partner/list": true,
      "partner/delete": true,
      partnerview: true,

      aboutusonlyyou: false,
      "aboutus/add": true,
      "aboutus/id": true,
      "aboutus/list": true,
      "aboutus/delete": true,
      aboutusview: true,

      productbanneronlyyou: false,
      "productbanner/add": true,
      "productbanner/id": true,
      "productbanner/list": true,
      "productbanner/delete": true,
      productbannerview: true,

      faqonlyyou: false,
      "faq/add": true,
      "faq/id": true,
      "faq/list": true,
      "faq/delete": true,
      faqview: true,

      storeonlyyou: false,
      "store/add": true,
      "store/id": true,
      "store/list": true,
      "store/delete": true,
      storeview: true,

      incentiveonlyyou: false,
      "incentive/add": false,
      "incentive/id": false,
      "incentive/list": false,
      "incentive/delete": false,
      incentiveview: false,

      accessoriesonlyyou: false,
      "accessories/add": true,
      "accessories/id": true,
      "accessories/list": true,
      "accessories/delete": true,
      accessoriesview: true,

      visitusonlyyou: false,
      "visitus/add": true,
      "visitus/id": true,
      "visitus/list": true,
      "visitus/delete": true,
      visitusview: true,

      demoonlyyou: false,
      "demo/add": true,
      "demo/id": true,
      "demo/list": true,
      "demo/delete": true,
      demoview: true,

      blogsonlyyou: false,
      "blogs/add": true,
      "blogs/id": true,
      "blogs/list": true,
      "blogs/delete": true,
      blogsview: true,

      eventonlyyou: false,
      "event/add": true,
      "event/id": true,
      "event/list": true,
      "event/delete": true,
      eventview: true,

      newsonlyyou: false,
      "news/add": true,
      "news/id": true,
      "news/list": true,
      "news/delete": true,
      newsview: true,

      enquiryonlyyou: false,
      "enquiry/add": true,
      "enquiry/id": true,
      "enquiry/list": true,
      "enquiry/delete": true,
      enquiryview: true,

      incentiveonlyyou: false,
      "incentive/add": false,
      "incentive/id": false,
      "incentive/list": false,
      "incentive/delete": false,
      incentiveview: false,

      customersonlyyou: false,
      "customers/add": true,
      "customers/id": true,
      "customers/list": true,
      "customers/delete": true,
      customersview: true,
    },
  });
  console.log("enable 2fa", user);
  const [enable2fa, setEnable2fa] = useState(user.two_fa);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fields = Object.entries(state).map(([name, value]) => ({
    name,
    value,
  }));

  const [fileList, setFileList] = useState([]);
  const onChangeImage = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreviewImage = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const deleteImage = (file) => {
    console.log(file);
    console.log(fileList[0]);
  };

  const [form] = Form.useForm();

  function getUserData() {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`)
      .then((response) => {
        seTstate({ ...response.data, password: "" });
        if (response.data.image) {
          setFileList([
            {
              uid: "-1",
              url: response.data.image,
            },
          ]);
        }
      });
  }

  const [values, setValues] = useState([]);
  const [selectedService, setSelectedService] = useState([]);

  async function getDataFc() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/values`
      );
      console.log(response.data);
      setValues(response.data.filter((value) => value.type === "role"));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    getDataFc();
  }, []);

  const handleServiceChange = (value) => {
    setSelectedService(value);
  };

  function updatePassword(_id, password) {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/updatePasswordSuperadmin`,
        { _id, password }
      )
      .then((res) => {
        if (res.data.variant == "success") {
          message.success(intl.messages["app.pages.staff.updated"]);
        } else {
          message.error(
            intl.messages["app.pages.staff.notUpdated"] + res.data.messagge
          );
        }
      })
      .catch((err) => console.log(err));
  }

  // componentDidMount = useEffect
  useEffect(() => {
    getUserData();
  }, []);

  const deleteData = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/staff/${state._id}`)
      .then((res) => {
        message.warning(res.data.messagge);

        router.push("/staff/list");
      });
  };

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

  const disable2FactorAuthentication = async () => {
    try {
      // Make a POST request to disable 2FA
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/otp/disable`,
        {
          email: state.email,
        }
      );
      setEnable2fa(false);
      setIsModalOpen(false);
      // Handle the response
      console.log("Response:", response.data);
      message.success(intl.messages["app.pages.disble2fa"]);
      // Add any additional logic or state updates as needed
    } catch (error) {
      // Handle errors
      message.error(intl.messages["app.pages.error.disble2fa"] + error);
      console.error("Error disabling 2FA:", error);

      // Add any error handling or state updates as needed
    }
  };

  const onSubmit = async (Data) => {
    Data["created_user"] = { name: user.name, id: user.id };

    if (Data.role["superadmin"]) {
      Data["role"] = state.role;
    }

    if (Data.password != "") {
      updatePassword(state._id, Data.password);
    }

    delete Data.password;

    // if (fileList[0]?.url != state.image) {
    //   axios
    //     .post(`${API_URL}/upload/deletestaffavatar`, { path: state.image })
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => console.log(err));
    // }
    if (fileList.length > 0) {
      if (fileList[0].thumbUrl) {
        const dataImage = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadstaffavatar`,
          fileList
        );
        Data["image"] = dataImage.data.replace("../admin/public/", "/");
      } else if (state.image) {
        Data["image"] = state.image;
      }
    } else {
      Data["image"] = "";
    }
    console.log("Data", Data);
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/staff/${state._id}`, Data)
      .then((res) => {
        if (res.data.variant == "error") {
          message.error("Staff Not Updated" + res.data.messagge);
        } else {
          message.success("Staff Updated Successfully");

          router.push("/staff/list");
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

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Select.Option value="90">+90</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <div>
      <Link href="/staff/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title="Staff Edit">
        {/* {user.role["staffdelete"] ? (
            <Popconfirm
              placement="left"
              title={'Are you sure you want to delete "' + record.name + '"?'}
              onConfirm={() => deleteData()}
            >
              <a>
                <DeleteOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />{" "}
              </a>
            </Popconfirm>
          ) : (
            ""
          )} */}
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
            name="email"
            label={intl.messages["app.pages.common.email"]}
            rules={[
              {
                type: "email",
                message:
                  intl.messages["app.userAuth.The input is not valid E-mail!"],
              },
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={intl.messages["app.pages.common.password"]}
            rules={[
              {
                message:
                  intl.messages["app.userAuth.Please input your Password!"],
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm"
            label={intl.messages["app.pages.common.confirmPassword"]}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                message: intl.messages["app.pages.common.confirmPassword"],
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    intl.messages["app.pages.customers.passwordNotMatch"]
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="name"
            label={intl.messages["app.pages.common.name"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label={intl.messages["app.pages.common.phone"]}
            rules={[
              {
                required: true,
                message: intl.messages["app.pages.common.pleaseFill"],
              },
              {
                pattern: /^[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input name="phone" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="image"
            label={"Avatar " + intl.messages["app.pages.common.image"]}
          >
            <ImgCrop rotate quality={1} grid={true}>
              <Upload
                name="photo"
                listType="picture-card"
                fileList={fileList}
                onChange={onChangeImage}
                onPreview={onPreviewImage}
                maxCount={1}
                onRemove={deleteImage}
              >
                {fileList.length < 1 && "+ Upload"}
              </Upload>
            </ImgCrop>
          </Form.Item>
          <Form.Item label={intl.messages["app.pages.common.enable2fa"]}>
            {enable2fa ? (
              <>
                <Button
                  onClick={showModal}
                  {...tailFormItemLayout}
                  type="primary"
                >
                  Disable 2FA
                </Button>
                <Modal
                  title="Are you sure you want to disable two-factor authentication?"
                  open={isModalOpen}
                  onOk={disable2FactorAuthentication}
                  onCancel={handleCancel}
                >
                  <p>
                    Two-factor authentication adds an additional layer of
                    security to your account by requiring more than just a
                    password to sign in.
                  </p>
                  <p>
                    We highly recommends that you keep two-factor authentication
                    enabled on your account. If you need to change your
                    configuration, or generate new recovery codes, you can do
                    that in the settings below.
                  </p>
                </Modal>
              </>
            ) : (
              <Button
                type="primary"
                onClick={() => router.push("/2fa/setup")}
                {...tailFormItemLayout}
              >
                Enable 2FA
              </Button>
            )}
          </Form.Item>
          <Form.Item
            name="rolename"
            label="Role Name"
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
          >
            <Select onChange={handleServiceChange}>
              {console.log("values", values)}
              {values.map((value) => (
                <Select.Option key={value._id} value={value.value}>
                  {value.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {user?.role?.superadmin ? (
            <Form.Item
              label={intl.messages["app.pages.staff.premissions"]}
              name="role"
            >
              <IntlMessages id="app.pages.staff.staff" />
              <Divider />
              <Checkbox
                value={state.role["staffview"]}
                checked={state.role["staffview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["staffview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["staffonlyyou"] = false;
                    deg["staff/list"] = false;
                    deg["staff/add"] = false;
                    deg["staff/id"] = false;
                    deg["staffdelete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["staffonlyyou"]}
                checked={state.role["staffonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["staffonlyyou"] = e.target.checked;
                  deg["staff/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["staff/list"]}
                checked={state.role["staff/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["staff/list"] = e.target.checked;
                  deg["staffonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["staff/add"]}
                checked={state.role["staff/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["staff/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["staff/id"]}
                checked={state.role["staff/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["staff/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["staffdelete"]}
                checked={state.role["staffdelete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["staffdelete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Categories</span>
              <Divider />
              <Checkbox
                value={state.role["categoriesview"]}
                checked={state.role["categoriesview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["categoriesview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["categoriesonlyyou"] = false;
                    deg["categories/list"] = false;
                    deg["categories/add"] = false;
                    deg["categories/id"] = false;
                    deg["categoriesdelete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["categoriesonlyyou"]}
                checked={state.role["categoriesonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["categoriesonlyyou"] = e.target.checked;
                  deg["categories/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["categories/list"]}
                checked={state.role["categories/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["categories/list"] = e.target.checked;
                  deg["categoriesonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["categories/add"]}
                checked={state.role["categories/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["categories/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["categories/id"]}
                checked={state.role["categories/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["categories/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["categoriesdelete"]}
                checked={state.role["categoriesdelete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["categoriesdelete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Incentive</span>
              <Divider />
              <Checkbox
                value={state.role["incentiveview"]}
                checked={state.role["incentiveview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentiveview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["incentiveonlyyou"] = false;
                    deg["incentive/list"] = false;
                    deg["incentive/add"] = false;
                    deg["incentive/id"] = false;
                    deg["incentive/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["incentiveonlyyou"]}
                checked={state.role["incentiveonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentiveonlyyou"] = e.target.checked;
                  deg["incentive/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/list"]}
                checked={state.role["incentive/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/list"] = e.target.checked;
                  deg["incentiveonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/add"]}
                checked={state.role["incentive/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/id"]}
                checked={state.role["incentive/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/delete"]}
                checked={state.role["incentive/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Bike Varient</span>
              <Divider />
              <Checkbox
                value={state.role["bikevarientview"]}
                checked={state.role["bikevarientview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bikevarientview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["bikevarientonlyyou"] = false;
                    deg["bikevarient/list"] = false;
                    deg["bikevarient/add"] = false;
                    deg["bikevarient/id"] = false;
                    deg["bikevarient/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["bikevarientonlyyou"]}
                checked={state.role["bikevarientonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bikevarientonlyyou"] = e.target.checked;
                  deg["bikevarient/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["bikevarient/list"]}
                checked={state.role["bikevarient/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bikevarient/list"] = e.target.checked;
                  deg["bikevarientonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["bikevarient/add"]}
                checked={state.role["bikevarient/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bikevarient/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["bikevarient/id"]}
                checked={state.role["bikevarient/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bikevarient/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["bikevarient/delete"]}
                checked={state.role["bikevarient/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bikevarient/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Upload Contents</span>
              <Divider />
              <Checkbox
                value={state.role["uploadcontentview"]}
                checked={state.role["uploadcontentview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["uploadcontentview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["uploadcontentonlyyou"] = false;
                    deg["uploadcontent/list"] = false;
                    deg["uploadcontent/add"] = false;
                    deg["uploadcontent/id"] = false;
                    deg["uploadcontent/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["uploadcontentonlyyou"]}
                checked={state.role["uploadcontentonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["uploadcontentonlyyou"] = e.target.checked;
                  deg["uploadcontent/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["uploadcontent/list"]}
                checked={state.role["uploadcontent/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["uploadcontent/list"] = e.target.checked;
                  deg["uploadcontentonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["uploadcontent/add"]}
                checked={state.role["uploadcontent/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["uploadcontent/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["uploadcontent/id"]}
                checked={state.role["uploadcontent/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["uploadcontent/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["uploadcontent/delete"]}
                checked={state.role["uploadcontent/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["uploadcontent/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>{" "}
              <br />
              <br />
              <br />
              <span>Order</span>
              <Divider />
              <Checkbox
                value={state.role["ordersview"]}
                checked={state.role["ordersview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["ordersview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["orderonlyyou"] = false;
                    deg["orders/list"] = false;
                    deg["orders/add"] = false;
                    deg["orders/id"] = false;
                    deg["orders/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["orderonlyyou"]}
                checked={state.role["orderonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["orderonlyyou"] = e.target.checked;
                  deg["orders/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["orders/list"]}
                checked={state.role["orders/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["orders/list"] = e.target.checked;
                  deg["orderonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["orders/add"]}
                checked={state.role["orders/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["orders/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["orders/id"]}
                checked={state.role["orders/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["orders/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["orders/delete"]}
                checked={state.role["orders/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["orders/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Testimonial</span>
              <Divider />
              <Checkbox
                value={state.role["testimonialview"]}
                checked={state.role["testimonialview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["testimonialview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["testimonialonlyyou"] = false;
                    deg["testimonial/list"] = false;
                    deg["testimonial/add"] = false;
                    deg["testimonial/id"] = false;
                    deg["testimonial/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["testimonialonlyyou"]}
                checked={state.role["testimonialonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["testimonialonlyyou"] = e.target.checked;
                  deg["testimonial/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["testimonial/list"]}
                checked={state.role["testimonial/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["testimonial/list"] = e.target.checked;
                  deg["testimonialonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["testimonial/add"]}
                checked={state.role["testimonial/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["testimonial/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["testimonial/id"]}
                checked={state.role["testimonial/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["testimonial/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["testimonial/delete"]}
                checked={state.role["testimonial/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["testimonial/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Banner</span>
              <Divider />
              <Checkbox
                value={state.role["bannerview"]}
                checked={state.role["bannerview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["bannerview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["banneronlyyou"] = false;
                    deg["banner/list"] = false;
                    deg["banner/add"] = false;
                    deg["banner/id"] = false;
                    deg["banner/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["banneronlyyou"]}
                checked={state.role["banneronlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["banneronlyyou"] = e.target.checked;
                  deg["banner/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["banner/list"]}
                checked={state.role["banner/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["banner/list"] = e.target.checked;
                  deg["banneronlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["banner/add"]}
                checked={state.role["banner/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["banner/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["banner/id"]}
                checked={state.role["banner/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["banner/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["banner/delete"]}
                checked={state.role["banner/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["banner/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Partner</span>
              <Divider />
              <Checkbox
                value={state.role["partnerview"]}
                checked={state.role["partnerview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["partnerview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["partneronlyyou"] = false;
                    deg["partner/list"] = false;
                    deg["partner/add"] = false;
                    deg["partner/id"] = false;
                    deg["partner/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["partneronlyyou"]}
                checked={state.role["partneronlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["partneronlyyou"] = e.target.checked;
                  deg["partner/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["partner/list"]}
                checked={state.role["partner/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["partner/list"] = e.target.checked;
                  deg["partneronlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["partner/add"]}
                checked={state.role["partner/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["partner/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["partner/id"]}
                checked={state.role["partner/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["partner/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["partner/delete"]}
                checked={state.role["partner/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["partner/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Aboutus Banner</span>
              <Divider />
              <Checkbox
                value={state.role["aboutusview"]}
                checked={state.role["aboutusview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["aboutusview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["aboutusonlyyou"] = false;
                    deg["aboutus/list"] = false;
                    deg["aboutus/add"] = false;
                    deg["aboutus/id"] = false;
                    deg["aboutus/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["aboutusonlyyou"]}
                checked={state.role["aboutusonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["aboutusonlyyou"] = e.target.checked;
                  deg["aboutus/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["aboutus/list"]}
                checked={state.role["aboutus/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["aboutus/list"] = e.target.checked;
                  deg["aboutusonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["aboutus/add"]}
                checked={state.role["aboutus/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["aboutus/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["aboutus/id"]}
                checked={state.role["aboutus/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["aboutus/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["aboutus/delete"]}
                checked={state.role["aboutus/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["aboutus/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Product Banner</span>
              <Divider />
              <Checkbox
                value={state.role["productbannerview"]}
                checked={state.role["productbannerview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["productbannerview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["productbanneronlyyou"] = false;
                    deg["productbanner/list"] = false;
                    deg["productbanner/add"] = false;
                    deg["productbanner/id"] = false;
                    deg["productbanner/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["productbanneronlyyou"]}
                checked={state.role["productbanneronlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["productbanneronlyyou"] = e.target.checked;
                  deg["productbanner/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["productbanner/list"]}
                checked={state.role["productbanner/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["productbanner/list"] = e.target.checked;
                  deg["productbanneronlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["productbanner/add"]}
                checked={state.role["productbanner/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["productbanner/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["productbanner/id"]}
                checked={state.role["productbanner/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["productbanner/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["productbanner/delete"]}
                checked={state.role["productbanner/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["productbanner/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>FAQ</span>
              <Divider />
              <Checkbox
                value={state.role["faqview"]}
                checked={state.role["faqview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["faqview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["faqonlyyou"] = false;
                    deg["faq/list"] = false;
                    deg["faq/add"] = false;
                    deg["faq/id"] = false;
                    deg["faq/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["faqonlyyou"]}
                checked={state.role["faqonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["faqonlyyou"] = e.target.checked;
                  deg["faq/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["faq/list"]}
                checked={state.role["faq/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["faq/list"] = e.target.checked;
                  deg["faqonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["faq/add"]}
                checked={state.role["faq/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["faq/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["faq/id"]}
                checked={state.role["faq/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["faq/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["faq/delete"]}
                checked={state.role["faq/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["faq/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Incentive</span>
              <Divider />
              <Checkbox
                value={state.role["incentiveview"]}
                checked={state.role["incentiveview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentiveview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["incentiveonlyyou"] = false;
                    deg["incentive/list"] = false;
                    deg["incentive/add"] = false;
                    deg["incentive/id"] = false;
                    deg["incentive/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["incentiveonlyyou"]}
                checked={state.role["incentiveonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentiveonlyyou"] = e.target.checked;
                  deg["incentive/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/list"]}
                checked={state.role["incentive/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/list"] = e.target.checked;
                  deg["incentiveonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/add"]}
                checked={state.role["incentive/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/id"]}
                checked={state.role["incentive/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["incentive/delete"]}
                checked={state.role["incentive/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["incentive/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Store Locator</span>
              <Divider />
              <Checkbox
                value={state.role["storeview"]}
                checked={state.role["storeview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["storeview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["storeonlyyou"] = false;
                    deg["store/list"] = false;
                    deg["store/add"] = false;
                    deg["store/id"] = false;
                    deg["store/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["storeonlyyou"]}
                checked={state.role["storeonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["storeonlyyou"] = e.target.checked;
                  deg["store/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["store/list"]}
                checked={state.role["store/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["store/list"] = e.target.checked;
                  deg["storeonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["store/add"]}
                checked={state.role["store/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["store/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["store/id"]}
                checked={state.role["store/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["store/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["store/delete"]}
                checked={state.role["store/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["store/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Accessories</span>
              <Divider />
              <Checkbox
                value={state.role["accessoriesview"]}
                checked={state.role["accessoriesview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["accessoriesview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["accessoriesonlyyou"] = false;
                    deg["accessories/list"] = false;
                    deg["accessories/add"] = false;
                    deg["accessories/id"] = false;
                    deg["accessories/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["accessoriesonlyyou"]}
                checked={state.role["accessoriesonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["accessoriesonlyyou"] = e.target.checked;
                  deg["accessories/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["accessories/list"]}
                checked={state.role["accessories/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["accessories/list"] = e.target.checked;
                  deg["accessoriesonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["accessories/add"]}
                checked={state.role["accessories/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["accessories/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["accessories/id"]}
                checked={state.role["accessories/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["accessories/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["accessories/delete"]}
                checked={state.role["accessories/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["accessories/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Visitus</span>
              <Divider />
              <Checkbox
                value={state.role["visitusview"]}
                checked={state.role["visitusview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["visitusview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["visitusonlyyou"] = false;
                    deg["visitus/list"] = false;
                    deg["visitus/add"] = false;
                    deg["visitus/id"] = false;
                    deg["visitus/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["visitusonlyyou"]}
                checked={state.role["visitusonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["visitusonlyyou"] = e.target.checked;
                  deg["visitus/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["visitus/list"]}
                checked={state.role["visitus/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["visitus/list"] = e.target.checked;
                  deg["visitusonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["visitus/add"]}
                checked={state.role["visitus/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["visitus/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["visitus/id"]}
                checked={state.role["visitus/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["visitus/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["visitus/delete"]}
                checked={state.role["visitus/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["visitus/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Customers</span>
              <Divider />
              <Checkbox
                value={state.role["customersview"]}
                checked={state.role["customersview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["customersview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["customersonlyyou"] = false;
                    deg["customers/list"] = false;
                    deg["customers/add"] = false;
                    deg["customers/id"] = false;
                    deg["customers/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["customersonlyyou"]}
                checked={state.role["customersonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["customersonlyyou"] = e.target.checked;
                  deg["customers/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["customers/list"]}
                checked={state.role["customers/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["customers/list"] = e.target.checked;
                  deg["customersonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["customers/add"]}
                checked={state.role["customers/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["customers/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["customers/id"]}
                checked={state.role["customers/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["customers/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["customers/delete"]}
                checked={state.role["customers/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["customers/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Demo Booking</span>
              <Divider />
              <Checkbox
                value={state.role["demoview"]}
                checked={state.role["demoview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["demoview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["demoonlyyou"] = false;
                    deg["demo/list"] = false;
                    deg["demo/add"] = false;
                    deg["demo/id"] = false;
                    deg["demo/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["demoonlyyou"]}
                checked={state.role["demoonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["demoonlyyou"] = e.target.checked;
                  deg["demo/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["demo/list"]}
                checked={state.role["demo/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["demo/list"] = e.target.checked;
                  deg["demoonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["demo/add"]}
                checked={state.role["demo/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["demo/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["demo/id"]}
                checked={state.role["demo/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["demo/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["demo/delete"]}
                checked={state.role["demo/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["demo/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Dealer</span>
              <Divider />
              <Checkbox
                value={state.role["dealerview"]}
                checked={state.role["dealerview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["dealerview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["dealeronlyyou"] = false;
                    deg["dealer/list"] = false;
                    deg["dealer/add"] = false;
                    deg["dealer/id"] = false;
                    deg["dealer/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["dealeronlyyou"]}
                checked={state.role["dealeronlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["dealeronlyyou"] = e.target.checked;
                  deg["dealer/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["dealer/list"]}
                checked={state.role["dealer/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["dealer/list"] = e.target.checked;
                  deg["dealeronlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["dealer/add"]}
                checked={state.role["dealer/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["dealer/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["dealer/id"]}
                checked={state.role["dealer/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["dealer/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["dealer/delete"]}
                checked={state.role["dealer/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["dealer/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Blogs</span>
              <Divider />
              <Checkbox
                value={state.role["blogsview"]}
                checked={state.role["blogsview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["blogsview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["blogsonlyyou"] = false;
                    deg["blogs/list"] = false;
                    deg["blogs/add"] = false;
                    deg["blogs/id"] = false;
                    deg["blogs/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["blogsonlyyou"]}
                checked={state.role["blogsonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["blogsonlyyou"] = e.target.checked;
                  deg["blogs/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["blogs/list"]}
                checked={state.role["blogs/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["blogs/list"] = e.target.checked;
                  deg["blogsonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["blogs/add"]}
                checked={state.role["blogs/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["blogs/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["blogs/id"]}
                checked={state.role["blogs/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["blogs/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["blogs/delete"]}
                checked={state.role["blogs/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["blogs/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Events</span>
              <Divider />
              <Checkbox
                value={state.role["eventview"]}
                checked={state.role["eventview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["eventview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["eventonlyyou"] = false;
                    deg["event/list"] = false;
                    deg["event/add"] = false;
                    deg["event/id"] = false;
                    deg["event/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["eventonlyyou"]}
                checked={state.role["eventonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["eventonlyyou"] = e.target.checked;
                  deg["event/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["event/list"]}
                checked={state.role["event/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["event/list"] = e.target.checked;
                  deg["eventonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["event/add"]}
                checked={state.role["event/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["event/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["event/id"]}
                checked={state.role["event/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["event/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["event/delete"]}
                checked={state.role["event/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["event/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>News</span>
              <Divider />
              <Checkbox
                value={state.role["newsview"]}
                checked={state.role["newsview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["newsview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["newsonlyyou"] = false;
                    deg["news/list"] = false;
                    deg["news/add"] = false;
                    deg["news/id"] = false;
                    deg["news/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["newsonlyyou"]}
                checked={state.role["newsonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["newsonlyyou"] = e.target.checked;
                  deg["news/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["news/list"]}
                checked={state.role["news/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["news/list"] = e.target.checked;
                  deg["newsonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["news/add"]}
                checked={state.role["news/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["news/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["news/id"]}
                checked={state.role["news/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["news/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["news/delete"]}
                checked={state.role["news/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["news/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
              <span>Enquiry</span>
              <Divider />
              <Checkbox
                value={state.role["enquiryview"]}
                checked={state.role["enquiryview"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["enquiryview"] = e.target.checked;
                  if (e.target.checked == false) {
                    deg["enquiryonlyyou"] = false;
                    deg["enquiry/list"] = false;
                    deg["enquiry/add"] = false;
                    deg["enquiry/id"] = false;
                    deg["enquiry/delete"] = false;
                  }
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.viewPage" />
              </Checkbox>
              <Checkbox
                value={state.role["enquiryonlyyou"]}
                checked={state.role["enquiryonlyyou"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["enquiryonlyyou"] = e.target.checked;
                  deg["enquiry/list"] = false;
                  console.log(deg);
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.onlyYouDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["enquiry/list"]}
                checked={state.role["enquiry/list"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["enquiry/list"] = e.target.checked;
                  deg["enquiryonlyyou"] = false;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.allDataList" />
              </Checkbox>
              <Checkbox
                value={state.role["enquiry/add"]}
                checked={state.role["enquiry/add"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["enquiry/add"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.addData" />
              </Checkbox>
              <Checkbox
                value={state.role["enquiry/id"]}
                checked={state.role["enquiry/id"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["enquiry/id"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                {" "}
                <IntlMessages id="app.pages.staff.editData" />
              </Checkbox>
              <Checkbox
                value={state.role["enquiry/delete"]}
                checked={state.role["enquiry/delete"]}
                disabled={state.role["superadmin"] ? true : false}
                onChange={(e) => {
                  const deg = state.role;
                  deg["enquiry/delete"] = e.target.checked;
                  seTstate({ ...state, role: deg });
                }}
              >
                <IntlMessages id="app.pages.staff.deleteData" />
              </Checkbox>
              <br /> <br />
              <br />
            </Form.Item>
          ) : (
            ""
          )}

          <Divider />
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              update
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Default;
