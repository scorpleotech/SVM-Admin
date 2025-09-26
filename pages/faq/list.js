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
      title: "Questions",
      dataIndex: "question",
      key: "question",
      // width: 360,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Answer",
      dataIndex: "answer",
      key: "answer",
      // width: 360,
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 250,
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 150,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["faq/id"] ? (
            <Link href={"/faq/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["faq/delete"] ? (
            <Popconfirm
              placement="left"
              title={
                'Are you sure you want to delete "' + record.question + '"?'
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/faq`)
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
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`).then(() => {
      message.success("FAQ Deleted Successfully");
      seTdata(data.filter((item) => item._id !== id));
      getDataFc();
      Router.push("/faq/list");
    });
  };

  return (
    <div>
      {role["faq/add"] ? (
        <Link href="/faq/add" legacyBehavior>
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
        title={() => "FAQ List"}
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faq`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
