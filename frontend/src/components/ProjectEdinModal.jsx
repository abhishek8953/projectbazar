import { useState } from "react";
const API_URL=import.meta.env.VITE_API_URL;



const ProjectEditModal = ({ project, onClose, onSuccess }) => {
  console.log("projectEDItMODAL")
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    category: project.category,
    price: project.price
  });
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Project updated successfully!');
        onSuccess();
      } else {
        setError(data.message || 'Failed to update project');
      }
    } catch (err) {
      setError('Failed to update project: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Project</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              disabled={updating}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              required
              disabled={updating}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                disabled={updating}
              >
                <option value="Mini">Mini</option>
                <option value="Medium">Medium</option>
                <option value="Major">Major</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
                disabled={updating}
                min="0"
              />
            </div>
          </div>

          <div className="info-message">
            <strong>Note:</strong> To update files, you need to delete and re-upload the project.
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={updating}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ProjectEditModal;
