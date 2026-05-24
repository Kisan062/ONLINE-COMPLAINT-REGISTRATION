import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import ComplaintCard from '../components/ComplaintCard';

const AgentDashboard = () => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAssigned = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/agents/assigned');
      setAssigned(data);
    } catch (error) {
      toast.error('Unable to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssigned();
  }, []);

  const updateProgress = async (complaintId, status) => {
    try {
      await api.put(`/api/agents/complaints/${complaintId}/progress`, { status });
      toast.success('Complaint updated');
      loadAssigned();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <h2>Agent Dashboard</h2>
      <p className="text-muted">Review your assigned complaints and update progress.</p>
      {loading ? (
        <p>Loading...</p>
      ) : assigned.length ? (
        assigned.map((complaint) => (
          <div className="card mb-3 shadow-sm" key={complaint._id}>
            <div className="card-body">
              <h5>{complaint.title}</h5>
              <p>{complaint.category} • Status: {complaint.status}</p>
              <button className="btn btn-outline-primary me-2" onClick={() => updateProgress(complaint._id, 'IN_PROGRESS')}>In Progress</button>
              <button className="btn btn-outline-success" onClick={() => updateProgress(complaint._id, 'RESOLVED')}>Resolve</button>
            </div>
          </div>
        ))
      ) : (
        <div className="alert alert-light">No assigned complaints yet.</div>
      )}
    </div>
  );
};

export default AgentDashboard;
