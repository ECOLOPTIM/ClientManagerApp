import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ClientDetail = () => {
  const { contract } = useParams();
  const [client, setClient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    fetchClientDetails();
    fetchClientDocuments();
  }, []);

  const fetchClientDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/clienti/${contract}`);
      setClient(response.data);
    } catch (error) {
      console.error("Eroare la preluarea detaliilor clientului:", error);
    }
  };

  const fetchClientDocuments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/documents/${contract}`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Eroare la preluarea documentelor clientului:", error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Selectează un fișier înainte de încărcare.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("contract", contract);

    try {
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadMessage("Fișier încărcat cu succes!");
      fetchClientDocuments();
    } catch (error) {
      setUploadMessage("Eroare la încărcarea fișierului.");
      console.error("Eroare la încărcarea documentului:", error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/documents/${documentId}`);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error("Eroare la ștergerea documentului:", error);
    }
  };

  if (!client) {
    return <p>Se încarcă detaliile clientului...</p>;
  }

  return (
    <div>
      <h2>Detalii Client</h2>
      <p><strong>Nume:</strong> {client.nume}</p>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Telefon:</strong> {client.telefon}</p>
      <p><strong>Județ:</strong> {client.judet}</p>
      <p><strong>Localitate:</strong> {client.localitate}</p>

      <h3>Documente</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Încarcă</button>
      <p>{uploadMessage}</p>

      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {doc.filename}
            <button onClick={() => handleDeleteDocument(doc.id)}>Șterge</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientDetail;
