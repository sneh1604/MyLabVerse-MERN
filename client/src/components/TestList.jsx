import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaPlus, FaTrash, FaUserCircle, FaTachometerAlt, FaUsers, FaFileAlt } from 'react-icons/fa';

export default function TestList() {
  const [tests, setTests] = useState([]);
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    cost: '',
    status: true,
    delete_flag: false
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
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

  const handleAddTest = () => {
    axios.post('http://localhost:4000/api/test-list', newTest)
      .then((res) => {
        setTests([...tests, res.data]);
        setNewTest({ name: '', description: '', cost: '', status: true, delete_flag: false });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTest = (id) => {
    axios.delete(`http://localhost:4000/api/test-list/${id}`)
      .then(() => {
        setTests(tests.filter(test => test._id !== id));
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
              <FaFileAlt className="mr-3" /> Report
            </li>
            <li className="py-2 px-4 flex items-center hover:bg-gray-700 cursor-pointer" onClick={() => navigate("/test-list")}>
              <FaFileAlt className="mr-3" /> TestList
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
          <FaBars className="lg:hidden cursor-pointer text-2xl" onClick={() => setSidebarOpen(!sidebarOpen)} />
          <h2 className="text-lg font-semibold">Test List</h2>
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

        {/* Add Test Form */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Add New Test</h3>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <input type="text" placeholder="Name" value={newTest.name} onChange={(e) => setNewTest({ ...newTest, name: e.target.value })} className="border rounded p-2" />
            <input type="text" placeholder="Description" value={newTest.description} onChange={(e) => setNewTest({ ...newTest, description: e.target.value })} className="border rounded p-2" />
            <input type="number" placeholder="Cost" value={newTest.cost} onChange={(e) => setNewTest({ ...newTest, cost: e.target.value })} className="border rounded p-2" />
            <button onClick={handleAddTest} className="bg-blue-500 text-white rounded py-2 px-4 flex items-center justify-center">Add Test <FaPlus className="ml-2" /></button>
          </div>
        </div>

        {/* Test List Table */}
        <div className="p-4 overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-2 px-4 border-b border-gray-200">Name</th>
                <th className="py-2 px-4 border-b border-gray-200">Description</th>
                <th className="py-2 px-4 border-b border-gray-200">Cost</th>
                <th className="py-2 px-4 border-b border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map(test => (
                <tr key={test._id} className="bg-white hover:bg-gray-100 transition duration-150 ease-in-out">
                  <td className="py-2 px-4 border-b border-gray-200">{test.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{test.description}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{test.cost}</td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button onClick={() => handleDeleteTest(test._id)} className="text-red-600"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
