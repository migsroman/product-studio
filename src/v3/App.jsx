import { useState, useCallback, useEffect } from "react";
import Shell from "./components/Shell";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import { PRODUCTS } from "./data/products";

// Simple hash-based router
function useHashRouter() {
  const [hash, setHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((path) => {
    window.location.hash = path;
    setHash("#" + path);
  }, []);

  return { hash, navigate };
}

function parseRoute(hash) {
  const path = hash.replace(/^#/, "") || "/";
  if (path === "/" || path === "/product-studio") {
    return { page: "list" };
  }
  const productMatch = path.match(/^\/product-studio\/products\/(.+?)(?:\/(.+))?$/);
  if (productMatch) {
    return { page: "detail", productId: productMatch[1], tab: productMatch[2] || "overview" };
  }
  return { page: "list" };
}

export default function App() {
  const { hash, navigate } = useHashRouter();
  const route = parseRoute(hash);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);

  // Build breadcrumb based on route
  let breadcrumb = [
    { label: "Product Studio", icon: "🏗", onClick: () => handleNavigate("/product-studio") },
  ];

  if (route.page === "detail") {
    const product = PRODUCTS.find((p) => p.id === route.productId);
    breadcrumb.push({ label: "Products", onClick: () => handleNavigate("/product-studio") });
    if (product) {
      breadcrumb.push({
        label: product.name,
        badge: `${product.version} ${product.status === 'draft' ? 'Draft' : product.status === 'active' ? 'Active' : product.status}`,
      });
    }
  }

  return (
    <Shell breadcrumb={breadcrumb} activeNav="package">
      {route.page === "list" && (
        <div className="p-6">
          <ProductList
            onNavigate={handleNavigate}
            onCreateProduct={() => setShowCreateModal(true)}
            showCreateModal={showCreateModal}
            onCloseCreateModal={() => setShowCreateModal(false)}
          />
        </div>
      )}
      {route.page === "detail" && (
        <ProductDetail
          productId={route.productId}
          activeTab={route.tab}
          onNavigate={handleNavigate}
        />
      )}
    </Shell>
  );
}
