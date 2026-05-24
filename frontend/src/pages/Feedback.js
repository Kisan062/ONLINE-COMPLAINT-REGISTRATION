import { useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [form, setForm] = useState({ complaintId: '', rating: 5, comment: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/feedback/submit', form);
      toast.success('Feedback saved');
      setForm({ complaintId: '', rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit feedback');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2>Submit Feedback</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Complaint ID</label>
                <input name="complaintId" className="form-control" value={form.complaintId} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select className="form-select" name="rating" value={form.rating} onChange={handleChange}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea name="comment" className="form-control" rows="4" value={form.comment} onChange={handleChange} />
              </div>
              <button className="btn btn-primary">Submit Feedback</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
