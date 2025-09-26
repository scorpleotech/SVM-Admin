import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Table, Popconfirm, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  UploadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
// import Price from "../../app/components/Price";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import moment from "moment";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  // console.log("data", data);
  const columns = [
    {
      title: "Vehicle",
      dataIndex: "vehicle",
      key: "vehicle",
      // width: 150,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      // width: 150,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: "Vehicle Class",
      dataIndex: "vehicleClass",
      key: "vehicleClass",
      // width: 400,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Top Speed",
      dataIndex: "topSpeed",
      key: "topSpeed",
      // width: 400,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Date & Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
      // width: 150,
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      // width: 160,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          <Link href={"/tco/views/" + record._id}>
            {" "}
            <EyeOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
          </Link>
          {role["tco/id"] ? (
            <Link href={"/tco/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["tco/delete"] ? (
            <Popconfirm
              placement="left"
              title={
                'Are you sure you want to delete "' +
                record.manufacturer +
                " " +
                record.model +
                '"?'
              }
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

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/tco`)
      .then((response) => {
        if (response.data.tco.length > 0) {
          seTdata(response.data.tco);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tco/${id}`).then(() => {
      message.success("Tco deleted successfully");
      seTdata(data.filter((item) => item._id !== id));
      getDataFc();
      Router.push("/tco/list");
    });
  };

  return (
    <div>
      {role["tco/add"] ? (
        <Link href="/tco/add" legacyBehavior>
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
        title={() => "TCO List"}
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tco`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
