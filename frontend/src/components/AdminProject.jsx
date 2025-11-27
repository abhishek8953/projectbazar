import {useState,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import ProjectFormModal from "./ProjectFormModel";
import ProjectEditModal from "./ProjectEdinModal";



const API_URL=import.meta.env.VITE_API_URL;



const AdminProjects = ({ fetchProjects }) => {
  console.log("adminProject");
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Project deleted successfully!');
        loadProjects();
        fetchProjects();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete project');
      }
    } catch (err) {
      alert('Error deleting project: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="admin-projects">
      <div className="admin-header">
        <button onClick={() => navigate('/admin')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h2>Manage Projects</h2>
        <button onClick={() => setShowAddForm(true)} className="btn-primary">
          + Add New Project
        </button>
      </div>

      {showAddForm && (
        <ProjectFormModal
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            loadProjects();
            fetchProjects();
          }}
        />
      )}

      {editingProject && (
        <ProjectEditModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSuccess={() => {
            setEditingProject(null);
            loadProjects();
            fetchProjects();
          }}
        />
      )}

      <div className="projects-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id}>
                <td>
                  <div className="project-cell">
                    <strong>{project.title}</strong>
                    <small>{project.description.substring(0, 50)}...</small>
                  </div>
                </td>
                <td><span className="category-badge">{project.category}</span></td>
                <td><strong>₹{project.price}</strong></td>
                <td>
                  <span className={`status-badge ${project.isActive ? 'active' : 'inactive'}`}>
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button onClick={() => setEditingProject(project)} className="btn-edit" title="Edit">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="btn-delete" title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="no-data">
            <p>No projects found. Add your first project!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects;