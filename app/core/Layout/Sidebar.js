// import React, { useEffect, useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { Layout, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  // UploadOutlined,
  DashboardOutlined,
  CheckSquareOutlined,
  OrderedListOutlined,
  DollarOutlined,
  CodeSandboxOutlined,
  DeleteRowOutlined,
  PartitionOutlined,
  PullRequestOutlined,
  FileDoneOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
  CloseSquareOutlined,
  ControlOutlined,
  ChromeOutlined,
  FileImageOutlined,
  PictureOutlined,
  UploadOutlined,
  ReadOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { RiMotorbikeFill } from "react-icons/ri";
import { BsChatRightQuote } from "react-icons/bs";
import { PiFlagBannerBold } from "react-icons/pi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa";
import { PiPersonSimpleBikeBold } from "react-icons/pi";
import { IoIosInformationCircle } from "react-icons/io";
import { CiBoxes } from "react-icons/ci";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdOutlineEventAvailable } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { GrGallery } from "react-icons/gr";
import { FaRegImage } from "react-icons/fa6";
import { RiWechatLine } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { GiFootprint } from "react-icons/gi";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdAddBusiness } from "react-icons/md";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { ImCalculator } from "react-icons/im";
import { FaSuitcase } from "react-icons/fa";
import { PiSuitcaseSimpleLight } from "react-icons/pi";
import { PiNotebookDuotone } from "react-icons/pi";
import { RxValue } from "react-icons/rx";
import { BsCartCheck } from "react-icons/bs";
import { BsBoxes } from "react-icons/bs"; // Added new icon for Prana Class Order

import { FaVideo } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { logout_r, changeCollapsed_r } from "../../../redux/actions";

import AuthService from "../../../util/services/authservice";

// import { useIntl } from "react-intl";
import IntlMessages from "../../../util/IntlMessages";

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

const Sidebar = () => {
  // const intl = useIntl();

  const dispatch = useDispatch();

  const { collapsed } = useSelector(({ settings }) => settings);
  // const { isAuthenticated, user } = useSelector(({ login }) => login);
  const { user } = useSelector(({ login }) => login);

  const { role } = user;

  function updateSize() {
    if (window.innerWidth < 770) {
      dispatch(changeCollapsed_r(true));
    } else {
      dispatch(changeCollapsed_r(false));
    }
  }

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      style={{
        maxWidth: "100%!important",
        width: "100%",
        height: "100%",
        borderRight: "1px solid #cccccc54",
      }}
    >
      <div
        className="sidebarOpenBtn"
        onClick={() => dispatch(changeCollapsed_r(!collapsed))}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </div>
      <div className="logo text-center">
        <Image
          src="/images/logo/black.png" // Replace with your image path
          alt="Logo"
          width={100}
          height={100}
        />
      </div>
      <Menu
        theme="dark"
        mode="inline"
        className="bg-black"
        defaultSelectedKeys={["1"]}
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link href="/dashboard">
            <span>
              <IntlMessages id="layout.sidebar.dashboard" />
            </span>
          </Link>
        </Menu.Item>

        {role?.ordersview ? (
          <Menu.Item key="orders" icon={<BsCart3 />}>
            <Link href="/orders/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.orders" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.ordersview ? (
          <Menu.Item key="aliveorder" icon={<BsCartCheck />}>
            <Link href="/AliveOrders/orderlist">
              <span>Alive Order</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.ordersview ? (
          <Menu.Item key="pranaclassorder" icon={<BsBoxes />}>
            <Link href="/PranaClassOrders/orderlist">
              <span>Prana Class Order</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {/* {role?.productsview ? (
          <Menu.Item key="products" icon={<CheckSquareOutlined />}>
            <Link href="/products/list">
              <span>
                <IntlMessages id="layout.sidebar.products" />
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )} */}
        {/*
        {role?.variantsview ? (
          <Menu.Item key="variants" icon={<DeleteRowOutlined />}>
            <Link href="/variants/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.variants" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )} */}

        {role?.bikevarientview ? (
          <Menu.Item key="bikevarient" icon={<RiMotorbikeFill />}>
            <Link href="/bikevarient/list">
              <span>BikeVariant</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.staffview ? (
          <Menu.Item key="staff" icon={<TeamOutlined />}>
            <Link href="/staff/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.manager" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.agentview ? (
          <Menu.Item key="agent" icon={<UsergroupAddOutlined />}>
            <Link href="/agent/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.Agent" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.incentiveview || role?.Incentiveview ? (
          <Menu.Item key="incentive" icon={<DollarOutlined />}>
            <Link href="/incentive/list">
              <span> Incentive</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.customersview ? (
          <Menu.Item key="customers" icon={<UserOutlined />}>
            <Link href="/customers/list">
              <span>
                <IntlMessages id="layout.sidebar.customers" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.storeview ? (
          <Menu.Item key="store" icon={<AimOutlined />}>
            <Link href="/store/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.store" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {/* {role?.brandsview ? (
          <Menu.Item key="brands" icon={<ChromeOutlined />}>
            <Link href="/brands/list">
              <span>
                <IntlMessages id="layout.sidebar.brands" />
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )} */}

        {/* {role?.cargoesview ? (
          <Menu.Item key="cargoes" icon={<CodeSandboxOutlined />}>
            <Link href="/cargoes/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.cargoes" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )} */}

        {/* {role?.orderstatusview ? (
          <Menu.Item key="orderstatus" icon={<PartitionOutlined />}>
            <Link href="/orderstatus/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.orderStatus" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.paymentmethodsview ? (
          <Menu.Item key="paymentmethods" icon={<PullRequestOutlined />}>
            <Link href="/paymentmethods/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.paymentMethods" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.homesliderview ? (
          <Menu.Item key="homeslider" icon={<FileImageOutlined />}>
            <Link href="/homeslider/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.homeSlider" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.topmenuview ? (
          <Menu.Item key="topmenu" icon={<FileDoneOutlined />}>
            <Link href="/topmenu/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.topMenuContent" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )} */}
        {role?.homeview ? (
          <Menu.SubMenu title={"Home Page"} icon={<FaHome color="black" />}>
            {role?.bannerview ? (
              <Menu.Item key="banner" icon={<PiFlagBannerBold />}>
                <Link href="/banner/list">
                  <span>Home Banner</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {role?.categoriesview ? (
              <Menu.Item key="categories" icon={<OrderedListOutlined />}>
                <Link href="/categories/list">
                  <span>
                    <IntlMessages id="layout.sidebar.categories" />{" "}
                  </span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}{" "}
            {role?.newsview ? (
              <Menu.Item key="news" icon={<HiOutlineNewspaper />}>
                <Link href="/news/list">
                  <span>News & Events</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {role?.testimonialview ? (
              <Menu.Item key="testimonial" icon={<BsChatRightQuote />}>
                <Link href="/testimonial/list">
                  <span>Testimonial</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {role?.partnerview ? (
              <Menu.Item key="partnerbanner" icon={<FaRegHandshake />}>
                <Link href="/partner/list">
                  <span>Partner</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
          </Menu.SubMenu>
        ) : (
          ""
        )}
        {role?.aboutview ? (
          <Menu.SubMenu
            title={"Aboutus Page"}
            icon={<FaInfoCircle color="black" />}
          >
            {role?.aboutusview ? (
              <Menu.Item key="aboutus" icon={<IoIosInformationCircle />}>
                <Link href="/aboutus/list">
                  <span>AboutUs Banner</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
          </Menu.SubMenu>
        ) : (
          ""
        )}
        {role?.pranaview ? (
          <Menu.SubMenu
            title={"Prana Page"}
            icon={<BsBoxSeamFill color="black" />}
          >
            {role?.productbannerview ? (
              <Menu.Item key="productbanner" icon={<CiBoxes />}>
                <Link href="/productbanner/list">
                  <span>Prana Banner</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}

            {role?.faqview ? (
              <Menu.Item key="faq" icon={<FaRegQuestionCircle />}>
                <Link href="/faq/list">
                  <span>FAQ</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {role?.accessoriesview ? (
              <Menu.Item key="accessories" icon={<IoBagCheckOutline />}>
                <Link href="/accessories/list">
                  <span>Accessories</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
          </Menu.SubMenu>
        ) : (
          ""
        )}
        {/* {role?.galleryview ? (
          <Menu.SubMenu title={"Upload Gallery"} icon={<PictureOutlined />}>
            {role?.imagegalleryview ? (
              <Menu.Item key="imagegallery" icon={<FaRegImage />}>
                <Link href="/imagegallery/list">
                  <span>Image Gallery</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {role?.videogalleryview ? (
              <Menu.Item key="videogallery" icon={<FaVideo />}>
                <Link href="/videogallery/list">
                  <span>Video Gallery</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
          </Menu.SubMenu>
        ) : (
          ""
        )} */}
        {role?.careerapplicationview ? (
          <Menu.SubMenu
            title={"Career Page"}
            icon={<PiSuitcaseSimpleLight color="black" />}
          >
            {role?.careerview ? (
              <Menu.Item key="career" icon={<FaSuitcase />}>
                <Link href="/career/list">
                  <span>Carrer List</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
            {role?.applicationview ? (
              <Menu.Item key="application" icon={<PiNotebookDuotone />}>
                <Link href="/application/list">
                  <span>Career Application</span>
                </Link>
              </Menu.Item>
            ) : (
              ""
            )}
          </Menu.SubMenu>
        ) : (
          ""
        )}
        {role?.visitusview ? (
          <Menu.Item key="vistus" icon={<FaMapMarkedAlt />}>
            <Link href="/visitus/list">
              <span>Contact Us</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.footerview ? (
          <Menu.Item key="footer" icon={<GiFootprint />}>
            <Link href="/footer/list">
              <span>Footer</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        <Menu.Item key="brochure" icon={<LuFileSpreadsheet />}>
          <Link href="/brochure/list">
            <span>Brochure</span>
          </Link>
        </Menu.Item>

        {role?.valuesview ? (
          <Menu.Item key="value" icon={<RxValue />}>
            <Link href="/values/list">
              <span>Value</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.demoview ? (
          <Menu.Item key="demo" icon={<PiPersonSimpleBikeBold />}>
            <Link href="/demo/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.demo" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.blogsview ? (
          <Menu.Item key="blogs" icon={<ReadOutlined />}>
            <Link href="/blogs/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.blogs" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.galleryview ? (
          <Menu.Item key="gallery" icon={<MdAddBusiness />}>
            <Link href="/gallery/list">
              <span>Gallery</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.dealerview ? (
          <Menu.Item key="dealer" icon={<MdAddBusiness />}>
            <Link href="/dealer/list">
              <span>Dealer</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}

        {role?.enquiryview ? (
          <Menu.Item key="enquiry" icon={<RiWechatLine />}>
            <Link href="/enquiry/list">
              <span>Enquiry</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {role?.enquiryview ? (
          <Menu.Item key="tco" icon={<ImCalculator />}>
            <Link href="/tco/list">
              <span>TCO</span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )}
        {/* {role?.superadmin ? (
          <Menu.Item key="settings" icon={<ControlOutlined />}>
            <Link href="/settings/list">
              <span>
                {" "}
                <IntlMessages id="layout.sidebar.settings" />{" "}
              </span>
            </Link>
          </Menu.Item>
        ) : (
          ""
        )} */}
        <Menu.Item
          key="/signin"
          icon={<CloseSquareOutlined />}
          onClick={async () => {
            await dispatch(logout_r());
            AuthService.logout();
          }}
        >
          <Link href="/signin">
            <span>
              {" "}
              <IntlMessages id="layout.sidebar.logout" />{" "}
            </span>
          </Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;