import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Descriptions, Card, message, Divider, Button } from "antd";
import moment from "moment";
import Link from "next/link";

const OrderViewPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the orderId from the URL

  const [tco, setTco] = useState(null);

  // console.log("order", orderId);

  useEffect(() => {
    if (id) {
      // Fetch the order details when orderId is available
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/tco/${id}`)
        .then((response) => {
          setTco(response.data);
        })
        .catch((error) => {
          console.error("Error fetching order:", error);
        });
    }
  }, [id]);

  if (!tco) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link href="/tco/list">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Back to List
        </Button>
      </Link>
      <Card className="card" title={"TCO Vehicle Details"}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Vehicle">{tco.vehicle}</Descriptions.Item>
          <Descriptions.Item label="Manufacturer">
            {tco.manufacturer}
          </Descriptions.Item>
          <Descriptions.Item label="Model">{tco.model}</Descriptions.Item>
          <Descriptions.Item label="Vehicle Class/Type">
            {tco.vehicleClass}
          </Descriptions.Item>
          <Descriptions.Item label="Top Speed (KMH)">
            {tco.topSpeed}
          </Descriptions.Item>
          <Descriptions.Item label="0-60 KMH (Sec)">
            {tco.acceleration}
          </Descriptions.Item>
          <Descriptions.Item label="Release Date">
            {tco.releaseDate}
          </Descriptions.Item>
          <Descriptions.Item label="Battery Capacity">
            {tco.battery_capacity}
          </Descriptions.Item>
          <Descriptions.Item label="Cost">
            {tco.acquisition.cost}
          </Descriptions.Item>
          <Descriptions.Item label="GST">
            {tco.acquisition.GST}
          </Descriptions.Item>
          <Descriptions.Item label="Total Cost">
            {tco.acquisition.totalCost}
          </Descriptions.Item>

          <Descriptions.Item label="Total Cost (incl. GST)">
            {tco.financing.totalCostInclGst}
          </Descriptions.Item>
          <Descriptions.Item label="Down payment">
            {tco.financing.downPayment}
          </Descriptions.Item>
          <Descriptions.Item label="Residual">
            {tco.financing.residual}
          </Descriptions.Item>
          <Descriptions.Item label="Amount to finance">
            {tco.financing.amountToFinance}
          </Descriptions.Item>
          <Descriptions.Item label="Annual PMT">
            {tco.financing.annualPMT}
          </Descriptions.Item>

          <Descriptions.Item label="Range/Charge or Litre">
            {tco.operatingCosts.range}
          </Descriptions.Item>
          <Descriptions.Item label="Charging time (to full)">
            {tco.operatingCosts.chargingTime}
          </Descriptions.Item>
          <Descriptions.Item label="KWh or L p.a.">
            {tco.operatingCosts.kWhOrLitres}
          </Descriptions.Item>
          <Descriptions.Item label="Fuel p.a.">
            {tco.operatingCosts.fuel}
          </Descriptions.Item>
          <Descriptions.Item label="Maintenance">
            {tco.operatingCosts.maintenance}
          </Descriptions.Item>
          <Descriptions.Item label="Total TCO p.a. (3 years amort.)">
            {tco.operatingCosts.totalTCOpA}
          </Descriptions.Item>
          <Descriptions.Item label="Total TCO (3 years)">
            {tco.operatingCosts.totalTCO}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default OrderViewPage;
