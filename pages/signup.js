import IntlMessages from "../util/IntlMessages";
import { useEffect, useState } from "react";
// import { API_URL, COUNTRY_URL } from "../../config";
import axios from "axios";
import ImgCrop from "antd-img-crop";
import {
  Row,
  Button,
  Form,
  Input,
  message,
  DatePicker,
  Col,
  Typography,
  Select,
  Upload,
  Modal,
} from "antd";

import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { login_r, isAuthenticated_r } from "../redux/actions";

import AuthService from "../util/services/authservice";
import { PlusOutlined } from "@ant-design/icons";

const SignUpPage = () => {
  const intl = useIntl();
  const { Option } = Select;

  const { locale } = useSelector(({ settings }) => settings);

  const [city, seTcity] = useState([]);
  const [country, seTcountry] = useState([]);
  const [countryOption, seTcountryOption] = useState([]);
  const [selectedO, seTselectedO] = useState({});
  const [cityOption, seTcityOption] = useState([]);
  const [ilceOption, seTilceOption] = useState([]);

  const onSubmit = async (Data) => {
    console.log("Data coming from the form", Data);

    if (fileList.length > 0) {
      const dataImage = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/uploadchampionavatar`,
        fileList
      );
      console.log("dataImage", dataImage);
      Data["image"] = dataImage.data.replace("../admin/public/", "/");
    } else {
      Data["image"] = "";
    }

    console.log("data", Data);

    AuthService.championRegister(Data).then((res) => {
      // const { isAuthenticated, user } = data;

      if (!res) {
        message.error(
          intl.messages["app.userRegister.Problems with Registration."]
        );
        Router.replace("/signup");
      } else {
        Router.push("/signin");
        message.success(
          intl.messages["app.userRegister.Register Successfully."]
        );
      }
    });
  };

  useEffect(() => {
    getCountry();
    getCity();
  }, []);
  const getCountry = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_COUNTRY_URL}/country`)
      .then((getData) => {
        const dataManipulate = [];
        for (const i in getData.data) {
          dataManipulate.push({
            label: getData.data[i].name,
            value: getData.data[i].name,
          });
        }
        seTcountryOption(dataManipulate);
        seTcountry(getData.data);
      });
  };
  const getCity = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_COUNTRY_URL}/turkey`)
      .then((getData) => {
        const dataManipulate = [];
        for (const i in getData.data) {
          dataManipulate.push({
            label: getData.data[i].Il,
            value: getData.data[i].Il,
          });
        }
        seTcityOption(dataManipulate);
        seTcity(getData.data);
      });
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue={"91"}>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="91">+91</Option>
      </Select>
    </Form.Item>
  );

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

  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState("");
  // const [previewTitle, setPreviewTitle] = useState("");
  // // const [fileList, setFileList] = useState([]);

  // const handleCancel = () => setPreviewOpen(false);
  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  //   setPreviewTitle(
  //     file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
  //   );
  // };
  // const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // const uploadButton = (
  //   <div>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  const isValidPanCard = (rule, value) => {
    return new Promise((resolve, reject) => {
      let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
      // let regex2 = new RegExp(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/);
      if (regex.test(value) == true) {
        resolve();
      } else {
        reject("Invalid PAN Card Number");
      }
    });
  };

  const isValidAadhaar = (rule, value) => {
    return new Promise((resolve, reject) => {
      let regex = new RegExp(/^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$/);
      if (regex.test(value) == true) {
        resolve();
      } else {
        reject("Invalid AADHAAR Card Number");
      }
    });
  };
  const isValidPassword = (rule, value) => {
    return new Promise((resolve, reject) => {
      let regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
      if (regex.test(value) == true) {
        resolve();
      } else {
        reject(
          "Password must contain one lowercase, one uppercase , one number and one special character"
        );
      }
    });
  };

  return (
    <>
      <Col
        xs={{ span: 18, offset: 3 }}
        sm={{ span: 6, offset: 9 }}
        className="my-5"
      >
        <Typography.Title className="text-center mt-5">
          SVM Register
        </Typography.Title>

        <div className="text-center fs-10 mb-5">Green Champion Register</div>
        <Form
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          layout="vertical"
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid Name!" />
                ),
              },
            ]}
            name="name"
            label={<IntlMessages id="app.userRegister.Name" />}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid E-mail!" />
                ),
              },
            ]}
            name="email"
            label={<IntlMessages id="app.userRegister.E-mail" />}
          >
            <Input type="email" size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.Please input your Password!" />
                ),
                min: 8,
              },
              {
                validator: isValidPassword,
                message:
                  "Password must contain one lowercase, one uppercase , one number and one special character.",
              },
            ]}
            name="password"
            label={<IntlMessages id="app.userRegister.Password" />}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid Address!" />
                ),
              },
            ]}
            name="address"
            label={<IntlMessages id="app.userRegister.Address" />}
          >
            <Input size="large" />
          </Form.Item>
          {/* <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.Please input your Passport Size Photo!" />
                ),
              },
            ]}
            name="photo"
            label={<IntlMessages id="app.userRegister.Passport Size Photo" />}
          >
            <Upload
              action="http://localhost:8000/signup"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item> */}
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

          {/* <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal> */}

          <div className="text-left fs-10 font-bold mb-5">KYC Details</div>

          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid First Name!" />
                ),
              },
            ]}
            name="firstname"
            label={<IntlMessages id="app.userRegister.First Name" />}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid Last Name!" />
                ),
              },
            ]}
            name="lastname"
            label={<IntlMessages id="app.userRegister.Last Name" />}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid DOB!" />
                ),
              },
            ]}
            name="dob"
            label={<IntlMessages id="app.userRegister.DOB" />}
          >
            <DatePicker className="w-full" size="large" />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
                message: "Please select gender!",
              },
            ]}
          >
            <Select placeholder="select your gender" size="large">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: "100%",
              }}
              size="large"
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid PAN!" />
                ),
              },
              { validator: isValidPanCard, message: "Invalid PAN format." },
            ]}
            name="pan_number"
            label={<IntlMessages id="app.userRegister.PAN" />}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid AADHAR!" />
                ),
              },
              { validator: isValidAadhaar, message: "Invalid AADHAR format." },
            ]}
            name="aadhar_number"
            label={<IntlMessages id="app.userRegister.AADHAR" />}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid address1" />
                ),
              },
            ]}
            name="address1"
            label={<IntlMessages id="app.userRegister.address1" />}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid address2" />
                ),
              },
            ]}
            name="address2"
            label={<IntlMessages id="app.userRegister.address2" />}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="country_id"
            // className="float-left  w-full  mx-0 px-0"
            label="Country"
            fieldKey="country_id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              size="large"
              showSearch
              options={countryOption}
              autoComplete="none"
              placeholder="Search to Country"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(selected) => {
                if (selected == "Turkey") {
                  getCity();
                } else {
                  const citydata = country.filter((x) => x.name === selected);
                  const dataManipulate = [];

                  for (const i in citydata[0].states) {
                    dataManipulate.push({
                      label: citydata[0].states[i].name,
                      value: citydata[0].states[i].name,
                    });
                  }

                  seTcityOption(dataManipulate);
                }
                seTselectedO({ ...selectedO, selectedCountry: selected });
              }}
            />
          </Form.Item>

          <Form.Item
            // className="float-left w-full  mx-0 px-0"
            name="city_id"
            fieldKey="city_id"
            label="City"
            rules={[
              {
                required: true,
              },
            ]}
            // rules={[{ required: true, message: "Missing Area" }]}
          >
            <Select
              size="large"
              showSearch
              autoComplete="none"
              options={cityOption}
              placeholder={intl.messages["app.pages.customers.addressCity"]}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(selected) => {
                if (selectedO.selectedCountry == "Turkey") {
                  const ilce = city.filter((x) => x.Il === selected);
                  const dataManipulate = [];
                  for (const i in ilce[0].Ilce) {
                    dataManipulate.push({
                      label: ilce[0].Ilce[i].Ilce,
                      value: ilce[0].Ilce[i].Ilce,
                    });
                  }
                  seTselectedO({ ...selectedO, selectedCity: selected });
                  seTilceOption({
                    option: dataManipulate,
                    data: ilce[0].Ilce,
                  });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: (
                  <IntlMessages id="app.userRegister.The input is not valid postal/zip code!" />
                ),
              },
            ]}
            name="postal_code"
            label={<IntlMessages id="app.userRegister.postal/zip" />}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              className="mb-0 w-full "
              size="large"
              htmlType="submit"
            >
              <IntlMessages id="app.userRegister.signIn" />
            </Button>
          </Form.Item>
        </Form>
        <Button
          type="link"
          className="float-left"
          onClick={() => Router.push("/signin")}
        >
          <IntlMessages id="app.userAuth.Champion Login" />
        </Button>
      </Col>
    </>
  );
};

export default SignUpPage;
