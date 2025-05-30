import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/EditProduct.css";

const { VITE_API_URL } = import.meta.env;

export default function EditProduct() {
  const { token } = useAuth();
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Lista de ciudades principales de España
  const cities = [
    "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Girona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Islas Baleares",
  "Jaén",
  "La Rioja",
  "León",
  "Lleida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Ourense",
  "Palencia",
  "Pontevedra",
  "Las Palmas",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza"
];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    locality: "",
    category_id: "",
    photo: null,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/products/${productId}`);
        const data = await res.json();
        const product = data.data;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          locality: product.locality,
          category_id: product.category_id,
          photo: null,
        });

        setOriginalPhoto(product.photo);
      } catch {
        setSubmitMessage("No se pudo cargar el producto.");
      }
    };

    fetchProduct();
  }, [productId]);

  // Cargar categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/categories`);
        const data = await res.json();
        setCategories(data.data);
      } catch {
        setSubmitMessage("No se pudieron cargar las categorías.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, photo: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) body.append(key, val);
    });

    try {
      const res = await fetch(`${VITE_API_URL}/products/${productId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      // Marcar como no aceptado tras actualizar
      await fetch(`${VITE_API_URL}/products/${productId}/no-accept`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      setSubmitMessage("¡Producto actualizado correctamente! ✅");
      setPreview(null);
      setTimeout(() => navigate("/user/products-list"), 2000);
    } catch (error) {
      setSubmitMessage(error.message || "Error al actualizar el producto.");
    }
  };

  return (
    <section className="publish-wrapper">
      <h2 className="page-title">Editar producto</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="publish-form"
      >
        <div className="form-sections">
          <div className="info-box">
            <h3>Información del producto</h3>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Precio (€)"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />

            {/* Desplegable de ciudades */}
            <select
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una ciudad</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="photo-box">
            <h3>Foto del producto</h3>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              ref={fileInputRef}
            />
            {preview ? (
              <img src={preview} alt="Preview" className="photo-preview" />
            ) : originalPhoto ? (
              <img
                src={`${VITE_API_URL}/uploads/${originalPhoto}`}
                alt="Producto"
                className="photo-preview"
              />
            ) : null}
          </div>
        </div>

        {submitMessage && (
          <p
            className={`feedback-message ${
              submitMessage.includes("✅") ? "success" : "error"
            }`}
          >
            {submitMessage}
          </p>
        )}

        <div className="publish-buttons">
          <button type="submit" className="publish-button">
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => navigate("/user/products-list")}
            className="reset-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}
