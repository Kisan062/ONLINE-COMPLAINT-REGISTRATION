import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [assignment, setAssignment] = useState({ complaintId: '', agentId: '' });

  const loadData = async () => {
    try {
      const [statsData, agentsData, usersData, complaintsData] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/agents'),
        api.get('/api/admin/users'),
        api.get('/api/admin/complaints'),
      ]);
      setStats(statsData.data);
      setAgents(agentsData.data);
      setUsers(usersData.data);
      setComplaints(complaintsData.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/admin/assign', assignment);
      toast.success('Complaint assigned successfully');
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Assignment failed');
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="row gy-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h5>System Metrics</h5>
            {stats ? (
              <ul className="list-unstyled mb-0">
                <li>Total complaints: {stats.totalComplaints}</li>
                <li>Open: {stats.open}</li>
                <li>In progress: {stats.inProgress}</li>
                <li>Resolved: {stats.resolved}</li>
                <li>Closed: {stats.closed}</li>
                <li>Users: {stats.users}</li>
                <li>Agents: {stats.agents}</li>
              </ul>
            ) : (
              <p>Loading metrics...</p>
            )}
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm p-3 mb-4">
            <h5>Assign Complaint</h5>
            <form className="row g-3" onSubmit={handleAssign}>
              <div className="col-md-6">
                <select className="form-select" value={assignment.complaintId} onChange={(e) => setAssignment({ ...assignment, complaintId: e.target.value })} required>
                  <option value="">Select complaint</option>
                  {complaints.map((item) => (
                    <option key={item._id} value={item._id}>{item.title}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select className="form-select" value={assignment.agentId} onChange={(e) => setAssignment({ ...assignment, agentId: e.target.value })} required>
                  <option value="">Select agent</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent.user._id}>{agent.user.name} ({agent.user.email})</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <button className="btn btn-primary">Assign</button>
              </div>
            </form>
          </div>
          <div className="card shadow-sm p-3">
            <h5>Recent Complaints</h5>
            {complaints.length ? (
              <ul className="list-group list-group-flush">
                {complaints.slice(0, 5).map((complaint) => (
                  <li className="list-group-item" key={complaint._id}>
                    <strong>{complaint.title}</strong> — {complaint.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No complaints available</p>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>Agents</h5>
            {agents.length ? (
              <ul className="list-group list-group-flush">
                {agents.map((agent) => (
                  <li className="list-group-item" key={agent._id}>{agent.user.name} ({agent.user.email})</li>
                ))}
              </ul>
            ) : (
              <p>No agents registered</p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>Users</h5>
            {users.length ? (
              <ul className="list-group list-group-flush">
                {users.map((u) => (
                  <li className="list-group-item" key={u._id}>{u.name} ({u.email})</li>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
