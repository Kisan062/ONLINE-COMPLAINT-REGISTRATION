import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ComplaintContext } from '../context/ComplaintContext';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import ComplaintCard from '../components/ComplaintCard';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { complaints, loading, fetchComplaints } = useContext(ComplaintContext);
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'MEDIUM' });

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/complaints', form);
      toast.success('Complaint submitted');
      setForm({ title: '', description: '', category: '', priority: 'MEDIUM' });
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Welcome, {user.name}</h2>
      {user.role !== 'USER' && (
        <div className="alert alert-info">Please use the dedicated Role Dashboard links for agents and admins.</div>
      )}
      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title">New Complaint</h4>
              <form onSubmit={submitComplaint}>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea name="description" rows="4" className="form-control" value={form.description} onChange={handleChange} required />
                </div>
                <button className="btn btn-primary w-100">Submit Complaint</button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <h4>My Complaints</h4>
          {loading ? (
            <p>Loading complaints...</p>
          ) : complaints.length ? (
            complaints.map((item) => <ComplaintCard key={item._id} complaint={item} />)
          ) : (
            <div className="alert alert-light">No complaints found yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
