import React, { useState, useEffect } from 'react';

function App() {
  // State untuk menyimpan daftar item dari API
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    fetch('http://localhost:5000/api/items') // Sesuaikan port Flask
      .then(response => response.json()) // Konversi response ke JSON
      .then(data => {
        setItems(data); // Simpan data ke state
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Daftar Items</h1>
      
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item => (
            <li key={item.id} style={{ margin: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
              <strong>{item.name}</strong>: {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
