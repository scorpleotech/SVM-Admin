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
      title: "Accessory Name",
      dataIndex: "name",
      key: "name",
      // width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      // width: 300,
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
      title: "Coupon Code",
      dataIndex: "couponCode",
      key: "couponCode",
      // width: 150,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.brands.action"],
      key: "_id",
      // width: 260,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["accessories/id"] ? (
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

              <Link href={"/accessories/" + record._id}>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </Link>
            </>
          ) : (
            ""
          )}
          {role["accessories/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/accessories`)
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
      .post(`${process.env.NEXT_PUBLIC_API_URL}/accessories/active/${id}`, {
        isActive: !deg,
      })
      .then(() => {
        message.success(`Accessories ${!deg ? "Activated" : "Deactivated"} `);
        getDataFc();
        Router.push("/accessories/list");
      });
  };

  const deleteData = (id, imagePath = 0) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/accessories/${id}`)
      .then(() => {
        message.success("Accessories Deleted Successfully");
        getDataFc();
        Router.push("/accessories/list");
      });

    if (imagePath != 0) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/deleteaccessoriesimage`,
          {
            path: imagePath,
          }
        )
        .then(() => {
          message.success("Image Deleted Successfully");
          getDataFc();
          Router.push("/accessories/list");
        });
    }
  };

  return (
    <div>
      {role["accessories/add"] ? (
        <Link href={"/accessories/add"} legacyBehavior>
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
        title={() => "Accessories List"}
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
      `${process.env.NEXT_PUBLIC_API_URL}/accessories`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
