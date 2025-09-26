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
  Input,
  Space,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { API_URL } from "../../../config";
import moment from "moment";
import { useIntl } from "react-intl";
import IntlMessages from "../../util/IntlMessages";

import { FaFileExport } from "react-icons/fa6";

const Default = ({ getData = [] }) => {
  const intl = useIntl();
  const [data, seTdata] = useState(getData);
  const [orderStatus, seTorderStatus] = useState([]);
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
      title: intl.messages["app.pages.orders.orderNumber"],
      dataIndex: "ordernumber",
      key: "ordernumber",
      // width: 200,
      ...getColumnSearchProps("ordernumber"),
    },

    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "name",
      // width: 500,
      sorter: (a, b) => {
        const nameA = a.customer_name.toLowerCase();
        const nameB = b.customer_name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      },
      ...getColumnSearchProps("customer_name"),
    },
    {
      title: "Model",
      dataIndex: "model_category",
      key: "model_category",
      // width: 150,
      filters: [
        {
          text: "Grand",
          value: "Grand",
        },
        {
          text: "Elite",
          value: "Elite",
        },
      ],
      onFilter: (value, record) => record.model_category.indexOf(value) === 0,
    },
    {
      title: "Booking amount",
      dataIndex: "booking_amount",
      key: "booking_amount",
      // width: 100,
      sorter: (a, b) => a.booking_amount - b.booking_amount,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      // width: 100,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      key: "order_status",
      // width: 200,
      filters: [
        {
          text: "Booked",
          value: "Booked",
        },
        {
          text: "Ordered",
          value: "Ordered",
        },
        {
          text: "In Progress",
          value: "In_Progress",
        },
        {
          text: "Loan Process",
          value: "Loan_Process",
        },
        {
          text: "RTO Process",
          value: "RTO_Process",
        },
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Canceled",
          value: "Canceled",
        },
      ],
      onFilter: (value, record) => record.order_status.indexOf(value) === 0,
    },

    {
      title: "Booking Date & Time",
      dataIndex: "booking_date",
      key: "booking_date",
      // resizable: true,
      // width: 250,
      sorter: (a, b) => new Date(a.booking_date) - new Date(b.booking_date),
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm")}
        </Tooltip>
      ),
    },
    {
      title: "CreatedAt",
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
      title: "UpdatedAt",
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
      width: 150,
      resizable: true,
      render: (text, record) => (
        <span className="link ant-dropdown-link">
          <Link href={"/orders/views/" + record._id}>
            {" "}
            <EyeOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
          </Link>
          {console.log("user Agent", !user.isAgent)}
          {role["orders/id"] && !user.isAgent ? (
            <Link href={"/orders/" + record._id}>
              {" "}
              <EditOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
            </Link>
          ) : (
            ""
          )}
          {role["ordersdelete"] && !user.isAgent ? (
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
    },
  ];

  const getDataFc = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orders`)
      .then((res) => {
        console.log("data", res.data);
        if (res.data.length > 0) {
          const data = res.data;
          seTdata(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDataStatusFc = (target = "All") => {
    if (target == "All") {
      return getDataFc();
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/status/` + target)
      .then((res) => {
        seTdata(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getOrderStatus = () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/orderstatus`)
      .then((res) => {
        if (res.data.length > 0) {
          const data = res.data;
          seTorderStatus(data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getOrderStatus();
    getDataFc();
  }, []);

  const deleteData = (id, imagePath = 0) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`).then(() => {
      message.success("Order Deleted Successfully");
      getDataFc();
      Router.push("/orders/list");
    });

    // if (imagePath != 0) {
    //   axios
    //     .post(`${process.env.NEXT_PUBLIC_API_URL}/upload/deleteproductimage`, {
    //       path: imagePath,
    //     })
    //     .then(() => {
    //       message.success(intl.messages["app.pages.common.deleteData"]);
    //       getDataFc();
    //       Router.push("/orders/list");
    //     });
    // }
  };

  return (
    <div>
      {role["ordersview"] ? (
        <>
          {/* {role["orders/add"] ? (
            <Link href={"/orders/add"} legacyBehavior>
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
          <h5 className="mr-5 ">
            <IntlMessages id="app.pages.orders.list" />{" "}
          </h5>
          {/* <Select
            defaultValue="All"
            className="w-full float-left mt-3 sm:hidden block"
            onChange={(val) => {
              getDataStatusFc(val);
            }}
          >
            <Select.Option value="All">
              <IntlMessages id="app.pages.orders.all" />
            </Select.Option>
            {orderStatus.map((item) => (
              <Select.Option ghost key={item._id} value={item._id}>
                {item.title}
              </Select.Option>
            ))}
          </Select>

          <Radio.Group
            ghost="true"
            defaultValue="All"
            className=" w-full mr-0 h-0 overflow-hidden sm:h-auto sm:overflow-auto  text-center  mx-auto   "
            buttonStyle="solid"
            onChange={(val) => {
              getDataStatusFc(val.target.value);
            }}
          >
            <Radio.Button ghost="true" value="All">
              <IntlMessages id="app.pages.orders.all" />
            </Radio.Button>
            {orderStatus.map((item) => (
              <Radio.Button ghost="true" key={item._id} value={item._id}>
                {item.title}
              </Radio.Button>
            ))}
          </Radio.Group> */}
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/orders/export/order`}
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
          <Table
            columns={columns}
            pagination={{ position: "bottom" }}
            dataSource={[...data]}
            expandable={{ defaultExpandAllRows: true }}
            rowKey="_id"
            scroll={{ x: 1200 }}
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
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: req ? { cookie: req.headers.cookie } : undefined,
    });

    const dataManipulate = res.data;

    return { getData: dataManipulate };
  }
};

export default Default;
