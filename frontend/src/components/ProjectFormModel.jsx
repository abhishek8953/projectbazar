import { useState } from "react";

const API_URL=import.meta.env.VITE_API_URL;





const ProjectFormModal = ({ onClose, onSuccess }) => {
  console.log("projectFormmodel");
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Mini',
    price: ''
  });
  const [files, setFiles] = useState({
    report: null,
    ppt: null,
    code: null
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [fileType]: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!files.report || !files.ppt || !files.code) {
      setError('Please select all files (Report, PPT, Code)');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('report', files.report);
      formDataToSend.append('ppt', files.ppt);
      formDataToSend.append('code', files.code);

      const res = await fetch(`${API_URL}/projects/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await res.json();

      if (res.ok) {
        alert('Project uploaded successfully!');
        onSuccess();
      } else {
        setError(data.message || 'Failed to upload project');
      }
    } catch (err) {
      setError('Failed to upload project: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Project</h3>
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
              disabled={uploading}
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
              required
              disabled={uploading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                disabled={uploading}
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
                disabled={uploading}
                min="0"
              />
            </div>
          </div>

          <div className="file-upload-section">
            <h4>📁 Upload Files</h4>
            
            <div className="form-group">
              <label>Report PDF (Max 10MB) *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, 'report')}
                required
                disabled={uploading}
              />
              {files.report && <p className="file-selected">✓ {files.report.name}</p>}
            </div>

            <div className="form-group">
              <label>Presentation (PPT/PPTX - Max 20MB) *</label>
              <input
                type="file"
                accept=".ppt,.pptx"
                onChange={(e) => handleFileChange(e, 'ppt')}
                required
                disabled={uploading}
              />
              {files.ppt && <p className="file-selected">✓ {files.ppt.name}</p>}
            </div>

            <div className="form-group">
              <label>Source Code (ZIP - Max 50MB) *</label>
              <input
                type="file"
                accept=".zip,.rar"
                onChange={(e) => handleFileChange(e, 'code')}
                required
                disabled={uploading}
              />
              {files.code && <p className="file-selected">✓ {files.code.name}</p>}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={uploading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={uploading}>
              {uploading ? '⏳ Uploading...' : '📤 Upload Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ProjectFormModal;
