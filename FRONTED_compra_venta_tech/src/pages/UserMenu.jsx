// src/components/UserMenu.jsx
import React from "react";
import { Route, Routes, NavLink } from "react-router-dom";
import "../styles/userMenu.css";
import BuysList from "./BuysList";
// import SalesList from "./SalesList";
import ProductsList from "./ProductsList";
import RequestList from "./RequestsList";
import UserDataAndChangePass from "./UserDataAndChangePass";
import useUserData from "../hooks/useUserData";
import useAverageRating from "../hooks/useAverageRating";
import ApiImage from "../components/Post/ApiImage";
import Rating from "../components/Rating/Rating";
import UserProfileView from "./UserProfileView";
import ConfirmDeleteProd from "./ConfirmDeleteProd";
import Review from "./Review";

const { VITE_USER_ICON } = import.meta.env;

export default function UserMenu() {
  const { userData } = useUserData();
  const { averageUserRating, numberOfRatings } = useAverageRating();

  return (
    <div className="user-menu">
      {/* Mobile header */}
      <header className="mobile-header">
        <nav className="mobile-nav">
          <NavLink to="/user" end className="mobile-link perfil-link">
            Perfil
          </NavLink>
          <NavLink to="/user/buys-list" className="mobile-link compras-link">
            Compras
          </NavLink>
          <NavLink to="/user/products-list" className="mobile-link productos-link">
            Productos
          </NavLink>
          <NavLink to="/user/requests-list" className="mobile-link solicitudes-link">
            Solicitudes
          </NavLink>
        </nav>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li>
            <NavLink
              to="/user"
              end
              className={({ isActive }) =>
                isActive
                  ? "menu-link active perfil-link"
                  : "menu-link perfil-link"
              }
            >
              <div className="current-avatar-menu">
                <ApiImage
                  name={userData?.avatar ?? VITE_USER_ICON}
                  alt=""
                  className="profile-image-menu"
                />
              </div>
              <div className="menu-rating">
                <strong>{userData?.username}</strong>
                <Rating className="rating" value={averageUserRating} />
                <span className="rating-count">
                  {numberOfRatings} valoracion
                  {numberOfRatings !== 1 ? "es" : ""}
                </span>
                <span className="menu-date">
                  En SegundaTec desde{" "}
                  {new Date(userData?.created_at).getFullYear()}
                </span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/buys-list"
              className={({ isActive }) =>
                isActive
                  ? "menu-link active compras-link"
                  : "menu-link compras-link"
              }
            >
              <img
                src="/src/assets/icono_compras.png"
                alt="Compras"
                className="menu-link__icon"
              />
              <span>Compras</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/products-list"
              className={({ isActive }) =>
                isActive
                  ? "menu-link active productos-link"
                  : "menu-link productos-link"
              }
            >
              <img
                src="/src/assets/icono_productos.png"
                alt="Productos"
                className="menu-link__icon"
              />
              <span>Productos</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/requests-list"
              className={({ isActive }) =>
                isActive
                  ? "menu-link active solicitudes-link"
                  : "menu-link solicitudes-link"
              }
            >
              <img
                src="/src/assets/icono_solicitudes.png"
                alt="Solicitudes"
                className="menu-link__icon"
              />
              <span>Solicitudes</span>
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="content-profile">
        <Routes>
          <Route index element={<UserProfileView />} />
          <Route path="edit" element={<UserDataAndChangePass />} />
          <Route path="buys-list" element={<BuysList />} />
          <Route path="products-list" element={<ProductsList />} />
          <Route path="requests-list" element={<RequestList />} />
          <Route path="confirm-delete/:id" element={<ConfirmDeleteProd />} />
          <Route path="review/:id" element={<Review />} />
        </Routes>
      </main>
    </div>
  );
}
