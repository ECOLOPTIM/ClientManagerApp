import React, { useState } from "react";
import axios from "axios";

const ClientForm = ({ onClientAdded }) => {
  const [client, setClient] = useState({
    nume: "",
    email: "",
    telefon: "",
    judet: "",
    localitate: "",
    strada: "",
    numarStrada: "",
    bloc: "",
    apartament: "",
    status: "Ofertat",
  });

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };
  
  const handleAddClient = () => {
    axios.post("http://localhost:5000/api/clienti", {
        nume,
        email,
        telefon,
        judet,
        localitate,
        strada,
        numarStrada,
        bloc,
        apartament,
        status
    })
    .then(response => {
        console.log("Client adăugat cu succes:", response.data);
        fetchClients(); // Reîncarcă lista după adăugare
    })
    .catch(error => {
        console.error("Eroare la adăugare client:", error);
    });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/clienti", client, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Client adăugat cu succes!");
      console.log("Răspuns server:", response.data);

      setClient({
        nume: "",
        email: "",
        telefon: "",
        judet: "",
        localitate: "",
        strada: "",
        numarStrada: "",
        bloc: "",
        apartament: "",
        status: "Ofertat",
      });

      if (onClientAdded) onClientAdded();
    } catch (error) {
      console.error("Eroare la adăugarea clientului:", error.response?.data || error.message);
      alert("Eroare la adăugarea clientului. Verifică consola pentru detalii.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nume" placeholder="Nume" value={client.nume} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={client.email} onChange={handleChange} required />
      <input type="text" name="telefon" placeholder="Telefon" value={client.telefon} onChange={handleChange} required />
      <input type="text" name="judet" placeholder="Județ" value={client.judet} onChange={handleChange} required />
      <input type="text" name="localitate" placeholder="Localitate" value={client.localitate} onChange={handleChange} required />
      <input type="text" name="strada" placeholder="Strada" value={client.strada} onChange={handleChange} required />
      <input type="text" name="numarStrada" placeholder="Număr Stradă" value={client.numarStrada} onChange={handleChange} required />
      <input type="text" name="bloc" placeholder="Bloc" value={client.bloc} onChange={handleChange} />
      <input type="text" name="apartament" placeholder="Apartament" value={client.apartament} onChange={handleChange} />
      <select name="status" value={client.status} onChange={handleChange}>
        <option value="Ofertat">Ofertat</option>
        <option value="În lucru">În lucru</option>
        <option value="Executat">Executat</option>
        <option value="Finalizat">Finalizat</option>
      </select>
      <button type="submit">Adaugă Client</button>
    </form>
  );
};

export default ClientForm;
