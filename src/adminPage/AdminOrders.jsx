import axios from "axios";
import { useEffect, useState } from "react";

const api_base = import.meta.env.VITE_BASE_URL;
const api_url = import.meta.env.VITE_API_PATH;

import ReactLoading from "react-loading";

export default function AdminOrders() {
  const [isLoading, setIsLoading] = useState(false);

  const [orders, setOrders] = useState([]);

  const getOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${api_base}/api/${api_url}/admin/orders?=page${page}`,
      );
      setOrders(res.data.orders);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay">
          <ReactLoading
            type="spokes"
            color="#ffc107"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" width="33%">
                  訂單編號
                </th>
                <th scope="col" width="33%">
                  是否付費
                </th>
                <th scope="col" width="33%">
                  總金額
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.is_paid ? "是" : "否"}</td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
