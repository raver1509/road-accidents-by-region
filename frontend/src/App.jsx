import './styles/styles.css'; // Import stylów CSS
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import MapContainer from '../components/MapContainer/MapContainer';
import ChartComponent from '../components/ChartComponent/ChartComponent';
import axios from 'axios';
import xmljs from 'xml-js';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/govData2023');
        const csv = response.data;
        const results = Papa.parse(csv, { header: true });
        const structuredData = results.data.slice(3, -3).map(item => ({
          province: item["Statystyka ogólna w podziale na województwa"],
          accidents: item[""],
          deaths: item["_1"],
          injuries: item["_2"],
          collisions: item["_3"]
        }));
        setData(structuredData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
  };

  const renderProvinceData = () => {
    if (!selectedProvince) return null;

    const provinceData = data.find(
      (item) => item.province === selectedProvince
    );

    if (!provinceData) return <div>No data available for {selectedProvince}</div>;

    return (
      <ChartComponent data={provinceData} />
    );
  };

  const exportToJson = () => {
    const filename = 'data.json';
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const exportToXml = () => {
    const jsonData = {
      data: {
        provinces: data.map(item => ({
          province: item.province,
          accidents: item.accidents,
          deaths: item.deaths,
          injuries: item.injuries,
          collisions: item.collisions
        }))
      }
    };
  
    const xmlStr = xmljs.js2xml(jsonData, { compact: true, ignoreComment: true });
  
    const filename = 'data.xml';
    const blob = new Blob([xmlStr], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className="app-container">
      <div className="left-panel">
        <h1>Dane z ruchu drogowego w 2023 roku</h1>
        <table className="data-table">
          <thead>
            <tr>
              <th>Province</th>
              <th>Accidents</th>
              <th>Deaths</th>
              <th>Injuries</th>
              <th>Collisions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.province}</td>
                <td>{row.accidents}</td>
                <td>{row.deaths}</td>
                <td>{row.injuries}</td>
                <td>{row.collisions}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="export-buttons">
          <button onClick={exportToJson}>Export to JSON</button>
          <button onClick={exportToXml}>Export to XML</button>
        </div>
      </div>
      <div className="right-panel">
        <MapContainer onProvinceClick={handleProvinceClick} />
        {renderProvinceData()}
      </div>
    </div>
  );
}

export default App;
