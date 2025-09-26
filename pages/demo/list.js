import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { useSelector } from "react-redux";
import {
  Table,
  Button,
  Popconfirm,
  Tooltip,
  message,
  Input,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import axios from "axios";
// import { API_URL } from "../../../config";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";
import moment from "moment";

const Default = () => {
  const intl = useIntl();
  const { user } = useSelector(({ login }) => login);
  const { role } = user;
  const [data, seTdata] = useState([]);

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
      title: intl.messages["app.pages.common.name"],
      dataIndex: "name",
      key: "name",
      // width: 150,
      render: (text) => <span className="link">{text}</span>,
      sorter: (a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("name"),
    },
    {
      title: "Dealer Name",
      dataIndex: "dealer_name",
      key: "dealer_name",
      // width: 150,
      sorter: (a, b) => {
        const nameA = a.dealer_name.toLowerCase();
        const nameB = b.dealer_name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("dealer_name"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      // width: 150,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      // width: 150,
      sorter: (a, b) => {
        const nameA = a.state.toLowerCase();
        const nameB = b.state.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("state"),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      // width: 150,
      sorter: (a, b) => {
        const nameA = a.city.toLowerCase();
        const nameB = b.city.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("city"),
    },
    {
      title: "Booking Time",
      dataIndex: "booking_time",
      key: "booking_time",
      // width: 150,
      sorter: (a, b) => new Date(a.booking_time) - new Date(b.booking_time),
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
      // width: 150,
      sorter: (a, b) => new Date(a.booking_date) - new Date(b.booking_date),
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY")}
        </Tooltip>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      // width: 150,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
          {role["demo/id"] ? (
            <Link href={"/demo/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}{" "}
          {role["demo/delete"] ? (
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

  const getData = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/testdrive`)
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

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/testdrive`)
      .then((response) => {
        if (response.data.length > 0) {
          seTdata(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/testdrive/${id}`)
      .then(() => {
        message.success("Testdrive Deleted Successfully");
        seTdata(data.filter((item) => item._id !== id));
        getDataFc();
        Router.push("/demo/list");
      });
  };

  return (
    <div>
      {role["demo/add"] ? (
        <>
          <Link href="/demo/add" legacyBehavior>
            <Button
              type="primary"
              className="float-right addbtn"
              icon={<AppstoreAddOutlined />}
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
        title={() => intl.messages["app.pages.staff.demo"]}
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

export default Default;
