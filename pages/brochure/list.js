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
  console.log("data --- ", data);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="link">{text ? text : "-"}</span>,
    },
    {
      title: "Upload Type",
      dataIndex: "file_type",
      key: "file_type",
      render: (text) => (
        <span className="link">{text.replaceAll("_", " ")}</span>
      ),
    },
    // {
    //   title: "Filename",
    //   dataIndex: "file_name",
    //   key: "file_name",
    //   render: (text) => <span className="link">{text}</span>,
    // },
    {
      title: intl.messages["app.pages.brands.action"],
      key: "_id",
      width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["productbanner/id"] ? (
            <>
              <Popconfirm
                placement="left"
                title={intl.messages["app.pages.common.youSure"]}
                onConfirm={() => activeOrDeactive(record._id, record.isActive)}
              >
                <Tooltip
                  placement="bottomRight"
                  title={
                    +record.isActive
                      ? intl.messages["app.pages.common.bePassive"]
                      : intl.messages["app.pages.common.beActive"]
                  }
                >
                  {/* <a>
                    {record.isActive ? (
                      <CheckCircleOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    ) : (
                      <CloseSquareOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    )}{" "}
                  </a> */}
                </Tooltip>
              </Popconfirm>

              <Link href={"/brochure/" + record._id}>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </Link>
            </>
          ) : (
            ""
          )}
          {role["productbanner/delete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={intl.messages["app.pages.common.sureToDelete"]}
                  onConfirm={() => deleteData(record?._id)}
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/brochure`)
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
      .post(`${process.env.NEXT_PUBLIC_API_URL}/productbanner/active/${id}`, {
        isActive: !deg,
      })
      .then(() => {
        message.success(intl.messages["app.pages.common.changeActive"]);
        getDataFc();
        Router.push("/productbanner/list");
      });
  };

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/brochure/${id}`)
      .then(() => {
        message.success("Deleted Successfully");
        getDataFc();
        Router.push("/brochure/list");
      });
  };

  return (
    <div>
      <Link href={"/brochure/add"} legacyBehavior>
        <Button
          type="primary"
          className="float-right addbtn"
          icon={<AppstoreAddOutlined />}
        >
          <IntlMessages id="app.pages.common.create" />
        </Button>
      </Link>

      <Table
        title={() => "Broucher List"}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={data}
        expandable={{ defaultExpandAllRows: true }}
        rowKey="_id"
      />
    </div>
  );
};

Default.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/productbanner`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
