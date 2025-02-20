import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";
import Toast from "../components/Toast";
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";



const api_base = import.meta.env.VITE_BASE_URL;

export default function AdminLayout() {
  const [isAuth, setIsAuth] = useState(null);

  const navigate = useNavigate();

  const loginCheck = async () => {
    try {
      const res = await axios.post(`${api_base}/api/user/check`, {});
      setIsAuth(true);
      navigate("/admin/products");
    } catch (error) {
      alert(error.response.data.message);
      navigate("/login");
    }
  };

  const dispatch = useDispatch();



  const logout = async ()=>{
    try {
      const res = await axios.post(`${api_base}/logout`);
      
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
      delete axios.defaults.headers.common.Authorization;

      dispatch(pushMessage({
                text:'登出成功',
                status:'success'
              }));
      navigate('/login')
    } catch (error) {
      console.log(error)
      dispatch(pushMessage({
        text:'登出失敗',
        status:'failed'
      }));
    }
  }

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common.Authorization = token;

    loginCheck();
  }, []);

  

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  aria-current="page"
                  to="/admin/products"
                >
                  後台產品頁面
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/orders">
                  訂單頁面
                </Link>
              </li>
            </ul>
            <button className="btn btn-warning" onClick={logout}>
              登出
            </button>
          </div>
        </div>
      </nav>
      {isAuth ? (
        <Outlet></Outlet>
      ) : (
        <div className="loading-overlay">
          <ReactLoading
            type="spokes"
            color="#ffc107"
            height={100}
            width={100}
          />
        </div>
      )}
      <Toast></Toast>
    </>
  );
}
