import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  Select,
  message,
  Table,
  Popconfirm,
  Button,
  Tooltip,
  Radio,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import moment from "moment";
import { useIntl } from "react-intl";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);

  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  // console.log("orderStatus data", orderStatus);
  // console.log("data", data);

  const columns = [
    {
      title: "Agent Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      width: 150,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 150,
    },
    {
      title: "Incentive Amount",
      dataIndex: "incentive_amount",
      key: "incentive_amount",
      width: 200,
    },
    {
      title: "Incentive Status",
      dataIndex: "incentive_status",
      key: "incentive_status",
      width: 150,
      render: (text) => (
        <span className="link">
          {text === "Revised"
            ? "Revised"
            : text === "Reviewed"
            ? "Reviewed"
            : text === "Approved"
            ? "Approved"
            : text === "Rejected"
            ? "Rejected"
            : text === "Waiting_for_Approval"
            ? "Waiting for Approval"
            : text === "Processed"
            ? "Processed"
            : text === "Under_Process"
            ? "Under Process"
            : "Under_Process"}
        </span>
      ),
    },

    {
      title: " Date & Time",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
  ];
  if (user.isAgent) {
    columns.push({
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 160,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          <Link href={"/incentive/views/" + record._id}>
            {" "}
            <EyeOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
          </Link>
        </span>
      ),
    });
  }

  if (role["incentive/id"] && !user.isAgent) {
    columns.push({
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      width: 160,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          <Link href={"/incentive/views/" + record._id}>
            {" "}
            <EyeOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
          </Link>
          {console.log("user Agent", !user.isAgent)}
          {role["incentive/id"] && !user.isAgent ? (
            <Link href={"/incentive/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["incentivedelete"] && !user.isAgent ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={
                    'Are you sure you want to delete "' +
                    record.ordernumber +
                    '"?'
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
    });
  }

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/incentive`)
      .then((res) => {
        console.log("data", res.data);
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
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/incentive/${id}`)
      .then(() => {
        message.success("Incentive Deleted Successfully");
        getDataFc();
        Router.push("/incentive/list");
      });
  };

  return (
    <div>
      {role["incentiveview"] ? (
        <>
          <h5 className="mr-5 ">
            <span>Incentive List</span>
          </h5>

          <Table
            columns={columns}
            pagination={{ position: "bottom" }}
            dataSource={[...data]}
            expandable={{ defaultExpandAllRows: true }}
            rowKey="_id"
            scroll={{ x: true }}
          />
        </>
      ) : (
        ""
      )}
    </div>
  );
};

Default.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/incentive`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
