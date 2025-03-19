import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ClientDetail.css"; // Stiluri pentru interfață

const ClientDetail = () => {
  const { contract } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [contract]);

  const fetchClient = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/client/${contract}`);
      setClient(response.data);
    } catch (error) {
      console.error("Eroare la preluarea detaliilor clientului:", error);
    }
  };

  if (!client) {
    return <div>Se încarcă...</div>;
  }

  return (
    <div className="client-detail-container">
      <h1>Detalii Client: {client.nume}</h1>
      <div className="client-detail">
        <p><strong>Contract:</strong> {client.contract}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Telefon:</strong> {client.telefon}</p>
        <p><strong>Județ:</strong> {client.judet}</p>
        <p><strong>Localitate:</strong> {client.localitate}</p>
        <p><strong>Stradă:</strong> {client.strada}</p>
        <p><strong>Număr Stradă:</strong> {client.numarStrada}</p>
        <p><strong>Bloc:</strong> {client.bloc}</p>
        <p><strong>Apartament:</strong> {client.apartament}</p>
        <h3>Adresa de Corespondență</h3>
        <p><strong>Județ:</strong> {client.correspondence_judet}</p>
        <p><strong>Localitate:</strong> {client.correspondence_localitate}</p>
        <p><strong>Stradă:</strong> {client.correspondence_strada}</p>
        <p><strong>Număr Stradă:</strong> {client.correspondence_numarStrada}</p>
        <p><strong>Bloc:</strong> {client.correspondence_bloc}</p>
        <p><strong>Apartament:</strong> {client.correspondence_apartament}</p>
        <h3>Adresa Punct de Consum</h3>
        <p><strong>Județ:</strong> {client.consumption_judet}</p>
        <p><strong>Localitate:</strong> {client.consumption_localitate}</p>
        <p><strong>Stradă:</strong> {client.consumption_strada}</p>
        <p><strong>Număr Stradă:</strong> {client.consumption_numarStrada}</p>
        <p><strong>Bloc:</strong> {client.consumption_bloc}</p>
        <p><strong>Apartament:</strong> {client.consumption_apartament}</p>
        <p><strong>Status:</strong> {client.status}</p>
      </div>
    </div>
  );
};

export default ClientDetail;