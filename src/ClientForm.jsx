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
    correspondence: {
      judet: "",
      localitate: "",
      strada: "",
      numarStrada: "",
      bloc: "",
      apartament: "",
    },
    consumption: {
      judet: "",
      localitate: "",
      strada: "",
      numarStrada: "",
      bloc: "",
      apartament: "",
    },
  });

  const [error, setError] = useState({});

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    if (section === 'correspondence' || section === 'consumption') {
      setClient({
        ...client,
        [section]: {
          ...client[section],
          [field]: value
        }
      });
    } else {
      setClient({ ...client, [name]: value });
    }
    setError({ ...error, [name]: "" }); // Resetăm erorile
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!validateEmail(client.email)) newErrors.email = "Email invalid!";
    if (!validatePhone(client.telefon)) newErrors.telefon = "Telefon invalid! (10 cifre)";
    
    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

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
        correspondence: {
          judet: "",
          localitate: "",
          strada: "",
          numarStrada: "",
          bloc: "",
          apartament: "",
        },
        consumption: {
          judet: "",
          localitate: "",
          strada: "",
          numarStrada: "",
          bloc: "",
          apartament: "",
        },
      });

      if (onClientAdded) onClientAdded();
    } catch (error) {
      console.error("Eroare la adăugarea clientului:", error.response?.data || error.message);
      alert("Eroare la adăugarea clientului. Verifică consola pentru detalii.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Nume:</label>
          <input type="text" name="nume" value={client.nume} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Email:</label>
          <input type="email" name="email" value={client.email} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
          {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Telefon:</label>
          <input type="text" name="telefon" value={client.telefon} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
          {error.telefon && <p className="text-red-500 text-sm">{error.telefon}</p>}
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Județ:</label>
          <select name="judet" value={client.judet} onChange={handleChange} required 
            className="w-full p-2 border rounded">
            <option value="">Selectează județul</option>
            <option value="Galați">Galați</option>
            <option value="Brăila">Brăila</option>
            <option value="Tulcea">Tulcea</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Localitate:</label>
          <input type="text" name="localitate" value={client.localitate} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Stradă:</label>
          <input type="text" name="strada" value={client.strada} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Număr Stradă:</label>
          <input type="text" name="numarStrada" value={client.numarStrada} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Bloc:</label>
          <input type="text" name="bloc" value={client.bloc} onChange={handleChange} 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">Apartament:</label>
        <input type="text" name="apartament" value={client.apartament} onChange={handleChange} 
          className="w-full p-2 border rounded" />
      </div>

      <h3>Adresa de Corespondență</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Județ:</label>
          <select name="correspondence.judet" value={client.correspondence.judet} onChange={handleChange} required 
            className="w-full p-2 border rounded">
            <option value="">Selectează județul</option>
            <option value="Galați">Galați</option>
            <option value="Brăila">Brăila</option>
            <option value="Tulcea">Tulcea</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Localitate:</label>
          <input type="text" name="correspondence.localitate" value={client.correspondence.localitate} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Stradă:</label>
          <input type="text" name="correspondence.strada" value={client.correspondence.strada} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Număr Stradă:</label>
          <input type="text" name="correspondence.numarStrada" value={client.correspondence.numarStrada} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Bloc:</label>
          <input type="text" name="correspondence.bloc" value={client.correspondence.bloc} onChange={handleChange} 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Apartament:</label>
          <input type="text" name="correspondence.apartament" value={client.correspondence.apartament} onChange={handleChange} 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <h3>Adresa Punct de Consum</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Județ:</label>
          <select name="consumption.judet" value={client.consumption.judet} onChange={handleChange} required 
            className="w-full p-2 border rounded">
            <option value="">Selectează județul</option>
            <option value="Galați">Galați</option>
            <option value="Brăila">Brăila</option>
            <option value="Tulcea">Tulcea</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Localitate:</label>
          <input type="text" name="consumption.localitate" value={client.consumption.localitate} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Stradă:</label>
          <input type="text" name="consumption.strada" value={client.consumption.strada} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Număr Stradă:</label>
          <input type="text" name="consumption.numarStrada" value={client.consumption.numarStrada} onChange={handleChange} required 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-semibold">Bloc:</label>
          <input type="text" name="consumption.bloc" value={client.consumption.bloc} onChange={handleChange} 
            className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Apartament:</label>
          <input type="text" name="consumption.apartament" value={client.consumption.apartament} onChange={handleChange} 
            className="w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-semibold">Status:</label>
        <select name="status" value={client.status} onChange={handleChange} 
          className="w-full p-2 border rounded">
          <option value="Ofertat">Ofertat</option>
          <option value="În lucru">În lucru</option>
          <option value="Executat">Executat</option>
          <option value="Finalizat">Finalizat</option>
        </select>
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">
        Adaugă Client
      </button>
    </form>
  );
};

export default ClientForm;