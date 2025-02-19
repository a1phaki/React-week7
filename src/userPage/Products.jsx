import axios from "axios";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";

const api_base = import.meta.env.VITE_BASE_URL;
const api_url = import.meta.env.VITE_API_PATH;

export default function Product() {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const getProduct = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${api_base}/api/${api_url}/products/all`);
      setProducts(res.data.products);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
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
          <div className="row g-3">
            {products.map((product) => (
              <div className="col-3" key={product.id}>
                <div className="card h-100">
                  <img
                    src={product.imageUrl}
                    className="card-img-top custom-card-img"
                    alt={`${product.title}圖片`}
                  />
                  <div className="card-body">
                    <h4 className="card-title">{product.title}</h4>
                    <p className="card-text">{product.description}</p>
                    <p className="fw-bold card-text">
                      價格：<span className="fw-normal">{product.price}元</span>
                    </p>
                    <p className="card-text">
                      <small className="text-muted">單位：{product.unit}</small>
                    </p>
                    <Link className="btn btn-warning" to={product.id}>
                      查看更多
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
