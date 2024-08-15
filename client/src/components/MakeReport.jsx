import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle, FaTachometerAlt, FaUsers, FaFileAlt } from 'react-icons/fa';

export default function MakeReport() {
  const [clients, setClients] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [formData, setFormData] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Fetch Clients
    axios.get('http://localhost:4000/registered-users')
      .then((res) => {
        const clients = res.data.filter(user => !user.isAdmin);
        setClients(clients);
      })
      .catch((err) => console.log(err));
    
    // Fetch Tests
    axios.get('http://localhost:4000/api/test-list')
      .then((res) => {
        setTests(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:4000/logout')
      .then((res) => {
        navigate('/login');
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = () => {
    const data = {
      clientName: clients.find(client => client._id === selectedClient)?.name || '',
      ...formData
    };
    axios.post(`http://localhost:4000/api/reports/${selectedTest}`, data)
      .then((res) => {
        alert('Report created successfully');
        setSelectedClient('');
        setSelectedTest('');
        setFormData({});
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition duration-200 ease-in-out lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between px-4">
          <h1 className="text-2xl font-bold">MyLabVerse</h1>
          <FaBars className="lg:hidden cursor-pointer text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>
        <nav>
          <ul>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <FaTachometerAlt className="mr-3" /> Dashboard
            </li>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/registered-users")}>
              <FaUsers className="mr-3" /> Registered Users
            </li>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/make-report")}>
              <FaFileAlt className="mr-3" /> Make Report
            </li>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/test-list")}>
              <FaFileAlt className="mr-3" /> Test List
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
          <FaBars className="lg:hidden cursor-pointer text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h2 className="text-lg font-semibold">Make Report</h2>
          <div className="relative">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FaUserCircle className="text-2xl" />
              <span>{userName}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2">
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>Profile</div>
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </header>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Create Report</h3>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Client</label>
            <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} className="border rounded p-2 w-full">
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Test</label>
            <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)} className="border rounded p-2 w-full">
              <option value="">Select Test</option>
              {tests.map(test => (
                <option key={test._id} value={test._id}>{test.name}</option>
              ))}
            </select>
          </div>

          {selectedTest && (
            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">{tests.find(test => test._id === selectedTest)?.name} Report</h4>
              {tests.find(test => test._id === selectedTest)?.name === 'Hemogram' && (
                <div>
                  <label className="block text-gray-700 mb-2">Hemoglobin</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })} />
                  <label className="block text-gray-700 mb-2">RBC Count</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, rbcCount: e.target.value })} />
                  <label className="block text-gray-700 mb-2">WBC Count</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, wbcCount: e.target.value })} />
                  <label className="block text-gray-700 mb-2">Platelet Count</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, plateletCount: e.target.value })} />
                  <label className="block text-gray-700 mb-2">Polymorphs</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, polymorphs: e.target.value })} />
                  <label className="block text-gray-700 mb-2">Lymphocytes</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, lymphocytes: e.target.value })} />
                  <label className="block text-gray-700 mb-2">Eosinophils</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, eosinophils: e.target.value })} />
                  <label className="block text-gray-700 mb-2">Monocytes</label>
                  <input type="number" step="0.1" className="border rounded p-2 w-full mb-2" onChange={(e) => setFormData({ ...formData, monocytes: e.target.value })} />
                </div>
              )}
            </div>
          )}

          <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}
