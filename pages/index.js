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

  const [usuario, setUsuario] = useState({
    nombre: "",
    whatsapp: ""
  });

  const [nuevo, setNuevo] = useState({
    nombre: "",
    precio: "",
    imagen: ""
  });

  const linkApp = "https://TU-LINK-REAL.vercel.app";

  const cargarProductos = async () => {
    const snap = await getDocs(collection(db, "productos"));
    const lista = [];
    snap.forEach(doc => lista.push({ ...doc.data(), id: doc.id }));
    setProductos(lista);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const guardarProducto = async () => {
    if (!nuevo.nombre || !nuevo.precio || !usuario.whatsapp) return;

    await addDoc(collection(db, "productos"), {
      ...nuevo,
      vendedor: usuario.nombre,
      whatsapp: usuario.whatsapp
    });

    setNuevo({ nombre: "", precio: "", imagen: "" });
    setVista("home");
    cargarProductos();
  };

  const compartir = (p) => {
    const mensaje = `Mirá este producto 👇
${p.nombre}
💲 ${p.precio}
📲 https://wa.me/${p.whatsapp}
🔗 ${linkApp}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`);
  };

  // 🏠 HOME
  if (vista === "home") {
    return (
      <div style={bg}>
        <div style={card}>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Mercado Junín</h2>
            <button onClick={() => setVista("cuenta")} style={btn}>
              Mi cuenta
            </button>
          </div>

          {productos.map(p => (
            <div key={p.id} style={producto}>

              {p.imagen && (
                <img
                  src={p.imagen}
                  style={{ width: "100%", borderRadius: 10 }}
                  onClick={() => setImagenGrande(p.imagen)}
                />
              )}

              <h3>{p.nombre}</h3>
              <p>${p.precio}</p>

              <div style={{ display: "flex", gap: 10 }}>
                <a href={`https://wa.me/${p.whatsapp}`} target="_blank" style={{ flex: 1 }}>
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

        <button onClick={() => setVista("home")} style={btn}>
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

        <input
          type="file"
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

const bg = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #4facfe, #00f2fe)",
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

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 10,
  border: "1px solid #ccc"
};

const btn = {
  background: "#4facfe",
  color: "white",
  border: "none",
  padding: 10,
  borderRadius: 10
};

const btnComprar = {
  background: "#25D366",
  color: "white",
  border: "none",
  padding: 10,
  borderRadius: 10,
  width: "100%"
};

const btnCompartir = {
  background: "#555",
  color: "white",
  border: "none",
  padding: 10,
  borderRadius: 10,
  width: "100%"
};

const btnPublicar = {
  width: "100%",
  background: "#4facfe",
  color: "white",
  border: "none",
  padding: 12,
  borderRadius: 10,
  marginTop: 10
};

const producto = {
  marginTop: 20,
  padding: 10,
  borderRadius: 10,
  boxShadow: "0 5px 10px rgba(0,0,0,0.1)"
};

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
