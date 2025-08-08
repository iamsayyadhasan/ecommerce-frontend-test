import React, { useEffect, useState } from "react";
import { Navbar, Footer } from "../components";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true; // ✅ Safe mount flag

    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const data = await res.json();
        if (isMounted) {
          const updated = data.map((p, index) => ({
            ...p,
            inStock: index % 2 === 0,
            variants: ["Small", "Medium", "Large"],
          }));
          setProducts(updated);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false; 
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row g-4">
          {products.map((product, idx) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
              key={product.id}
            >
              <div
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card"
                style={{
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Product Image */}
                <div
                  className="bg-light p-3 d-flex align-items-center justify-content-center"
                  style={{ height: "250px" }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-semibold text-truncate">
                    {product.title}
                  </h6>
                  <p className="text-primary fw-bold mb-2">
                    ${product.price}
                  </p>

                  {/* Variants */}
                  <select className="form-select form-select-sm mb-3 rounded-pill border-0 shadow-sm">
                    {product.variants.map((v, i) => (
                      <option key={i}>{v}</option>
                    ))}
                  </select>

                  {/* Buy Now Link */}
                  <Link
                    to={`/product/${product.id}`}
                    className="btn btn-dark w-100 rounded-pill mb-2"
                  >
                    Buy Now
                  </Link>

                  {/* Stock Button */}
                  {product.inStock ? (
                    <button
                      className="btn btn-primary w-100 rounded-pill mt-auto"
                      onClick={() => dispatch(addCart(product))}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-secondary w-100 rounded-pill mt-auto"
                      disabled
                    >
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
