import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

const api_base = import.meta.env.VITE_BASE_URL;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isAuth, setIsAuth] = useState(false);

  const navigate = useNavigate();

  const loginCheck = async () => {
    try {
      const res = await axios.post(`${api_base}/api/user/check`, {});
      setIsAuth(true);
      navigate("/admin/products");
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsAuth(false);
    }
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    axios.defaults.headers.common.Authorization = token;

    loginCheck();
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${api_base}/admin/signin`, {
        username: data.email,
        password: data.password,
      });
      const { token, expired } = res.data;
      document.cookie = `token=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      loginCheck();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container my-5">
      {isAuth ? (
        <div className="loading-overlay">
          <ReactLoading
            type="spokes"
            color="#ffc107"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row my-3">
            <div className="col-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
            </div>
            <div className="col-9">
              <input
                id="email"
                {...register("email", {
                  required: "請輸入email",
                  pattern: {
                    value: /^[a-zA-Z0-9._]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "請輸入有效email格式",
                  },
                })}
                className="form-control"
                placeholder="請輸入email"
                type="email"
              />
              <div className="my-2 ms-1 text-danger">
                {errors.email ? errors.email.message : ""}
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="col-3">
              <label htmlFor="password" className="form-label">
                密碼
              </label>
            </div>
            <div className="col-9">
              <input
                id="password"
                {...register("password", {
                  required: "請輸入密碼",
                })}
                className="form-control"
                placeholder="請輸入密碼"
                type="password"
              />
              <div className="my-2 ms-1 text-danger">
                {errors.password ? errors.password.message : ""}
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-warning btn-lg float-end">
            登入
          </button>
        </form>
      )}
    </div>
  );
}
