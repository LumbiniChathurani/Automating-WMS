// src/App.jsx
import { useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/upload-excel", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      // ✅ Only take the 'data' array from backend response
      setData(json.data || []);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        WMS Report Data Viewer
      </h1>

      {/* File Upload */}
      <label className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg shadow cursor-pointer hover:bg-purple-700">
        Upload Excel
        <input
          type="file"
          accept=".xlsx, .xls"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {loading && <p className="mt-4 text-gray-600">Processing file...</p>}

      {/* Data Table */}
      {data.length > 0 && (
        <div className="mt-6 w-full max-w-4xl overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white shadow rounded-lg">
            <thead className="bg-purple-200">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-semibold"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  {Object.values(row).map((val, j) => (
                    <td
                      key={j}
                      className="border border-gray-300 px-4 py-2 text-gray-600"
                    >
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
