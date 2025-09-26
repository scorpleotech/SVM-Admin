import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  message,
  Table,
  Input,
  Space,
  Popconfirm,
  Button,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
// import Price from "../../app/components/Price";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import moment from "moment";
import { FaFileExport } from "react-icons/fa6";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // console.log("data", data);
  const columns = [
    {
      title: "Dealer Name",
      dataIndex: "name",
      key: "name",
      // width: 100,
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      // width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      // width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      // width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      // width: 200,
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      resizable: true,
      // width: 250,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      resizable: true,
      // width: 250,
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
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
          {role["dealer/id"] ? (
            <Link href={"/dealer/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["dealer/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/dealer`)
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
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/dealer/${id}`).then(() => {
      message.success("Dealers Deleted Successfully");
      seTdata(data.filter((item) => item._id !== id));
      getDataFc();
      Router.push("/dealer/list");
    });
  };

  return (
    <div>
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/dealer/export/dealer`}
        target="_blank"
        legacyBehavior
        className="mr-2"
      >
        <Button
          type="primary"
          className=" float-right flex align-middle items-center gap-2 addbtn"
        >
          <FaFileExport />
          <span>Export</span>
        </Button>
      </Link>
      {role["dealer/add"] ? (
        <Link href="/dealer/add" legacyBehavior>
          <Button
            type="primary"
            className="float-right addbtn"
            icon={<AppstoreAddOutlined />}
            style={{ marginRight: "8px" }}
          >
            <IntlMessages id="app.pages.common.create" />
          </Button>
        </Link>
      ) : (
        ""
      )}

      <Table
        title={() => intl.messages["app.pages.dealer.list"]}
        columns={columns}
        pagination={{ position: "bottom" }}
        tableLayout="auto"
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dealer`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
