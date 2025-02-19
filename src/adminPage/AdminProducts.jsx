import axios from "axios";
import { useEffect, useState } from "react";

const api_base = import.meta.env.VITE_BASE_URL;
const api_url = import.meta.env.VITE_API_PATH;

import ReactLoading from "react-loading";

export default function AdminProducts() {
  const [isLoading, setIsLoading] = useState(false);

  const [adminProducts, setAdminProducts] = useState([]);

  const getAdminProducts = async () => {
    setIsLoading(true);
    try {
        const res = await axios.get(
            `${api_base}/api/${api_url}/admin/products/all`,
        );
        setAdminProducts(Object.values(res.data.products));
    } catch (error) {
        alert(error.response.data.message);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    getAdminProducts();
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
                <th scope="col" width="25%">
                  品名
                </th>
                <th scope="col" width="25%">
                  價格
                </th>
                <th scope="col" width="25%">
                  單位
                </th>
                <th scope="col" width="25%">
                  是否啟用
                </th>
              </tr>
            </thead>
            <tbody>
              {adminProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.unit}</td>
                  <td>{product.is_enable ? "是" : "否"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
