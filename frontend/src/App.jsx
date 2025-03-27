import React, { useState, useEffect } from "react";

function App() {
  const API_URL = "http://localhost:5000/api/items"; // Sesuaikan dengan API Flask

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null); // Untuk edit mode

  // Fetch data dari API
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // CREATE: Tambah item baru
  const addItem = () => {
    if (!name || !description) return alert("Nama dan deskripsi wajib diisi!");

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then((res) => res.json())
      .then((newItem) => {
        setItems([...items, newItem]); // Update state dengan item baru
        setName("");
        setDescription("");
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  // UPDATE: Edit item berdasarkan ID
  const updateItem = () => {
    if (!editingId || !name || !description) return alert("Isi semua data!");

    fetch(`${API_URL}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setItems(items.map((item) => (item.id === editingId ? updatedItem : item)));
        setEditingId(null);
        setName("");
        setDescription("");
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  // DELETE: Hapus item
  const deleteItem = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => {
        setItems(items.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Daftar Items Week 8</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nama Item"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {editingId ? (
          <button onClick={updateItem} style={{ marginLeft: "10px" }}>Update</button>
        ) : (
          <button onClick={addItem} style={{ marginLeft: "10px" }}>Tambah</button>
        )}
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                margin: "10px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <strong>{item.name}</strong>: {item.description}
              <br />
              <button onClick={() => { setEditingId(item.id); setName(item.name); setDescription(item.description); }} style={{ marginRight: "5px" }}>
                Edit
              </button>
              <button onClick={() => deleteItem(item.id)}>Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
