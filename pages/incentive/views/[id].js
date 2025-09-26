import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Descriptions, Card, message, Divider, Button } from "antd";
import moment from "moment";
import Link from "next/link";

const IncentiveViewPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the orderId from the URL

  const [incentive, setIncentive] = useState(null);

  // console.log("order", orderId);

  useEffect(() => {
    if (id) {
      // Fetch the order details when orderId is available
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/incentive/${id}`)
        .then((response) => {
          setIncentive(response.data);
        })
        .catch((error) => {
          console.error("Error fetching Incentive:", error);
        });
    }
  }, [id]);

  if (!incentive) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href="/incentive/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"Incentive Details"}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Order Number">
            {incentive.ordernumber}
          </Descriptions.Item>

          <Descriptions.Item label="Incentive Amount">
            {incentive.incentive_amount}
          </Descriptions.Item>
          <Descriptions.Item label="Incentive Status">
            {incentive.incentive_status}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction ID">
            {incentive.trn_id}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction UTR number">
            {incentive.trn_utr_number}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction Date">
            {moment(incentive.trndate).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Transaction Details">
            {incentive.txn_details}
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {moment(incentive.createdAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated Date">
            {moment(incentive.updatedAt).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default IncentiveViewPage;
