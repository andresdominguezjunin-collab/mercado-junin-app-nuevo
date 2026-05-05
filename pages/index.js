// 🔥 VERSION NUEVA - PRUEBA
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "mercado-junin.firebaseapp.com",
  projectId: "mercado-junin",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [imagenGrande, setImagenGrande] = useState(null);

  const linkApp = "https://TU-LINK-REAL.vercel.app";

  useEffect(() => {
    const cargar = async () => {
      const snap = await getDocs(collection(db, "productos"));
      const lista = [];
      snap.forEach(doc => lista.push({ ...doc.data(), id: doc.id }));
      setProductos(lista);
    };
    cargar();
  }, []);

  const compartir = (p) => {
    const mensaje = `Producto 👇
${p.nombre}
$${p.precio}
${linkApp}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`);
  };

  return (
    <div style={{ padding: 20 }}>

      {/* 🔴 MARCA CLAVE */}
      <h2 style={{ color: "red" }}>VERSIÓN NUEVA</h2>

      {productos.map(p => (
        <div key={p.id} style={{ marginBottom: 20 }}>

          {p.imagen && (
            <img
              src={p.imagen}
              style={{ width: "100%" }}
              onClick={() => setImagenGrande(p.imagen)}
            />
          )}

          <h3>{p.nombre}</h3>
          <p>${p.precio}</p>

          <button onClick={() => compartir(p)}>
            Compartir
          </button>

        </div>
      ))}

      {imagenGrande && (
        <div
          onClick={() => setImagenGrande(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "black"
          }}
        >
          <img src={imagenGrande} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
