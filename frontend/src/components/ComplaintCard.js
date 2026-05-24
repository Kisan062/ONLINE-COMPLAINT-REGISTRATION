import { Link } from 'react-router-dom';

const ComplaintCard = ({ complaint }) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="card-title">{complaint.title}</h5>
            <p className="card-text text-muted mb-1">Category: {complaint.category}</p>
            <p className="card-text mb-1">Status: <strong>{complaint.status}</strong></p>
            <p className="card-text mb-0">Priority: {complaint.priority}</p>
          </div>
          <Link className="btn btn-outline-primary btn-sm" to={`/complaints/${complaint._id}`}>View</Link>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
