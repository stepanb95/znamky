import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Importujeme CSS

const App = () => {
  const [tridy, setTridy] = useState([]);
  const [zaci, setZaci] = useState([]);
  const [znamky, setZnamky] = useState([]);
  const [selectedTrida, setSelectedTrida] = useState(null);
  const [selectedZak, setSelectedZak] = useState(null);
  const [newZak, setNewZak] = useState('');
  const [newZnamka, setNewZnamka] = useState({ znamka: '', vaha: '', popis: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/api/tridy').then((response) => {
      setTridy(response.data);
    });
  }, []);

  const loadZaci = (tridaId) => {
    setSelectedTrida(tridaId);
    axios.get(`http://localhost:3001/api/tridy/${tridaId}/zaci`).then((response) => {
      setZaci(response.data);
      setSelectedZak(null);
      setZnamky([]);
    });
  };

  const loadZnamky = (zakId) => {
    setSelectedZak(zakId);
    axios.get(`http://localhost:3001/api/zaci/${zakId}/znamky`).then((response) => {
      setZnamky(response.data);
    });
  };

  const addZak = () => {
    if (newZak.trim() && selectedTrida) {
      axios.post(`http://localhost:3001/api/tridy/${selectedTrida}/zaci`, { jmeno: newZak }).then(() => {
        loadZaci(selectedTrida);
        setNewZak('');
      });
    }
  };

  const addZnamka = () => {
    if (selectedZak && newZnamka.znamka && newZnamka.vaha) {
      axios.post(`http://localhost:3001/api/zaci/${selectedZak}/znamky`, newZnamka).then(() => {
        loadZnamky(selectedZak);
        setNewZnamka({ znamka: '', vaha: '', popis: '' });
      });
    }
  };

  const deleteZnamka = (znamkaId) => {
    axios.delete(`http://localhost:3001/api/znamky/${znamkaId}`).then(() => {
      loadZnamky(selectedZak);
    });
  };

  return (
    <div className="container">
      <h1>Školní systém</h1>

      <div className="class-buttons">
        {tridy.map((trida) => (
          <button key={trida.id} onClick={() => loadZaci(trida.id)}>
            {trida.nazev}
          </button>
        ))}
      </div>
      <button className="add-button" onClick={addZak}>Přidat žáka</button>
      {selectedTrida && (
        <div className="student-list">
          <h2>Žáci ve třídě</h2>
          {zaci.map((zak) => (
            <div key={zak.id} onClick={() => loadZnamky(zak.id)}>
              {zak.jmeno}
            </div>
          ))}
          <input
            type="text"
            placeholder="Jméno nového žáka"
            value={newZak}
            onChange={(e) => setNewZak(e.target.value)}
          />
          
        </div>
      )}

      {selectedZak && (
        <div className="grades-section">
          <h2>Známky žáka</h2>
          {znamky.map((znamka) => (
            <div className="grade-item" key={znamka.id}>
              <p>
                Známka: {znamka.znamka}, Váha: {znamka.vaha}, Popis: {znamka.popis}
              </p>
              <button onClick={() => deleteZnamka(znamka.id)}>Smazat</button>
            </div>
          ))}
          <input
            type="number"
            placeholder="Známka (1-5)"
            value={newZnamka.znamka}
            onChange={(e) => setNewZnamka({ ...newZnamka, znamka: e.target.value })}
          />
          <input
            type="number"
            placeholder="Váha (1-10)"
            value={newZnamka.vaha}
            onChange={(e) => setNewZnamka({ ...newZnamka, vaha: e.target.value })}
          />
          <input
            type="text"
            placeholder="Popis"
            value={newZnamka.popis}
            onChange={(e) => setNewZnamka({ ...newZnamka, popis: e.target.value })}
          />
          <button className="add-button" onClick={addZnamka}>Přidat známku</button>
        </div>
      )}
    </div>
  );
};

export default App;
