import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import MapContainer from '../components/MapContainer/MapContainer';
import ChartComponent from '../components/ChartComponent/ChartComponent';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/govData2023');
        const csv = await response.text();
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
      <div>
        <h2>Data for {selectedProvince}</h2>
        <ChartComponent data={provinceData} />
      </div>
    );
  };

  return (
    <div>
      <h1>Dane z ruchu drogowego w 2023 roku</h1>
      <table>
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
      <MapContainer onProvinceClick={handleProvinceClick} />
      {renderProvinceData()}
    </div>
  );
}

export default App;
