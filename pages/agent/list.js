import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Tooltip,
  message,
} from "antd";
import {
  EditOutlined,
  AppstoreAddOutlined,
  CheckCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
// import { API_URL } from "../../../config";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import moment from "moment";
import { FaFileExport } from "react-icons/fa6";

const Default = () => {
  const intl = useIntl();
  const { user } = useSelector(({ login }) => login);
  const { role } = user;
  const [data, seTdata] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = searchText
    ? data.filter((record) =>
        Object.keys(record).some((key) =>
          record[key]
            ? record[key]
                .toString()
                .toLowerCase()
                .includes(searchText.toLowerCase())
            : false
        )
      )
    : data;

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

  const deleteData = (id) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/agent/${id}`).then(() => {
      message.success("Agent Deleted Successfully");
      seTdata(data.filter((item) => item._id !== id));
      getData();
      Router.push("/agent/list");
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: intl.messages["app.pages.common.name"],
      dataIndex: "name",
      key: "name",
      // width: 150,
      sorter: (a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      // ...getColumnSearchProps("name"),
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: intl.messages["app.pages.common.email"],
      dataIndex: "email",
      key: "email",
      // ...getColumnSearchProps("email"),
      sorter: (a, b) => {
        const nameA = a.email.toLowerCase();
        const nameB = b.email.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      title: "Phone",
      dataIndex: "mobile",
      key: "mobile",
      // ...getColumnSearchProps("mobile"),
      sorter: (a, b) => {
        const nameA = a.mobile.toLowerCase();
        const nameB = b.mobile.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      // ...getColumnSearchProps("state"),
      sorter: (a, b) => {
        const nameA = a.state.toLowerCase();
        const nameB = b.state.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      // ...getColumnSearchProps("city"),
      sorter: (a, b) => {
        const nameA = a.city.toLowerCase();
        const nameB = b.city.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      title: "Shop Name",
      dataIndex: ["shop_details", "shop_name"],
      key: ["shop_details", "shop_name"],
      // ...getColumnSearchProps(["shop_details", "shop_name"]),
      sorter: (a, b) => {
        const nameA = (
          (a["shop_details"] && a["shop_details"]["shop_name"]) ||
          ""
        ).toLowerCase();
        const nameB = (
          (b["shop_details"] && b["shop_details"]["shop_name"]) ||
          ""
        ).toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      render: (text) => (text ? text : "No Shop"),
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
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      resizable: true,
      sorter: (a, b) => {
        if (!a.lastLogin || !b.lastLogin) return 0; // If lastLogin is empty, return 0
        return new Date(a.lastLogin) - new Date(b.lastLogin);
      },
      render: (text) => (
        <Tooltip
          placement="top"
          title={text ? moment(text).fromNow() : "No login"}
        >
          {text ? moment(text).format("DD/MM/YY - hh:mm") : "No login"}
        </Tooltip>
      ),
    },
    {
      title: intl.messages["app.pages.common.action"],
      key: "action",
      // width: 360,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["agent/id"] ? (
            <>
              <Popconfirm
                placement="left"
                title={
                  +record.isVerified
                    ? 'Are you sure you want to deactivate "' +
                      record.name +
                      '"?'
                    : 'Are you sure you want to activate "' + record.name + '"?'
                }
                onConfirm={() =>
                  activeOrDeactive(record._id, record.isVerified)
                }
              >
                <Tooltip
                  placement="bottomRight"
                  title={
                    +record.isVerified
                      ? 'Deactivate "' + record.name + '"?'
                      : 'Activate "' + record.name + '"?'
                  }
                >
                  <a>
                    {record.isVerified ? (
                      <CheckCircleOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    ) : (
                      <CloseSquareOutlined
                        style={{ fontSize: "150%", marginLeft: "15px" }}
                      />
                    )}{" "}
                  </a>
                </Tooltip>
              </Popconfirm>
              <Link href={"/agent/" + record._id}>
                {" "}
                <EditOutlined
                  style={{ fontSize: "150%", marginLeft: "15px" }}
                />
              </Link>
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
            </>
          ) : (
            <Link href={"/agent/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          )}
        </span>
      ),
    },
  ];

  const getData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/agent`)
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

  const activeOrDeactive = (id, deg) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/agent/active/${id}`, {
        isVerified: !deg,
        isActive: !deg,
        verified_by: user.id,
      })
      .then(() => {
        message.success(`Agent ${!deg ? "Activated" : "Deactivated"} `);
        getData();
        Router.push("/agent/list");
      });
  };

  return (
    <div>
      {" "}
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/agent/export/all-agent`}
        target="_blank"
        legacyBehavior
        className="mr-2 mb-2"
      >
        <Button
          type="primary"
          className=" float-right flex align-middle items-center gap-2 addbtn"
        >
          <FaFileExport />
          <span>Export</span>
        </Button>
      </Link>
      {role["agent/add"] ? (
        <>
          <Link href="/agent/add" legacyBehavior>
            <Button
              type="primary"
              className="float-right addbtn mb-2"
              icon={<AppstoreAddOutlined />}
              style={{ marginRight: "8px" }}
            >
              <IntlMessages id="app.pages.common.create" />
            </Button>
          </Link>
        </>
      ) : (
        ""
      )}
      <Table
        className="table-responsive"
        title={() => (
          <div className="flex flex-row justify-between align-middle w-full">
            <p style={{ margin: 0 }} className="m-0 text-center">
              Agent List
            </p>
            <Input
              placeholder="Search"
              value={searchText}
              onChange={handleSearchChange}
              style={{ width: 200 }}
            />
          </div>
        )}
        columns={columns}
        pagination={{ position: "bottom" }}
        dataSource={filteredData}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Default;
