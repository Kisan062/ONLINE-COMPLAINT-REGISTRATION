import { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { user, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Registration complete');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-7 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
              </div>
              <button className="btn btn-success w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
