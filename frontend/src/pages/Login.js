import { useContext, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} required />
              </div>
              <button className="btn btn-primary w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
