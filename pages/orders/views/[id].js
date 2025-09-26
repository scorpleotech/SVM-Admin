import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Descriptions, Card, message, Divider, Button } from "antd";
import moment from "moment";
import Link from "next/link";

const OrderViewPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the orderId from the URL

  const [order, setOrder] = useState(null);

  // console.log("order", orderId);

  useEffect(() => {
    if (id) {
      // Fetch the order details when orderId is available
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`)
        .then((response) => {
          setOrder(response.data);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
        });
    }
  }, [id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href="/orders/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Order Details"}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Order Number">
            {order.ordernumber}
          </Descriptions.Item>
          <Descriptions.Item label="Customer Name">
            {order.customer_name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">{order.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{order.email}</Descriptions.Item>
          <Descriptions.Item label="Model Name">
            {order.model_name}
          </Descriptions.Item>
          <Descriptions.Item label="Model Category">
            {order.model_category}
          </Descriptions.Item>
          <Descriptions.Item label="Model Booked Color">
            {order.model_booked_color}
          </Descriptions.Item>
          <Descriptions.Item label="Coupon Code">
            {order.coupon_code}
          </Descriptions.Item>
          <Descriptions.Item label="Agent Code">
            {order.agent_code}
          </Descriptions.Item>
          <Descriptions.Item label="Price">{order.price}</Descriptions.Item>
          <Descriptions.Item label="Transaction ID">
            {order.transactionId ? order.transactionId : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Mode">
          {order.payment_mode ? order.payment_mode : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Booking Date">
            {moment(order.booking_date).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Order Status">
            {order.order_status}
          </Descriptions.Item>

          <Descriptions.Item label="City">
            {order.address.city}
          </Descriptions.Item>
          <Descriptions.Item label="State">
            {order.address.state}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderViewPage;
