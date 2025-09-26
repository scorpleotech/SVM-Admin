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
      // width: 200,
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      // width: 200,
      sorter: (a, b) => {
        const nameA = a.email.toLowerCase();
        const nameB = b.email.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      // width: 200,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      // width: 200,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      // width: 200,
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
      // width: 200,
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
          {role["visitus/id"] ? (
            <Link href={"/visitus/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["visitus/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/visitus`)
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/visitus`)
      .then((response) => {
        if (response.data.length > 0) {
          seTdata(response.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/visitus/${id}`)
      .then(() => {
        message.success("Visit Us Deleted Successfully");
        seTdata(data.filter((item) => item._id !== id));
        getDataFc();
        Router.push("/visitus/list");
      });
  };

  const getDownloadReport = async () => {
    // Create a URL for the blob

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/visitus/download`
    );

    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/visitus/download`;

    // Create a link element
    const a = document.createElement("a");
    a.href = backendUrl;
    a.download = "contact-us.xlsx"; // Optional: Set the desired file name
    document.body.appendChild(a);

    // Trigger a click event on the link to initiate the download
    a.click();
  };

  return (
    <div>
      {role["visitus/add"] ? (
        <div
          style={{
            display: "flex",
            columnGap: "10px",
            justifyContent: "flex-end",
          }}
        >
          <Button type="primary" className="addbtn" onClick={getDownloadReport}>
            Export
          </Button>
          <Link href="/visitus/add" legacyBehavior>
            <Button
              type="primary"
              className="addbtn"
              icon={<AppstoreAddOutlined />}
            >
              <IntlMessages id="app.pages.common.create" />
            </Button>
          </Link>
        </div>
      ) : (
        ""
      )}
      <Table
        className="table-responsive"
        title={() => "Contact Us"}
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
