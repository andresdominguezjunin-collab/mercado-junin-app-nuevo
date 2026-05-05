import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDqfxHz2T8cRhm4YHgavgG6fe7_sio_G0",
  authDomain: "mercado-junin.firebaseapp.com",
  projectId: "mercado-junin",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState("home");
  const [imagenGrande, setImagenGrande] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  const [usuario, setUsuario] = useState({ nombre: "", whatsapp: "" });

  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    categoria: "General"
  });

  const categorias = ["Todas", "Comida", "Ropa", "Hogar", "Servicios", "Otros"];

  // 🔹 Cargar productos
  const cargarProductos = async () => {
    const snap = await getDocs(collection(db, "productos"));
    const lista = [];
    snap.forEach(doc => lista.push({ ...doc.data(), id: doc.id }));
    setProductos(lista);
  };

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");
    if (guardado) setUsuario(JSON.parse(guardado));
    cargarProductos();
  }, []);

  useEffect(() => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }, [usuario]);

  const guardarProducto = async () => {
    if (!nuevo.nombre || !nuevo.precio || !usuario.whatsapp) {
      alert("Completá todos los datos");
      return;
    }

    await addDoc(collection(db, "productos"), {
      ...nuevo,
      vendedor: usuario.nombre,
      whatsapp: usuario.whatsapp
    });

    setNuevo({ nombre: "", precio: "", imagen: "", categoria: "General" });
    setVista("home");
    cargarProductos();
  };

  const compartir = (p) => {
    const mensaje = `Mirá este producto 👇
${p.nombre}
💲 ${p.precio}
📲 https://wa.me/${p.whatsapp}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`);
  };

  // 🔹 FILTRO COMBINADO
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaActiva === "Todas" || p.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  // 🏠 HOME
  if (vista === "home") {
    return (
      <div style={bg}>
        <div style={card}>

          {/* HEADER */}
          <div style={header}>
            <h2>🛍 Mercado Junín</h2>
            <button onClick={() => setVista("cuenta")} style={btnCuenta}>
              Mi cuenta
            </button>
          </div>

          {/* BUSCADOR */}
          <input
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={inputBusqueda}
          />

          {/* CATEGORÍAS */}
          <div style={categoriasContainer}>
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                style={{
                  ...btnCategoria,
                  background: categoriaActiva === cat ? "#2a5298" : "#eee",
                  color: categoriaActiva === cat ? "white" : "black"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PRODUCTOS */}
          {productosFiltrados.map(p => (
            <div key={p.id} style={producto}>

              {p.imagen && (
                <img
                  src={p.imagen}
                  style={imagen}
                  onClick={() => setImagenGrande(p.imagen)}
                />
              )}

              <h3>{p.nombre}</h3>
              <p style={{ fontWeight: "bold" }}>${p.precio}</p>
              <p style={{ fontSize: 12, color: "#666" }}>{p.categoria}</p>

              <div style={{ display: "flex", gap: 10 }}>
                <a href={`https://wa.me/${p.whatsapp}`} target="_blank">
                  <button style={btnComprar}>Comprar</button>
                </a>

                <button onClick={() => compartir(p)} style={btnCompartir}>
                  Compartir
                </button>
              </div>

            </div>
          ))}

          {imagenGrande && (
            <div style={modal} onClick={() => setImagenGrande(null)}>
              <img src={imagenGrande} style={{ maxWidth: "90%" }} />
            </div>
          )}

        </div>
      </div>
    );
  }

  // 👤 CUENTA
  return (
    <div style={bg}>
      <div style={card}>

        <button onClick={() => setVista("home")} style={btnVolver}>
          ← Volver
        </button>

        <h3>Mis datos</h3>

        <input
          placeholder="Nombre"
          value={usuario.nombre}
          onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
          style={input}
        />

        <input
          placeholder="WhatsApp"
          value={usuario.whatsapp}
          onChange={(e) => setUsuario({ ...usuario, whatsapp: e.target.value })}
          style={input}
        />

        <h3>Publicar producto</h3>

        <input
          placeholder="Nombre del producto"
          value={nuevo.nombre}
          onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          style={input}
        />

        <input
          placeholder="Precio"
          value={nuevo.precio}
          onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })}
          style={input}
        />

        {/* CATEGORÍA */}
        <select
          value={nuevo.categoria}
          onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })}
          style={input}
        >
          <option>Comida</option>
          <option>Ropa</option>
          <option>Hogar</option>
          <option>Servicios</option>
          <option>Otros</option>
        </select>

        <p style={{ fontSize: 12 }}>Subir imagen</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setNuevo({ ...nuevo, imagen: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        <button onClick={guardarProducto} style={btnPublicar}>
          Publicar
        </button>

      </div>
    </div>
  );
}

// 🎨 estilos
const bg = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  display: "flex",
  justifyContent: "center",
  padding: 20
};

const card = {
  width: "100%",
  maxWidth: 500,
  background: "white",
  borderRadius: 20,
  padding: 20
};

const header = {
  display: "flex",
  justifyContent: "space-between"
};

const inputBusqueda = {
  width: "100%",
  padding: 10,
  marginTop: 10,
  borderRadius: 10,
  border: "none",
  background: "#eee"
};

const categoriasContainer = {
  display: "flex",
  gap: 5,
  overflowX: "auto",
  marginTop: 10
};

const btnCategoria = {
  padding: "6px 10px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer"
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 10,
  border: "1px solid #ccc"
};

const btnCuenta = { background: "#000", color: "white", border: "none", padding: 8, borderRadius: 10 };
const btnVolver = btnCuenta;

const btnComprar = { background: "#25D366", color: "white", border: "none", padding: 10, borderRadius: 10 };
const btnCompartir = { background: "#333", color: "white", border: "none", padding: 10, borderRadius: 10 };
const btnPublicar = { width: "100%", background: "#2a5298", color: "white", padding: 10, border: "none", borderRadius: 10 };

const producto = { marginTop: 15 };
const imagen = { width: "100%", borderRadius: 10 };

const modal = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
