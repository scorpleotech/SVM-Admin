import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";

import { Space, Tag, message, Table, Popconfirm, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";

import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

const Default = () => {
  const intl = useIntl();

  const [data, seTdata] = useState([]);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  const columns = [
    {
      title: intl.messages["app.pages.common.name"],
      dataIndex: "name",
      key: "name",
      // width: 150,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: intl.messages["app.pages.common.variants"],
      dataIndex: "variants",
      key: "variants",

      render: (_, record) => (
        <Space>
          {record.variants.map(({ name }) => (
            <Tag color="purple" key={name}>
              {name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "action",
      // width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["variants/id"] ? (
            <Link href={"/variants/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["variantsdelete"] ? (
            <Popconfirm
              placement="left"
              title={'Are you sure you want to delete "' + record.name + '"?'}
              onConfirm={() => deleteData(record._id)}
            >
              <a>
                <DeleteOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />{" "}
              </a>
            </Popconfirm>
          ) : (
            ""
          )}
        </span>
      ),
    },
  ];

  const getData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/variants`)
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

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/variants/${id}`)
      .then(() => {
        message.success(intl.messages["app.pages.common.deleteData"]);
        seTdata(data.filter((item) => item._id !== id));
        getData();
        Router.push("/variants/list");
      });
  };

  return (
    <div>
      {role["variants/add"] ? (
        <Link href="/variants/add" legacyBehavior>
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
        title={() => intl.messages["app.pages.variants.list"]}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={data}
      />
    </div>
  );
};

export default Default;
