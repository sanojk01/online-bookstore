import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, LinearProgress } from '@mui/material';
import { ArrowBack, CloudUpload, Close, Add } from '@mui/icons-material';
import API from '../../api/axios';
import { toast } from 'react-toastify';

/* ─── Styles ─────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,400;1,600&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.ab-root {
  background: #f5f5f0;
  min-height: 100vh;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  padding: 44px 20px;
}
@media (max-width: 768px) { .ab-root { padding: 20px 16px; } }
.ab-inner { max-width: 760px; margin: 0 auto; width: 100%; }

/* back btn */
.ab-back {
  width: 34px; height: 34px; border-radius: 9px;
  border: 1px solid #e8e8e4; background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; margin-top: 5px;
  transition: border-color 0.15s, color 0.15s;
  color: #555;
}
.ab-back:hover { border-color: #1c1c1c; color: #1c1c1c; }

/* page title */
.ab-title {
  font-family: 'Lora', serif; font-style: italic;
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  color: #1c1c1c; line-height: 1.2;
  margin-top: 4px;
}
.ab-sub { font-size: 13px; color: #888; margin-bottom: 12px; }

/* panel */
.ab-panel {
  background: #fff; border: 1px solid #e8e8e4;
  border-radius: 20px; padding: 28px;
  margin-bottom: 20px; width: 100%;
}
.ab-panel-title {
  font-family: 'Lora', serif; font-style: italic;
  font-size: 1.1rem; color: #1c1c1c; margin-bottom: 20px;
  display: flex; align-items: center; justify-content: space-between;
}

/* image counter */
.ab-img-count {
  font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: 20px; border: 1px solid;
  font-family: 'DM Sans', sans-serif;
}

/* image upload area */
.ab-img-row {
  display: flex; flex-wrap: wrap; gap: 12px;
}
.ab-img-thumb {
  width: 96px; height: 120px; border-radius: 12px;
  overflow: hidden; position: relative;
  border: 1px solid #e8e8e4; flex-shrink: 0;
}
.ab-img-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ab-img-remove {
  position: absolute; top: 5px; right: 5px;
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(0,0,0,0.55); border: none;
  color: #fff; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  transition: background 0.15s;
}
.ab-img-remove:hover { background: #dc2626; }
.ab-cover-label {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: rgba(28,28,28,0.75); text-align: center;
  font-size: 10px; font-weight: 600; color: #fff;
  padding: 3px 0; font-family: 'DM Sans', sans-serif;
}
.ab-upload-btn {
  width: 96px; height: 120px; border-radius: 12px;
  border: 1.5px dashed #c8c8c0; background: #fafaf8;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 6px; cursor: pointer; transition: all 0.18s;
  flex-shrink: 0;
}
.ab-upload-btn:hover { border-color: #1c1c1c; background: #f0f0eb; }
.ab-upload-btn.error { border-color: #dc2626; }
.ab-upload-label {
  font-size: 11px; font-weight: 500; color: #888;
  text-align: center; line-height: 1.3;
}

/* form grid */
.ab-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.ab-form-grid .full { grid-column: 1 / -1; }
.ab-form-grid .thirds {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}
@media (max-width: 640px) {
  .ab-form-grid { grid-template-columns: 1fr; }
  .ab-form-grid .thirds { grid-template-columns: 1fr; }
}

/* inputs */
.ab-field { display: flex; flex-direction: column; gap: 6px; }
.ab-label { font-size: 12px; font-weight: 600; color: #555; letter-spacing: 0.02em; }
.ab-input, .ab-textarea, .ab-select {
  width: 100%; padding: 11px 14px;
  border: 1px solid #e8e8e4; border-radius: 10px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1c1c1c;
  background: #fff; outline: none;
  transition: border-color 0.18s, box-shadow 0.18s;
  appearance: none; -webkit-appearance: none;
}
.ab-input:focus, .ab-textarea:focus, .ab-select:focus {
  border-color: #1c1c1c;
  box-shadow: 0 0 0 3px rgba(28,28,28,0.06);
}
.ab-input.error, .ab-textarea.error, .ab-select.error { border-color: #dc2626; }
.ab-input::placeholder, .ab-textarea::placeholder { color: #bbb; }
.ab-textarea { resize: vertical; min-height: 110px; line-height: 1.5; }
.ab-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
.ab-error-msg { font-size: 11.5px; color: #dc2626; margin-top: 2px; }

/* footer buttons */
.ab-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding-top: 4px;
}
.ab-btn-ghost {
  padding: 10px 22px; border-radius: 100px;
  border: 1px solid #e8e8e4; background: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 500; color: #555; cursor: pointer;
  transition: border-color 0.18s, color 0.18s;
}
.ab-btn-ghost:hover { border-color: #1c1c1c; color: #1c1c1c; }
.ab-btn-primary {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px; border-radius: 100px;
  border: none; background: #1c1c1c; color: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 13px;
  font-weight: 600; cursor: pointer;
  transition: background 0.18s, transform 0.18s;
}
.ab-btn-primary:hover:not(:disabled) { background: #333; transform: translateY(-1px); }
.ab-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CATEGORIES = [
  'Programming', 'Finance', 'Motivation', 'Science', 'History',
  'Technology', 'Biography', 'Self-Help', 'Other',
];

export default function AddBook() {
  const navigate     = useNavigate();
  const fileInputRef = useRef();

  const [loading, setLoading] = useState(false);
  const [images,  setImages]  = useState([]);   // { file, preview }
  const [errors,  setErrors]  = useState({});
  const [form, setForm] = useState({
    title: '', author: '', description: '',
    price: '', stock: '', category: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed.');
      return;
    }
    const newImgs = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setImages(prev => [...prev, ...newImgs]);
    setErrors(prev => ({ ...prev, images: '' }));
    e.target.value = '';
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.author.trim()) errs.author = 'Author name is required';
    if (!form.price) errs.price = 'Price is required';
    else if (isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Enter a valid price';
    if (form.stock && (isNaN(form.stock) || Number(form.stock) < 0)) errs.stock = 'Enter a valid stock';
    if (images.length === 0) errs.images = 'At least one image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      images.forEach(img => formData.append('images', img.file));
      await API.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Book added successfully!');
      navigate('/seller/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{G}</style>
      <div className="ab-root">
        <div className="ab-inner">

        {/* Header */}
        <Box display="flex" alignItems="flex-start" gap={1.5} mb={3}>
          <button className="ab-back" onClick={() => navigate('/seller/books')}>
            <ArrowBack sx={{ fontSize: 18 }} />
          </button>
          <div>
            <div className="ab-title">Add New Book</div>
            <div className="ab-sub">Fill in the details to list your book</div>
          </div>
        </Box>

        {loading && (
          <LinearProgress sx={{
            mb: 2.5, borderRadius: 2, height: 3,
            bgcolor: '#e8e8e4',
            '& .MuiLinearProgress-bar': { bgcolor: '#1c1c1c' },
          }} />
        )}

        <form onSubmit={handleSubmit}>

          {/* ── Image Upload ──────────────────────────────────── */}
          <div className="ab-panel">
            <div className="ab-panel-title">
              <span>Book Images</span>
              <span
                className="ab-img-count"
                style={{
                  background: images.length >= 5 ? '#fef2f2' : '#f0f0eb',
                  color:      images.length >= 5 ? '#dc2626' : '#666',
                  borderColor: images.length >= 5 ? '#fecaca' : '#e0e0d8',
                }}
              >
                {images.length}/5
              </span>
            </div>

            <div className="ab-img-row">
              {images.map((img, i) => (
                <div key={i} className="ab-img-thumb">
                  <img src={img.preview} alt="" />
                  <button type="button" className="ab-img-remove" onClick={() => removeImage(i)}>
                    <Close sx={{ fontSize: 13 }} />
                  </button>
                  {i === 0 && <div className="ab-cover-label">Cover</div>}
                </div>
              ))}

              {images.length < 5 && (
                <div
                  className={`ab-upload-btn${errors.images ? ' error' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CloudUpload sx={{ fontSize: 22, color: '#aaa' }} />
                  <span className="ab-upload-label">Add<br />Image</span>
                </div>
              )}
            </div>

            {errors.images && <div className="ab-error-msg" style={{ marginTop: 10 }}>{errors.images}</div>}

            <input
              ref={fileInputRef} type="file" accept="image/*"
              multiple style={{ display: 'none' }} onChange={handleImages}
            />
          </div>

          {/* ── Book Details ──────────────────────────────────── */}
          <div className="ab-panel">
            <div className="ab-panel-title">Book Details</div>

            <div className="ab-form-grid">

              {/* Title */}
              <div className="ab-field">
                <label className="ab-label">Book Title *</label>
                <input
                  className={`ab-input${errors.title ? ' error' : ''}`}
                  name="title" value={form.title}
                  onChange={handleChange} placeholder="e.g. The Great Gatsby"
                />
                {errors.title && <span className="ab-error-msg">{errors.title}</span>}
              </div>

              {/* Author */}
              <div className="ab-field">
                <label className="ab-label">Author Name *</label>
                <input
                  className={`ab-input${errors.author ? ' error' : ''}`}
                  name="author" value={form.author}
                  onChange={handleChange} placeholder="e.g. F. Scott Fitzgerald"
                />
                {errors.author && <span className="ab-error-msg">{errors.author}</span>}
              </div>

              {/* Description */}
              <div className="ab-field full">
                <label className="ab-label">Description</label>
                <textarea
                  className="ab-textarea"
                  name="description" value={form.description}
                  onChange={handleChange}
                  placeholder="Write a short description about the book..."
                />
              </div>

              {/* Price / Stock / Category */}
              <div className="thirds">
                <div className="ab-field">
                  <label className="ab-label">Price (₹) *</label>
                  <input
                    className={`ab-input${errors.price ? ' error' : ''}`}
                    name="price" value={form.price} type="number" min="0"
                    onChange={handleChange} placeholder="e.g. 299"
                  />
                  {errors.price && <span className="ab-error-msg">{errors.price}</span>}
                </div>

                <div className="ab-field">
                  <label className="ab-label">Stock Quantity</label>
                  <input
                    className={`ab-input${errors.stock ? ' error' : ''}`}
                    name="stock" value={form.stock} type="number" min="0"
                    onChange={handleChange} placeholder="e.g. 50"
                  />
                  {errors.stock && <span className="ab-error-msg">{errors.stock}</span>}
                </div>

                <div className="ab-field">
                  <label className="ab-label">Category</label>
                  <select
                    className="ab-select"
                    name="category" value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* ── Footer ───────────────────────────────────────── */}
          <div className="ab-footer">
            <button type="button" className="ab-btn-ghost" onClick={() => navigate('/seller/books')}>
              Cancel
            </button>
            <button type="submit" className="ab-btn-primary" disabled={loading}>
              <Add sx={{ fontSize: 16 }} />
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>

        </form>
        </div>
      </div>
    </>
  );
}