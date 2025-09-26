import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { message, Image, Table, Popconfirm, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
// import func from "../../util/helpers/func";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  const columns = [
    {
      title: intl.messages["app.pages.common.title"],
      dataIndex: "title",
      key: "title",
      // width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      // width: 200,
      render: (text, record) => (
        <>
          {record.image !== "" ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + record.image}
              height={80}
              width={150}
            />
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      title: "Modes",
      dataIndex: "modes",
      key: "modes",
      // width: 150,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      // width: 150,
    },
    {
      title: "Emi Price",
      dataIndex: "emi_price",
      key: "emi_price",
      // width: 150,
    },
    {
      title: "Top Speed",
      dataIndex: "topSpeed",
      key: "topSpeed",
      // width: 150,
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "_id",
      // width: 200,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["categories/id"] ? (
            <Link href={"/categories/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["categoriesdelete"] ? (
            <>
              {record.children ? (
                ""
              ) : (
                <Popconfirm
                  placement="left"
                  title={
                    'Are you sure you want to delete "' + record.title + '"?'
                  }
                  onConfirm={() => deleteData(record._id)}
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((response) => {
        seTdata(response.data);
      })
      .catch((err) => console.log(err));
  };
  console.log("data", data);
  useEffect(() => {
    getDataFc();
  }, []);

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`)
      .then(() => {
        message.success("Category Deleted Successfully");
        getDataFc();
        Router.push("/categories/list");
      });
  };

  return (
    <div>
      {role["categories/add"] ? (
        <Link href="/categories/add" legacyBehavior>
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
      <h5>
        {" "}
        <IntlMessages id="app.pages.category.list" />{" "}
      </h5>
      <Table
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
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    // const dataManipulate = func.getCategoriesTree(res.data);

    return { getData: res.data };
  }
};

export default Default;
