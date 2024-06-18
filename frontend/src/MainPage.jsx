import './styles/styles.css'; // Import stylów CSS
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import MapContainer from '../components/MapContainer/MapContainer';
import ChartComponent from '../components/ChartComponent/ChartComponent';
import axios from 'axios';
import xmljs from 'xml-js';

function App() {
  const [data2023, setData2023] = useState([]);
  const [loading2023, setLoading2023] = useState(true);
  const [error2023, setError2023] = useState(null);

  const [data2018, setData2018] = useState([]);
  const [loading2018, setLoading2018] = useState(true);
  const [error2018, setError2018] = useState(null);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2023); // Domyślnie wybieramy dane z 2023 roku

  useEffect(() => {
    const fetchData2023 = async () => {
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
        setData2023(structuredData);
        setLoading2023(false);
      } catch (error) {
        setError2023(error);
        setLoading2023(false);
      }
    };

    const fetchData2018 = async () => {
      try {
        const response = await axios.get('http://localhost:3000/govData2018');
        const csv = response.data;
        const results = Papa.parse(csv, { 
          header: true,
        });
        const columns = results.meta.fields;
        const structuredData = results.data.slice(1, -1).map(item => ({
          province: item[columns[0]], // Pobieramy nazwę województwa z pierwszej kolumny
          accidents: parseInt(item[columns[1]]), // accidents z drugiej kolumny
          deaths: parseInt(item[columns[2]]), // deaths z trzeciej kolumny
          injuries: parseInt(item[columns[3]]), // injuries z czwartej kolumny
          collisions: parseInt(item[columns[4]]) // collisions z piątej kolumny
        }));
        setData2018(structuredData);
        setLoading2018(false);
      } catch (error) {
        setError2018(error);
        setLoading2018(false);
      }
    };

    if (selectedYear === 2023) {
      fetchData2023();
    } else if (selectedYear === 2018) {
      fetchData2018();
    }
  }, [selectedYear]);

  if ((selectedYear === 2023 && loading2023) || (selectedYear === 2018 && loading2018)) {
    return <div>Loading...</div>;
  }

  if ((selectedYear === 2023 && error2023) || (selectedYear === 2018 && error2018)) {
    return <div>Error: {selectedYear === 2023 ? error2023.message : error2018.message}</div>;
  }

  const handleProvinceClick = (province) => {
    setSelectedProvince(province);
  };

  const renderProvinceData = () => {
    if (!selectedProvince) return null;

    let provinceData;
    if (selectedYear === 2023) {
      provinceData = data2023.find(item => item.province === selectedProvince);
    } else if (selectedYear === 2018) {
      provinceData = data2018.find(item => item.province === selectedProvince);
    }

    if (!provinceData) return <div>No data available for {selectedProvince}</div>;

    return (
      <ChartComponent data={provinceData} />
    );
  };

  const exportToJson = () => {
    const filename = `${selectedYear}_data.json`;
    const jsonData = selectedYear === 2023 ? data2023 : data2018;
    const jsonStr = JSON.stringify(jsonData, null, 2);
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
        provinces: selectedYear === 2023 ? data2023.map(item => ({
          province: item.province,
          accidents: item.accidents,
          deaths: item.deaths,
          injuries: item.injuries,
          collisions: item.collisions
        })) : data2018.map(item => ({
          province: item.province,
          accidents: item.accidents,
          deaths: item.deaths,
          injuries: item.injuries,
          collisions: item.collisions
        }))
      }
    };
  
    const xmlStr = xmljs.js2xml(jsonData, { compact: true, ignoreComment: true });
  
    const filename = `${selectedYear}_data.xml`;
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
        <h1>Dane z ruchu drogowego</h1>
        <div className="year-selector">
          <label>
            Wybierz rok:
            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
              <option value={2023}>2023</option>
              <option value={2018}>2018</option>
            </select>
          </label>
        </div>
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
            {selectedYear === 2023 && data2023.map((row, index) => (
              <tr key={index}>
                <td>{row.province}</td>
                <td>{row.accidents}</td>
                <td>{row.deaths}</td>
                <td>{row.injuries}</td>
                <td>{row.collisions}</td>
              </tr>
            ))}
            {selectedYear === 2018 && data2018.map((row, index) => (
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
