import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ComplaintDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const loadComplaint = async () => {
    try {
      const { data } = await api.get(`/api/complaints/${id}`);
      setComplaint(data);
      setStatus(data.status);
    } catch (error) {
      toast.error('Unable to load complaint');
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const submitMessage = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/complaints/${id}/messages`, { content: message });
      toast.success('Message sent');
      setMessage('');
      loadComplaint();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const updateStatus = async () => {
    try {
      await api.put(`/api/complaints/${id}`, { status });
      toast.success('Status updated');
      loadComplaint();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (!complaint) {
    return <div>Loading complaint...</div>;
  }

  return (
    <div>
      <h2>{complaint.title}</h2>
      <p className="text-muted">Category: {complaint.category}</p>
      <p>{complaint.description}</p>
      <div className="mb-3">
        <span className="badge bg-secondary me-2">Status: {complaint.status}</span>
        <span className="badge bg-info">Priority: {complaint.priority}</span>
      </div>
      <div className="mb-4">
        <p>Submitted by: {complaint.user?.name} ({complaint.user?.email})</p>
        <p>Assigned agent: {complaint.agent?.name || 'Unassigned'}</p>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5>Conversation</h5>
          {complaint.messages.length ? (
            complaint.messages.map((msg) => (
              <div key={msg._id} className="mb-3">
                <strong>{msg.sender?.name || 'Unknown'}</strong>
                <p className="mb-1">{msg.content}</p>
                <small className="text-muted">{new Date(msg.createdAt).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p className="text-muted">No messages yet.</p>
          )}
          <form className="mt-3" onSubmit={submitMessage}>
            <textarea className="form-control mb-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Send a message" required />
            <button className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
      {(user?.role === 'ADMIN' || user?.role === 'AGENT' || user?._id === complaint.user?._id) && (
        <div className="card">
          <div className="card-body">
            <h5>Update Status</h5>
            <select className="form-select mb-3" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
            <button className="btn btn-success" onClick={updateStatus}>Save Status</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
