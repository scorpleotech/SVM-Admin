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

const AliveOrders = ({ getData = [] }) => {
  const intl = useIntl();
  // Sample data for alive orders - filtered for Pending and Booked status only
  const [allData, setAllData] = useState([
    {
      _id: "1",
      reservation_number: "RSV-2025-001",
      customer_name: "Rajesh Kumar",
      email: "rajesh.kumar@gmail.com",
      mobile_number: "+91 9876543210",
      model: "Alive Lite",
      color: "Red",
      payment_status: "Booked", // Changed to match your requirement
      order_status: "Booked",
      price: 999,
      booking_date: "2025-08-15T10:30:00Z",
    },
    {
      _id: "2",
      reservation_number: "RSV-2025-002",
      customer_name: "Priya Sharma",
      email: "priya.sharma@yahoo.com",
      mobile_number: "+91 8765432109",
      model: "Alive Elite",
      color: "Dark grey",
      payment_status: "Pending",
      order_status: "Pending",
      price: 999,
      booking_date: "2025-08-20T14:15:00Z",
    },
    {
      _id: "4",
      reservation_number: "RSV-2025-004",
      customer_name: "Anita Singh",
      email: "anita.singh@gmail.com",
      mobile_number: "+91 9123456789",
      model: "Alive Elite",
      color: "White",
      payment_status: "Booked",
      price: 999,
      booking_date: "2025-08-28T11:20:00Z",
    },
  ]);

  // Filtered data - only showing Pending and Booked orders
  const [data, setData] = useState([]);
  const [orderStatus, seTorderStatus] = useState([]);
  const { user } = useSelector(({ login }) => login);
  const { role } = user;

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  // Filter data to show only Pending and Booked payment status
  useEffect(() => {
    const filteredData = allData.filter(order => 
      order.payment_status === "Pending" || order.payment_status === "Booked"
    );
    setData(filteredData);
  }, [allData]);

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
      title: "Reservation Number",
      dataIndex: "reservation_number",
      key: "reservation_number",
      ...getColumnSearchProps("reservation_number"),
    },
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_number",
      key: "mobile_number",
      ...getColumnSearchProps("mobile_number"),
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      filters: [
        {
          text: "alive Lite",
          value: "alive Lite",
        },
        {
          text: "alive Plus",
          value: "alive Plus",
        },
        {
          text: "alive Elite",
          value: "alive Elite",
        },
      ],
      onFilter: (value, record) => record.model.indexOf(value) === 0,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      filters: [
        {
          text: "Red",
          value: "Red",
        },
        {
          text: "Green",
          value: "Green",
        },
        {
          text: "Black",
          value: "Black",
        },
        {
          text: "White",
          value: "White",
        },
        {
          text: "Dark grey",
          value: "Dark grey",
        },
      ],
      onFilter: (value, record) => record.color.indexOf(value) === 0,
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      filters: [
        {
          text: "Success",
          value: "Success",
        },
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Failed",
          value: "Failed",
        },
      ],
      onFilter: (value, record) => record.payment_status.indexOf(value) === 0,
      render: (status) => {
        const getStatusColor = (status) => {
          switch(status) {
            case 'Success': return '#4caf50';
            case 'Pending': return '#ff9800';
            case 'Failed': return '#f44336';
            default: return '#666';
          }
        };
        
        return (
          <span 
            style={{ 
              backgroundColor: getStatusColor(status),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            {status}
          </span>
        );
      },
    },
    
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => `₹${price.toLocaleString()}`,
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (transactionId) => transactionId || "N/A",
      ...getColumnSearchProps("transactionId"),
    },
    {
      title: "Booking Date & Time",
      dataIndex: "booking_date",
      key: "booking_date",
      sorter: (a, b) => new Date(a.booking_date) - new Date(b.booking_date),
      render: (text) => (
        <Tooltip placement="top" title={moment(text).fromNow()}>
          {moment(text).format("DD/MM/YY - hh:mm A")}
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
          <Link href={"/AliveOrders/views/" + record._id}>
            {" "}
            <EyeOutlined style={{ fontSize: "150%", marginLeft: "15px" }} />
          </Link>
          {console.log("user Agent", !user.isAgent)}
          {role["orders/id"] && !user.isAgent ? (
            <Link href={"/AliveOrders/" + record._id}>
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
                    record.reservation_number +
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
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/alive`)
      .then((res) => {
        console.log("alive data", res.data);
        if (res.data.data && res.data.data.length > 0) {
          const rawData = res.data.data;
          // Map the data to match table structure
          const mappedData = rawData.map(order => ({
            _id: order._id,
            reservation_number: order.reservation_number,
            customer_name: order.name, // Map name to customer_name
            email: order.email,
            mobile_number: order.mobile, // Map mobile to mobile_number
            model: `alive ${order.model}`, // Format as "alive Lite/Plus/Elite"
            color: order.colorName, // Use colorName instead of color hex
            payment_status: order.payment_status,
            order_status: order.order_status,
            price: order.price,
            booking_date: order.createdAt, // Use createdAt as booking_date
            transactionId: order.transactionId,
            payment_mode: order.payment_mode
          }));
          
          // Filter for only Pending and Success payment status (Success = Booked)
          const filteredData = mappedData.filter(order => 
            order.payment_status === "Pending" || order.payment_status === "Success"
          );
          setAllData(filteredData);
        }
      })
      .catch((err) => console.log("alive API Error:", err));
  };

  const getDataStatusFc = (target = "All") => {
    if (target == "All") {
      return getDataFc();
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/alive/status/` + target)
      .then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          const rawData = res.data.data;
          // Map the data to match table structure
          const mappedData = rawData.map(order => ({
            _id: order._id,
            reservation_number: order.reservation_number,
            customer_name: order.name,
            email: order.email,
            mobile_number: order.mobile,
            model: `alive ${order.model}`,
            color: order.colorName,
            payment_status: order.payment_status,
            order_status: order.order_status,
            price: order.price,
            booking_date: order.createdAt,
            transactionId: order.transactionId,
            payment_mode: order.payment_mode
          }));
          
          // Filter for only Pending and Success payment status
          const filteredData = mappedData.filter(order => 
            order.payment_status === "Pending" || order.payment_status === "Success"
          );
          setAllData(filteredData);
        }
      })
      .catch((err) => console.log("alive Status API Error:", err));
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

  // Filter data to show only Pending and Booked payment status
  useEffect(() => {
    const filteredData = allData.filter(order => 
      order.payment_status === "Pending" || order.payment_status === "Booked"
    );
    setData(filteredData);
  }, [allData]);

  const deleteData = (id, imagePath = 0) => {
    axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/alive/${id}`).then(() => {
      message.success("alive Order Deleted Successfully");
      getDataFc();
      Router.push("/AliveOrders/orderlist");
    });
  };

  return (
    <div>
      {role["ordersview"] ? (
        <>
          <h5 className="mr-5 ">
            Alive Orders List  
          </h5>
          
          <Link
            href={`${process.env.NEXT_PUBLIC_API_URL}/api/alive/export/order`}
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

AliveOrders.getInitialProps = async ({ req }) => {
  if (!req?.headers?.cookie) {
    return {};
  } else {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/alive`, {
        headers: req ? { cookie: req.headers.cookie } : undefined,
      });

      if (res.data.data && res.data.data.length > 0) {
        // Map and filter server-side data
        const mappedData = res.data.data.map(order => ({
          _id: order._id,
          reservation_number: order.reservation_number,
          customer_name: order.name,
          email: order.email,
          mobile_number: order.mobile,
          model: `alive ${order.model}`,
          color: order.colorName,
          payment_status: order.payment_status,
          order_status: order.order_status,
          price: order.price,
          booking_date: order.createdAt,
          transactionId: order.transactionId,
          payment_mode: order.payment_mode
        }));
        
        const dataManipulate = mappedData.filter(order => 
          order.payment_status === "Pending" || order.payment_status === "Success"
        );

        return { getData: dataManipulate };
      }
      return { getData: [] };
    } catch (error) {
      console.error("alive getInitialProps error:", error);
      return { getData: [] };
    }
  }
};
export default AliveOrders;