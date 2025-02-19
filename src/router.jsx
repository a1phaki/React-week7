import { createHashRouter } from "react-router-dom";

import UserLayout from "./layout/UserLayout";
import Home from "./userPage/Home";
import Product from "./userPage/Products";
import SingleProduct from "./userPage/SingleProduct";
import Cart from "./userPage/Cart";
import Login from "./userPage/Login";

import AdminLayout from "./layout/AdminLayout";
import AdminOrders from "./adminPage/AdminOrders";
import AdminProducts from "./adminPage/AdminProducts";

import NotFound from "./layout/NotFound";

export const router = createHashRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product",
        element: <Product />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path:'*',
    element:<NotFound />
  },
]);
