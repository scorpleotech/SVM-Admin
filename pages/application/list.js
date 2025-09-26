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
import { MdFileDownload } from "react-icons/md";
const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  // console.log("data", data);
  const columns = [
    {
      title: "Applicant Name",
      dataIndex: "name",
      key: "name",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Current Job Title",
      dataIndex: "currentJobTitle",
      key: "currentJobTitle",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Years of Experience",
      dataIndex: "yearsOfExperience",
      key: "yearsOfExperience",
      // width: 350,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Resume",
      dataIndex: "resume",
      key: "resume",
      render: (text) => (
        <a
          className="link"
          href={`${process.env.NEXT_PUBLIC_API_URL}/${text}`}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Download
        </a>
      ),
    },

    {
      title: "Cover Letter",
      dataIndex: "coverLetter",
      key: "coverLetter",
      // width: 350,
      render: (text) => (
        <a
          className="link"
          href={`${process.env.NEXT_PUBLIC_API_URL}/${text}`}
          target="_blank"
          rel="noopener noreferrer"
          download
        >
          Download
        </a>
      ),
    },
    {
      title: "Apply Time",
      dataIndex: "createdAt",
      key: "createdAt",
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
          {/* {role["application/id"] ? (
            <Link href={"/application/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )} */}
          {role["application/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/career-application`)
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
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/career-application/${id}`)
      .then(() => {
        message.success("career-applications Deleted Successfully");
        seTdata(data.filter((item) => item._id !== id));
        getDataFc();
        Router.push("/application/list");
      });
  };

  return (
    <div>
      {/* {role["application/add"] ? (
        <Link href="/application/add" legacyBehavior>
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
      )} */}
      <Table
        title={() => "Career Application List"}
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
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/career-application`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    return { getData: res.data };
  }
};

export default Default;
