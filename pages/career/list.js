import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Table, Popconfirm, Button, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  UploadOutlined,
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
      title: intl.messages["app.pages.common.title"],
      dataIndex: "title",
      key: "title",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: "Work Type",
      dataIndex: "work_type",
      key: "work_type",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: "Post Time",
      dataIndex: "postTime",
      key: "postTime",
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: "Created Time",
      dataIndex: "createdsAt",
      key: "createdsAt",
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: "Update Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      // width: 200,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["career/id"] ? (
            <Link href={"/career/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["career/delete"] ? (
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

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/career`)
      .then((response) => {
        if (response.data.length > 0) {
          seTdata(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/career/${id}`).then(() => {
      message.success("career Deleted Successfully");
      seTdata(data.filter((item) => item._id !== id));
      getDataFc();
      Router.push("/career/list");
    });
  };

  return (
    <div>
      {role["career/add"] ? (
        <Link href="/career/add" legacyBehavior>
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
        title={() => "Career List"}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={data}
        expandable={{ defaultExpandAllRows: true }}
        rowKey="_id"
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

Default.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/career`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
