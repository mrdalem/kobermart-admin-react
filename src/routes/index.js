import React from "react";
import { Redirect } from "react-router-dom";

// User profile
import UserProfile from "../pages/Authentication/UserProfile";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ComingSoon from "../pages/Utility/ComingSoon";
import PrivacyPolicy from "../pages/Utility/PrivacyPolicy";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Anggota
import Member from "../pages/Member/index";

// Transaksi
import Transactions from "../pages/Transaction/index";

//PPOB
import RiwayatTransaksiPpob from "../pages/Ppob/RiwayatTransaksi";
import ProdukPrepaidPpob from "../pages/Ppob/ProdukPrepaid";
import ProdukPostpaidPpob from "../pages/Ppob/ProdukPostpaid";

// SHOP
import Order from "../pages/Shop/Order";
import Product from "../pages/Shop/Product";
import Supplier from "../pages/Shop/Supplier";
import ProductCategory from "../pages/Shop/Category";
import Warehouse from "../pages/Shop/Warehouse";



//Setting
import MainSetting from "../pages/Setting/MainSetting";

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },

  { path: "/member", component: Member },

  //profile
  { path: "/profile", component: UserProfile },

  //ppob
  { path: "/riwayat-transaksi-ppob", component: RiwayatTransaksiPpob },
  { path: "/produk-prepaid-ppob", component: ProdukPrepaidPpob },
  { path: "/produk-postpaid-ppob", component: ProdukPostpaidPpob },

  //transaksi
  { path: "/transactions", component: Transactions },

  //Shop
  { path: "/shop-order", component: Order },
  { path: "/shop-product", component: Product },
  { path: "/shop-supplier", component: Supplier },
  { path: "/shop-category", component: ProductCategory },
  { path: "/shop-warehouse", component: Warehouse },

  //setting
  { path: "/setting", component: MainSetting },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/welcome", exact: true, component: ComingSoon },
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/privacy-policy", component: PrivacyPolicy },
];

export { authProtectedRoutes, publicRoutes };
