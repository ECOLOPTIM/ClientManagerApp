import React, { useState } from "react";

const ClientForm = ({ onAddClient }) => {
  const [client, setClient] = useState({
    nume: "",
    email: "",
    telefon: "",
    judet: "",
    localitate: "",
    strada: "",
    status: "Ofertat",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generăm un contractNumber automat
    const contractNumber = Date.now(); // Folosim timestamp pentru unicitate
    const clientData = { ...client, contract: contractNumber, dataAdaugare: new Date().toISOString().split("T")[0] };

    console.log("Trimitem datele către server:", clientData); // Debugging

    fetch("https://d3fcbb76-70d6-4782-9e3b-09252b950d7f-00-3oiddegulta5f.picard.replit.dev/api/add-client", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Eroare la adăugare: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Client adăugat cu succes:", data);
        onAddClient(clientData);
        setClient({
          nume: "",
          email: "",
          telefon: "",
          judet: "",
          localitate: "",
          strada: "",
          status: "Ofertat",
        });
      })
      .catch((error) => {
        console.error("Eroare la adăugare:", error);
        setError("A apărut o eroare la adăugarea clientului.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow-md">
      {error && <p className="text-red-500">{error}</p>}

      <input type="text" name="nume" value={client.nume} onChange={handleChange} placeholder="Nume" required />
      <input type="email" name="email" value={client.email} onChange={handleChange} placeholder="Email" required />
      <input type="text" name="telefon" value={client.telefon} onChange={handleChange} placeholder="Telefon" required />
      <input type="text" name="judet" value={client.judet} onChange={handleChange} placeholder="Județ" required />
      <input type="text" name="localitate" value={client.localitate} onChange={handleChange} placeholder="Localitate" required />
      <input type="text" name="strada" value={client.strada} onChange={handleChange} placeholder="Stradă" required />

      <select name="status" value={client.status} onChange={handleChange}>
        <option value="Ofertat">Ofertat</option>
        <option value="În lucru">În lucru</option>
        <option value="Executat">Executat</option>
        <option value="Finalizat">Finalizat</option>
      </select>

      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
        Adaugă Client
      </button>
    </form>
  );
};

export default ClientForm;
