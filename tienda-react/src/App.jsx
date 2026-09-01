import { useState, useEffect } from "react";
import ProductoCard from "./components/ProductoCard";
import FormularioProducto from "./components/FormularioProducto";
import { productos as productosIniciales } from "./data/productos";
import "./App.css";

function App() {
  const [mensaje, setMensaje] = useState("");
  const obtenerProductosIniciales = () => {
    const guardados = localStorage.getItem("inventario");
    if (guardados) {
      return JSON.parse(guardados);
    }
    return productosIniciales;
  };

  const [productos, setProductos] = useState(obtenerProductosIniciales);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem("inventario", JSON.stringify(productos));
  }, [productos]);

  const restaurarInventario = () => {
    localStorage.removeItem("inventario");
    setProductos(productosIniciales);
    setProductoEditando(null);
  };

const agregarProducto = (nuevoProducto) => {
  setProductos([...productos, nuevoProducto]);
  setMensaje("Producto agregado correctamente.");

  setTimeout(() => {
    setMensaje("");
  }, 3000);
};

const actualizarProducto = (actualizado) => {
  const nuevaLista = productos.map((producto) =>
    producto.id === actualizado.id ? actualizado : producto
  );

  setProductos(nuevaLista);
  setProductoEditando(null);

  setMensaje("Producto actualizado correctamente.");

  setTimeout(() => {
    setMensaje("");
  }, 3000);
};

  const eliminarProducto = (id) => {
    const nuevaLista = productos.filter((producto) => producto.id !== id);
    setProductos(nuevaLista);
    if (productoEditando && productoEditando.id === id) {
      setProductoEditando(null);
    }
  };

  const modificarStock = (id, cambio) => {
    const nuevosProductos = productos.map((producto) => {
      if (producto.id === id) {
        return {
          ...producto,
          stock: Math.max(0, producto.stock + cambio),
        };
      }
      return producto;
    });
    setProductos(nuevosProductos);
  };

  // --- ESTADOS DE BÚSQUEDA, FILTROS Y ORDENAMIENTO ---
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // "todos", "disponibles", "agotados"
  const [criterioOrden, setCriterioOrden] = useState("nombre-asc");

  // 1. Filtrado de productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === "Todas" || producto.categoria === categoria;

    let coincideEstado = true;
    if (filtroEstado === "disponibles") {
      coincideEstado = producto.stock > 0;
    } else if (filtroEstado === "agotados") {
      coincideEstado = producto.stock === 0;
    }

    return coincideNombre && coincideCategoria && coincideEstado;
  });

  // 2. Ordenamiento sobre una copia del arreglo filtrado
  const productosProcesados = [...productosFiltrados].sort((a, b) => {
    switch (criterioOrden) {
      case "nombre-asc":
        return a.nombre.localeCompare(b.nombre);
      case "precio-asc":
        return a.precio - b.precio;
      case "precio-desc":
        return b.precio - a.precio;
      case "stock-asc":
        return a.stock - b.stock;
      case "stock-desc":
        return b.stock - a.stock;
      default:
        return 0;
    }
  });

  // Cálculos para el panel resumen
  const disponibles = productosFiltrados.filter(
    (producto) => producto.stock > 0
  );

  const productosAgotados = productosFiltrados.filter(
    (producto) => producto.stock === 0
  );

  const valorInventario = productosFiltrados.reduce(
    (total, producto) => total + producto.precio * producto.stock,
    0
  );

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoria("Todas");
    setFiltroEstado("todos");
    setCriterioOrden("nombre-asc");
  };

  return (
    <main className="contenedor">
      <h1>🛒 Tienda Tecnológica</h1>

      <div
        style={{
          marginBottom: "32px",
          padding: "20px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <FormularioProducto
          onAgregar={agregarProducto}
          productoEditando={productoEditando}
          onActualizar={actualizarProducto}
        />
      </div>

      <div className="resumen-panel">
        <div className="resumen-item">
          <span className="resumen-label">Total Productos</span>
          <span className="resumen-valor">{productosFiltrados.length}</span>
        </div>

        <div className="resumen-item">
          <span className="resumen-label">Disponibles</span>
          <span className="resumen-valor">{disponibles.length}</span>
        </div>

        <div className="resumen-item">
          <span className="resumen-label">Agotados</span>
          <span className="resumen-valor">{productosAgotados.length}</span>
        </div>

        <div className="resumen-item">
          <span className="resumen-label">Valor del Inventario</span>
          <span className="resumen-valor">
            ${valorInventario.toLocaleString("es-CO")}
          </span>
        </div>
      </div>

      {productosAgotados.length > 0 && (
        <div className="alerta-agotados">
          ⚠️ Atención: Hay productos agotados en esta búsqueda.
        </div>
      )}

      <h2>Catálogo de Productos</h2>

      <div className="controles-filtros" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
        {/* Búsqueda por nombre */}
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />

        {/* Filtro por Categoría */}
        <select
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
        >
          <option value="Todas">Todas las categorías</option>
          <option value="Periféricos">Periféricos</option>
          <option value="Pantallas">Pantallas</option>
          <option value="Audio">Audio</option>
          <option value="Mobiliario">Mobiliario</option>
          <option value="Video">Video</option>
        </select>

        {/* Filtro por Estado */}
        <select
          value={filtroEstado}
          onChange={(evento) => setFiltroEstado(evento.target.value)}
        >
          <option value="todos">Todos los estados</option>
          <option value="disponibles">Disponibles</option>
          <option value="agotados">Agotados</option>
        </select>

        {/* Ordenamiento */}
        <select
          value={criterioOrden}
          onChange={(evento) => setCriterioOrden(evento.target.value)}
        >
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="precio-asc">Precio: Menor a Mayor</option>
          <option value="precio-desc">Precio: Mayor a Menor</option>
          <option value="stock-asc">Stock: Menor a Mayor</option>
          <option value="stock-desc">Stock: Mayor a Menor</option>
        </select>

        <button type="button" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      <p>Productos encontrados: {productosProcesados.length}</p>

      {productosProcesados.length === 0 ? (
        <p>No se encontraron productos con los criterios seleccionados.</p>
      ) : null}

      <section className="productos">
        {productosProcesados.map((producto) => (
          <ProductoCard
            key={producto.id}
            producto={producto}
            onEliminar={eliminarProducto}
            onModificarStock={modificarStock}
            onEditar={(p) => setProductoEditando(p)}
          />
        ))}
      </section>

      <button
        type="button"
        className="btn-restaurar-flotante"
        onClick={restaurarInventario}
      >
        🔄 Restaurar inventario
      </button>
    </main>
  );
}

export default App;