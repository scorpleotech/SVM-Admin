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
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <>
          {record.image !== "" ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + record.image}
              height={80}
              width={150}
            />
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: intl.messages["app.pages.brands.action"],
      key: "_id",
      // width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["partner/id"] ? (
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

              <Link href={"/partner/" + record._id}>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </Link>
            </>
          ) : (
            ""
          )}
          {role["partner/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/partner`)
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
      .post(`${process.env.NEXT_PUBLIC_API_URL}/partner/active/${id}`, {
        isActive: !deg,
      })
      .then(() => {
        message.success(`Partner ${!deg ? "Activated" : "Deactivated"} `);
        getDataFc();
        Router.push("/partner/list");
      });
  };

  const deleteData = (id, imagePath = 0) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/partner/${id}`)
      .then(() => {
        message.success("Partner Deleted Successfully");
        getDataFc();
        Router.push("/partner/list");
      });

    if (imagePath != 0) {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/upload/deletepartnerimage`, {
          path: imagePath,
        })
        .then(() => {
          message.success("Delete Data");
          getDataFc();
          Router.push("/partner/list");
        });
    }
  };

  return (
    <div>
      {role["partner/add"] ? (
        <Link href={"/partner/add"} legacyBehavior>
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
        title={() => "Partner List"}
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/partner`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
