import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ClientForm from "./ClientForm";
import "./ClientList.css"; // Stiluri pentru interfață

const statusColors = {
  "Ofertat": "yellow",
  "În lucru": "purple",
  "Executat": "pink",
  "Finalizat": "green"
};

const ClientList = () => {
  const [clienti, setClienti] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editClient, setEditClient] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/clienti");
      setClienti(response.data); // Aici trebuie să folosești `setClienti`
    } catch (error) {
      console.error("Eroare la preluarea clienților:", error);
    }
  };

  const handleDelete = async (contract) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete-client/${contract}`);
      fetchClients();
    } catch (error) {
      console.error("Eroare la ștergerea clientului:", error);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client.contract);
    setEditedData(client);
    setShowEditForm(true);
  };

  const handleSave = async (contract) => {
    try {
      await axios.put(`http://localhost:5000/api/edit-client/${contract}`, editedData);
      setEditClient(null);
      setShowEditForm(false);
      fetchClients();
    } catch (error) {
      console.error("Eroare la actualizarea clientului:", error);
    }
  };

  return (
    <div className="client-container">
      <h1 className="title">Lista Clienților</h1>
      <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-toggle-form">
        {showAddForm ? "Ascunde formularul" : "Adaugă Client"}
      </button>
      {showAddForm && <ClientForm onClientAdded={fetchClients} />}
      
      <input 
        type="text" 
        placeholder="Caută clienți..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="search-input"
      />

      <table className="client-table">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Nume</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Județ</th>
            <th>Localitate</th>
            <th>Strada</th>
            <th>Status</th>
            <th>Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {clienti
            .filter(client => client.nume.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(client => (
            <tr key={client.contract}>
              <td>{client.contract}</td>
              <td>{client.nume}</td>
              <td>{client.email}</td>
              <td>{client.telefon}</td>
              <td>{client.judet}</td>
              <td>{client.localitate}</td>
              <td>{client.strada}</td>
              <td>
                <span 
                  className="status-dot" 
                  style={{ backgroundColor: statusColors[client.status] || "gray" }}
                ></span>
                {client.status}
              </td>
              <td className="actions">
                <Link to={`/client/${client.contract}`} className="btn btn-details">Vezi detalii</Link>
                <button onClick={() => handleEdit(client)} className="btn btn-edit">Editează</button>
                <button onClick={() => handleDelete(client.contract)} className="btn btn-delete">Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditForm && (
        <div className="edit-form">
          <h2>Editează Client</h2>
          <input type="text" value={editedData.nume} onChange={(e) => setEditedData({ ...editedData, nume: e.target.value })} />
          <input type="email" value={editedData.email} onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} />
          <input type="text" value={editedData.telefon} onChange={(e) => setEditedData({ ...editedData, telefon: e.target.value })} />
          <input type="text" value={editedData.judet} onChange={(e) => setEditedData({ ...editedData, judet: e.target.value })} />
          <input type="text" value={editedData.localitate} onChange={(e) => setEditedData({ ...editedData, localitate: e.target.value })} />
          <input type="text" value={editedData.strada} onChange={(e) => setEditedData({ ...editedData, strada: e.target.value })} />
          <button onClick={() => handleSave(editClient)} className="btn btn-save">Salvează</button>
          <button onClick={() => setShowEditForm(false)} className="btn btn-cancel">Anulează</button>
        </div>
      )}
    </div>
  );
};

export default ClientList;
