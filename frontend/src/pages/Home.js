import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="py-5 text-center">
      <h1 className="display-5">Complaint Management System</h1>
      <p className="lead text-muted">Submit complaints, track progress, and stay connected with agents and administrators.</p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link className="btn btn-primary btn-lg" to="/register">Get Started</Link>
        <Link className="btn btn-outline-secondary btn-lg" to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Home;
