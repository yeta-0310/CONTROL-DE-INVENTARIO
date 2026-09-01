function ProductoCard({ producto, onEliminar, onModificarStock, onEditar }) {
  const {
    id,
    nombre,
    precio,
    categoria,
    stock,
    imagen
  } = producto;

  const estado = stock > 0 ? "Disponible" : "Agotado";
  
  const formatearPrecio = (valor) => {
    return valor ? valor.toLocaleString("es-CO") : "0";
  };

  return (
    <article className="producto-card">
      <div className="imagen-contenedor">
        <img
          src={
            imagen ||
            "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80"
          }
          alt={nombre}
          className="producto-imagen"
        />

        <span
          className={
            stock > 0 ? "badge disponible" : "badge agotado"
          }
        >
          {estado}
        </span>
      </div>

      <div className="producto-info">
        <span className="categoria-tag">{categoria}</span>
        <h3 className="producto-titulo">{nombre}</h3>

        <div className="producto-footer">
          <p className="producto-precio">${formatearPrecio(precio)}</p>
        </div>

        <div className="stock-control">
          <button
            type="button"
            className="btn-control"
            onClick={() => onModificarStock(id, -1)}
            disabled={stock === 0}
          >
            -
          </button>
          <span>Stock: {stock}</span>
          <button
            type="button"
            className="btn-control"
            onClick={() => onModificarStock(id, 1)}
          >
            +
          </button>
        </div>
        {stock > 0 && stock <= 2 && (
          <p className="stock-bajo">
            Stock bajo
          </p>
        )}

        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => onEditar(producto)}
            style={{ flex: 1, backgroundColor: "#f59e0b", color: "white" }}
          >
            Editar
          </button>

          <button
            type="button"
            className="btn-eliminar"
            onClick={() => onEliminar(id)}
            style={{ flex: 1 }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductoCard;