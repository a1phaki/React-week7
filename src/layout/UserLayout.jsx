import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/">
                  首頁
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/product">
                  產品頁面
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">
                  購物車頁面
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  登入頁面
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Outlet></Outlet>
    </>
  );
}
