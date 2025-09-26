// import React, { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Layout, Avatar, Menu, Dropdown, Button, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import { FaCheckCircle, FaStar } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import {
  logout_r,
  changeCollapsed_r,
  switchLanguage,
} from "../../../redux/actions";

import AuthService from "../../../util/services/authservice";
// import { languageData } from "../../../../config";
import { languageData } from "../../../settings";
import router from "next/router";

const { Header } = Layout;

const Sidebar = () => {
  const dispatch = useDispatch();
  const [size, setSize] = useState([0, 0]);
  const { user } = useSelector(({ login }) => login);

  const { role } = user;
  console.log("role", user);

  let sale = user.sales;
  let color;

  if (sale >= 100) {
    color = "#800080"; // purple
  } else if (sale >= 50) {
    color = "#FFD700"; // Gold
  } else {
    color = "#C0C0C0"; // Silver
  }
  useEffect(() => {
    if (size[0] > 770) {
      dispatch(changeCollapsed_r(false));
    }

    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {}, []);

  return (
    <Header className="site-layout-background">
      <Dropdown
        placement="topRight"
        arrow
        className="float-right w-22"
        overlay={
          <Menu>
            {role.superadmin ? (
              <Menu.Item key="0">
                <Link href={"/staff/" + user.id}>Profile</Link>
              </Menu.Item>
            ) : user.isStaff ? (
              <Menu.Item key="0">
                <Link href={"/staff/" + user.id}>Profile</Link>
              </Menu.Item>
            ) : user.isCustomer ? (
              <Menu.Item key="0">
                <Link href={"/customer/" + user.id}>Profile</Link>
              </Menu.Item>
            ) : user.isAgent ? (
              <Menu.Item key="0">
                <Link href={"/agent/" + user.agent_id}>Profile</Link>
              </Menu.Item>
            ) : null}

            <Menu.Divider key="2" />
            <Menu.Item
              key="3"
              onClick={async () => {
                await dispatch(logout_r());
                AuthService.logout();
                router.push("/signin");
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        }
      >
        <Button type="text" style={{ display: "flex", alignItems: "center" }}>
          {user.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_IMG_URL}` + user.image} // Assuming user object has an 'imageUrl' property
              alt={<UserOutlined />}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            />
          ) : (
            <FaUserCircle
              style={{
                color: "green",
                width: "30px",
                height: "30px",
                marginRight: "5px",
              }}
            />
          )}

          <div>
            <p
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: "5px",
              }}
            >
              <span>{user.name}</span>
              {user.isAgent ||
                (user.role["superadmin"] && (
                  <FaCheckCircle
                    style={{ color: "green", marginLeft: "5px" }}
                  />
                ))}
            </p>

            {user.isAgent && (
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "5px",
                }}
              >
                {" "}
                <span>Green Champion </span>
                <FaStar color={color} />
              </p>
            )}
          </div>
        </Button>
      </Dropdown>
    </Header>
  );
};

export default Sidebar;

{
  /* <Select
    showSearch
    className="float-right w-22"
    defaultValue={JSON.stringify(locale)}
    bordered={false}
    filterOption={(input, option) =>
      option.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    onChange={(newValue) => {
      dispatch(switchLanguage(JSON.parse(newValue)));
    }}
  >
    {languageData.map((language) => (
      <Select.Option
        key={JSON.stringify(language)}
        value={JSON.stringify(language)}
      >
        {String(language.name)}
      </Select.Option>
    ))}
  </Select> */
}
