import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Image, Table, Popconfirm, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseSquareOutlined,
  CheckCircleOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL, IMG_URL } from "../../../config";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  const columns = [
    {
      title: intl.messages["app.pages.brands.title"],
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (text, record) => (
        <>
          {record.image !== "" ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + record.image}
              height={80}
            />
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Color",
      dataIndex: "colorName",
      key: "colorName",
      width: 150,
    },
    {
      title: "Charging",
      dataIndex: "charging_time",
      key: "charging_time",
      width: 150,
    },
    {
      title: "Mileage",
      dataIndex: "mileage",
      key: "mileage",
      width: 150,
    },
    {
      title: "Emi Price",
      dataIndex: "emi_price",
      key: "emi_price",
      width: 150,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 150,
    },

    {
      title: intl.messages["app.pages.brands.action"],
      key: "_id",
      width: 150,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["bikevarient/id"] ? (
            <>
              <Popconfirm
                placement="left"
                title={
                  +record.isActive
                    ? 'Are you sure you want to deactivate "' +
                      record.name +
                      '"?'
                    : 'Are you sure you want to activate "' + record.name + '"?'
                }
                onConfirm={() => activeOrDeactive(record._id, record.isActive)}
              >
                <Tooltip
                  placement="bottomRight"
                  title={
                    +record.isActive
                      ? 'Deactivate "' + record.name + '"?'
                      : 'Activate "' + record.name + '"?'
                  }
                >
                  <a>
                    {record.isActive ? (
                      <CheckCircleOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    ) : (
                      <CloseSquareOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    )}{" "}
                  </a>
                </Tooltip>
              </Popconfirm>

              <Link href={"/bikevarient/" + record._id}>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </Link>
            </>
          ) : (
            ""
          )}
          {role["bikevarient/delete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={
                    'Are you sure you want to delete "' + record.name + '"?'
                  }
                  onConfirm={() => deleteData(record._id, record.image)}
                >
                  <a>
                    <DeleteOutlined
                      style={{ fontSize: "150%", marginLeft: "15px" }}
                    />{" "}
                  </a>
                </Popconfirm>
              )}
            </>
          ) : (
            ""
          )}
        </span>
      ),
    },
  ];

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data;
          seTdata(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const activeOrDeactive = (id, deg) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient/active/${id}`, {
        isActive: !deg,
      })
      .then(() => {
        message.success(`Bike Variant ${!deg ? "Activated" : "Deactivated"} `);
        getDataFc();
        Router.push("/bikevarient/list");
      });
  };

  const deleteData = (id, imagePath = 0) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient/${id}`)
      .then(() => {
        message.success("Bike Variant Deleted Successfully");
        getDataFc();
        Router.push("/bikevarient/list");
      });

    if (imagePath != 0) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/deletebikevarientimage`,
          {
            path: imagePath,
          }
        )
        .then(() => {
          message.success("Delete Data");
          getDataFc();
          Router.push("/bikevarient/list");
        });
    }
  };

  return (
    <div>
      {role["bikevarient/add"] ? (
        <Link href={"/bikevarient/add"} legacyBehavior>
          <Button
            type="primary"
            className="float-right addbtn"
            icon={<AppstoreAddOutlined />}
          >
            <IntlMessages id="app.pages.common.create" />
          </Button>
        </Link>
      ) : (
        ""
      )}

      <Table
        title={() => "Bike Variant List"}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={data}
        expandable={{ defaultExpandAllRows: true }}
        rowKey="_id"
        scroll={{ x: true }}
      />
    </div>
  );
};

Default.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/bikevarient`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
