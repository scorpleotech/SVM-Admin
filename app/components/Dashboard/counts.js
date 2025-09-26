// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
// import { Divider } from "antd";
import axios from "axios";
// import { API_URL } from "../../../../config";

import {
  DollarCircleOutlined,
  UsergroupAddOutlined,
  CodeSandboxOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

// import { useIntl } from "react-intl";
import IntlMessages from "../../../util/IntlMessages";
import { useSelector } from "react-redux";

const CrmCounts = () => {
  //   const intl = useIntl();
  const { user } = useSelector(({ login }) => login);

  console.log("user is ahent or not", user);
  console.log("user is ahent or not", user.isAgent);

  const [counts, seTcounts] = useState({
    order: 0,
    customer: 0,
    category: 0,
    product: 0,
    totalOrder: 0,
    monthlyOrder: 0,
    totalIncentive: 0,
    monthlyIncentive: 0,
  });
  const getCountsFc = async () => {
    if (!user.isAgent) {
      const order = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/orders/counts/`)
        .then((res) => res.data);
      const customer = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/customers/counts/`)
        .then((res) => res.data);
      const category = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/categories/count/`)
        .then((res) => res.data);
      const product = await axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/bikevarient/active/counts/`)
        .then((res) => res.data);
      seTcounts({ product, category, customer, order });
    } else {
      const totalOrder = await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/agent/totalorders/${user.agent_id}`
        )
        .then((res) => res.data);
      const monthlyOrder = await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/agent/monthlyorders/${user.agent_id}`
        )
        .then((res) => res.data);
      const totalIncentive = await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/agent/incentive/${user.agent_id}`
        )
        .then((res) => res.data);
      const monthlyIncentive = await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/agent/monthlyincentive/${user.agent_id}`
        )
        .then((res) => res.data);

      seTcounts({ totalOrder, monthlyOrder, totalIncentive, monthlyIncentive });
    }
  };

  useEffect(() => {
     getCountsFc();
  }, []);

  return (
    <>
      <div className="m-2 col-span-6 lg:col-span-3">
        <div className="bg-black bg-gradient-to-b from-gray-500 to-black  text-white p-3 rounded-lg float-left w-full ">
          {console.log("What is this", counts.totalOrder)}
          {user.isAgent ? (
            <>
              <span className=" text-3xl mb-3 float-left w-full">
                Monthly Orders
              </span>
              <span className="text-5xl float-left w-50">
                {counts.monthlyOrder}
              </span>
              <DollarCircleOutlined className="text-5xl float-right" />{" "}
            </>
          ) : (
            <>
              <span className=" text-3xl mb-3 float-left w-full">
                <IntlMessages id="component.count.totalOrders" />
              </span>
              <span className="text-5xl float-left w-50">{counts.order}</span>
              <DollarCircleOutlined className="text-5xl float-right" />
            </>
          )}
        </div>
      </div>

      <div className="m-2 col-span-6 lg:col-span-3">
        <div className="bg-black bg-gradient-to-b from-gray-500 to-black  text-white p-3 rounded-lg float-left w-full ">
          {user.isAgent ? (
            <>
              <span className=" text-3xl mb-3 float-left w-full">
                Total Orders
              </span>
              <span className="text-5xl float-left w-50">
                {counts.totalOrder}
              </span>
              <UsergroupAddOutlined className="text-5xl float-right" />
            </>
          ) : (
            <>
              {" "}
              <span className=" text-3xl mb-3 float-left w-full">
                <IntlMessages id="component.count.totalCustomers" />
              </span>
              <span className="text-5xl float-left w-50">
                {counts.customer}
              </span>
              <UsergroupAddOutlined className="text-5xl float-right" />
            </>
          )}
        </div>
      </div>

      <div className="m-2 col-span-6 lg:col-span-3">
        <div className="bg-black bg-gradient-to-b from-gray-500 to-black  text-white p-3 rounded-lg float-left w-full ">
          {user.isAgent ? (
            <>
              <span className=" text-3xl mb-3 float-left w-full">
                Monthly Incentive
              </span>
              <span className="text-5xl float-left w-50">
                {counts.monthlyIncentive}
              </span>
              <OrderedListOutlined className="text-5xl float-right" />
            </>
          ) : (
            <>
              {" "}
              <span className=" text-3xl mb-3 float-left w-full">
                <IntlMessages id="component.count.totalCategories" />
              </span>
              <span className="text-5xl float-left w-50">
                {counts.category}
              </span>
              <OrderedListOutlined className="text-5xl float-right" />
            </>
          )}
        </div>
      </div>

      <div className="m-2 col-span-6 lg:col-span-3">
        <div className="bg-black bg-gradient-to-b from-gray-500 to-black  text-white p-3 rounded-lg float-left w-full ">
          {user.isAgent ? (
            <>
              {" "}
              <span className=" text-3xl mb-3 float-left w-full">
                Total Incentive
              </span>
              <span className="text-5xl float-left w-50">
                {counts.totalIncentive}
              </span>
              <CodeSandboxOutlined className="text-5xl float-right" />
            </>
          ) : (
            <>
              {" "}
              <span className=" text-3xl mb-3 float-left w-full">
                Total Variants
              </span>
              <span className="text-5xl float-left w-50">{counts.product}</span>
              <CodeSandboxOutlined className="text-5xl float-right" />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CrmCounts;
