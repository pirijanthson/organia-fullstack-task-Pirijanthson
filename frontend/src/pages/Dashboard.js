import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks } from "../services/taskService";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const goToAddTask = () => {
    navigate("/AddTask");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="space-x-2">

          <button
            onClick={goToAddTask}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            + Add Task
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

      </div>

      <div className="bg-white p-6 rounded shadow-md">

        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>

        {loading ? (
          <p>Loading...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="space-y-3">

            {tasks.map((task) => (
              <div key={task.id} className="p-4 border rounded">
                <h3 className="text-xl font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;