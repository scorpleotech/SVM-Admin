import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  message,
  Table,
  Input,
  Space,
  Popconfirm,
  Tooltip,
  Button,
} from "antd";
import {
  CheckCircleOutlined,
  CloseSquareOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import moment from "moment";
import { FaFileExport } from "react-icons/fa6";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, setData] = useState(getData);
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      // ...getColumnSearchProps("name"),
      render: (text, record) => (
        <span className="link">
          {record.name} {record.surname}
        </span>
      ),
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
      dataIndex: "phone",
      key: "phone",
      // ...getColumnSearchProps("phone"),
      sorter: (a, b) => {
        const nameA = a.phone.toLowerCase();
        const nameB = b.phone.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      resizable: true,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
        if (!a.lastLogin || !b.lastLogin) return 0;
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
      key: "_id",
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["customers/id"] && (
            <div>
              <Popconfirm
                placement="left"
                title={
                  +record.isActive
                    ? 'Are you sure you want to deactivate "' +
                      record.name +
                      '"?'
                    : 'Are you sure you want to activate "' + record.name + '"?'
                }
                onConfirm={() => activeOrDeactive(record._id, record.isActive)}
              >
                <Tooltip
                  placement="bottomRight"
                  title={
                    +record.isActive
                      ? 'Deactivate "' + record.name + '"?'
                      : 'Activate "' + record.name + '"?'
                  }
                >
                  <a>
                    {record.isActive ? (
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
              {role["customers/delete"] && (
                <Popconfirm
                  placement="left"
                  title={
                    'Are you sure you want to delete "' + record.name + '"?'
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
            </div>
          )}
        </span>
      ),
    },
  ];

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/customer`)
      .then((response) => {
        if (response.data.length > 0) {
          setData(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataFc();
  }, []);

  const activeOrDeactive = (id, deg) => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/customers/active/${id}`, {
        isActive: !deg,
      })
      .then(() => {
        message.success(`Customer ${!deg ? "Activated" : "Deactivated"} `);
        getDataFc();
        Router.push("/customers/list");
      });
  };

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/customer/${id}`)
      .then(() => {
        message.success("Customer Deleted Successfully");
        setData(data.filter((item) => item._id !== id));
        getDataFc();
        Router.push("/customers/list");
      });
  };

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

  return (
    <div>
      <Link
        href={`${process.env.NEXT_PUBLIC_API_URL}/customer/export-all-customer`}
        target="_blank"
        legacyBehavior
      >
        <Button
          type="primary"
          className="float-right flex align-middle items-center gap-2 addbtn mb-2"
        >
          <FaFileExport />
          <span>Export</span>
        </Button>
      </Link>

      <Table
        title={() => (
          <div className="flex flex-row justify-between align-middle w-full">
            <p style={{ margin: 0 }} className="m-0 text-center">
              Customer List
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
      `${process.env.NEXT_PUBLIC_API_URL}/customers`,
      {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      }
    );

    return { getData: res.data };
  }
};

export default Default;
