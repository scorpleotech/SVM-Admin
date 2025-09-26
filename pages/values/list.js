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
      title: "Value Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Value Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <span className="link">
          {text === "role"
            ? "Role"
            : text === "service_type"
            ? "Service Type"
            : "Incentive Status"}
        </span>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: intl.messages["app.pages.brands.action"],
      key: "_id",
      // width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["values/id"] ? (
            <>
              <Link href={"/values/" + record._id}>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </Link>
            </>
          ) : (
            ""
          )}
          {role["values/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/values`)
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

  const deleteData = (id, imagePath = 0) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/values/${id}`).then(() => {
      message.success("Values Deleted Successfully");
      getDataFc();
      Router.push("/values/list");
    });
  };

  return (
    <div>
      {role["values/add"] ? (
        <Link href={"/values/add"} legacyBehavior>
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
        title={() => "Values List"}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={data}
        expandable={{ defaultExpandAllRows: true }}
        rowKey="_id"
        scroll={{ x: "100%" }}
        style={{ width: "100%" }} // Set the width here
      />
    </div>
  );
};

Default.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/values`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
