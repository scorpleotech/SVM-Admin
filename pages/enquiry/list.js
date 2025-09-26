import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import {
  message,
  Table,
  Popconfirm,
  Button,
  Tooltip,
  Input,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("name"),
      render: (text) => <span className="link">{text}</span>,
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      sorter: (a, b) => {
        const nameA = a.email.toLowerCase();
        const nameB = b.email.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("email"),
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      width: 150,
      ...getColumnSearchProps("mobile"),
      render: (text) => <span className="link">{text}</span>,
    },
    {
      title: "Message",
      dataIndex: "enquiry",
      key: "enquiry",
      width: 150,
      render: (text) => <span className="link">{text}</span>,
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
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      // width: 150,
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
      width: 160,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          {role["enquiry/id"] ? (
            <Link href={"/enquiry/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["enquiry/delete"] ? (
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`)
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

  const getDownloadReport = async () => {
    // Create a URL for the blob

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/enquiry/download`
    );

    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/enquiry/download`;

    // Create a link element
    const a = document.createElement("a");
    a.href = backendUrl;
    a.download = "Enquiry.xlsx"; // Optional: Set the desired file name
    document.body.appendChild(a);

    // Trigger a click event on the link to initiate the download
    a.click();
  };

  const deleteData = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/enquiry/${id}`)
      .then(() => {
        message.success("Enquiry Deleted Successfully");
        seTdata(data.filter((item) => item._id !== id));
        getDataFc();
        Router.push("/enquiry/list");
      });
  };

  return (
    <div>
      {role["enquiry/add"] ? (
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
          <Link href="/enquiry/add" legacyBehavior>
            <Button
              type="primary"
              className="float-right addbtn"
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
        title={() => "Enquiry List"}
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/enquiry`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    return { getData: res.data };
  }
};

export default Default;
