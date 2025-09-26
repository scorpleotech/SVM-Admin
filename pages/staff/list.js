import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Table, Button } from "antd";
import { EditOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import axios from "axios";
// import { API_URL } from "../../../config";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

const Default = () => {
  const intl = useIntl();
  const { user } = useSelector(({ login }) => login);
  const { role } = user;
  const [data, seTdata] = useState([]);

  const columns = [
    {
      title: intl.messages["app.pages.common.name"],
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Role",
      dataIndex: "rolename",
      key: "rolename",
      width: 250,
    },

    {
      title: intl.messages["app.pages.common.email"],
      dataIndex: "email",
      key: "email",
      width: 250,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 250,
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "action",
      width: 100,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["staff/id"] ? (
            <Link href={"/staff/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
        </span>
      ),
    },
  ];

  const getData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/staff`)
      .then((response) => {
        console.log(response.data);
        if (response.data.length > 0) {
          seTdata(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {role["staff/add"] ? (
        <Link href="/staff/add" legacyBehavior>
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
        className="table-responsive"
        title={() => intl.messages["app.pages.staff.list"]}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={data}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Default;
