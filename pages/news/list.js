import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Table, Image, Popconfirm, Button, Tooltip } from "antd";
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

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // width: 300,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Published By",
      dataIndex: "publishedBy",
      key: "publishedBy",
      // width: 300,
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
      title: "Reading Time",
      dataIndex: "readingTime",
      key: "readingTime",
      // width: 150,
      render: (text) => <span className="link">{text + " min"}</span>,
    },

    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      // width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["news/id"] ? (
            <Link href={"/news/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["news/delete"] ? (
            <Popconfirm
              placement="left"
              title={'Are you sure you want to delete "' + record.title + '"?'}
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/news`)
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
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`).then(() => {
      message.success("News Deleted Successfully");
      seTdata(data.filter((item) => item._id !== id));
      getDataFc();
      Router.push("/news/list");
    });
  };

  return (
    <div>
      {role["news/add"] ? (
        <Link href="/news/add" legacyBehavior>
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
        title={() => "News List"}
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/news`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
