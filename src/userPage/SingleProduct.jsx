import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import ReactLoading from "react-loading";

const api_base = import.meta.env.VITE_BASE_URL;
const api_url = import.meta.env.VITE_API_PATH;

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getSingleProduct = async (id) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${api_base}/api/${api_url}/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addCart = async (e, id) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${api_base}/api/${api_url}/cart`, {
        data: {
          product_id: id,
          qty: 1,
        },
      });

      navigate("/cart");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getSingleProduct(id);
  }, [id]);

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
        <div className="container row">
          <div className="col-3">
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
                <Link
                  className="btn btn-warning"
                  to="/cart"
                  onClick={(e) => addCart(e, product.id)}
                >
                  加入購物車
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
