import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, LinearProgress } from '@mui/material';
import { ArrowBack, CloudUpload, Close, Save, Delete } from '@mui/icons-material';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Technology', 'Biography', 'Self-Help', 'Other'];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  .eb-root {
    font-family: 'DM Sans', sans-serif;
    background: #f5f5f3;
    min-height: 100vh;
    padding: 40px 20px;
  }

  .eb-container {
    max-width: 760px;
    margin: 0 auto;
  }

  /* Header */
  .eb-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 32px;
  }
  .eb-back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px; height: 40px;
    border-radius: 12px;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.18s;
    color: #374151;
    flex-shrink: 0;
    margin-top: 4px;
  }
  .eb-back-btn:hover { border-color: #1a1a1a; color: #1a1a1a; transform: translateX(-2px); }
  .eb-page-title {
    font-family: 'Instrument Serif', serif;
    font-size: 32px;
    font-weight: 400;
    color: #1a1a1a;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
    line-height: 1.15;
  }
  .eb-page-sub {
    font-size: 14px;
    color: #888;
    font-weight: 400;
    margin: 0;
  }

  /* Cards — full width stacked */
  .eb-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 16px;
    padding: 28px 32px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20px;
  }

  .eb-section-title {
    font-family: 'Instrument Serif', serif;
    font-size: 22px;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 22px;
  }

  .eb-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .eb-card-header .eb-section-title { margin: 0; }

  /* Count pill */
  .eb-count-pill {
    display: inline-flex;
    align-items: center;
    padding: 3px 12px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
  }

  /* Image slots */
  .eb-images-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  .eb-img-slot {
    width: 110px; height: 130px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    border: 1.5px solid #e5e7eb;
  }
  .eb-img-slot img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .eb-img-remove {
    position: absolute; top: 6px; right: 6px;
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: rgba(15,15,15,0.65);
    color: #fff; border: none; cursor: pointer;
    transition: background 0.15s; padding: 0;
  }
  .eb-img-remove:hover { background: #ef4444; }
  .eb-img-badge {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: rgba(15,15,15,0.6);
    text-align: center; padding: 4px 0;
    font-size: 10px; font-weight: 700; color: #fff;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.05em; text-transform: uppercase;
  }
  .eb-img-add {
    width: 110px; height: 130px;
    border-radius: 12px;
    border: 1.5px dashed #d1d5db;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 8px; cursor: pointer;
    background: #fafafa;
    transition: all 0.18s; flex-shrink: 0;
  }
  .eb-img-add:hover { border-color: #1a1a1a; background: #f3f4f6; }
  .eb-img-add span { font-size: 12px; font-weight: 500; color: #888; text-align: center; line-height: 1.4; }
  .eb-img-add.error { border-color: #ef4444; }

  /* Form grid rows */
  .eb-row {
    display: grid;
    gap: 20px;
    margin-bottom: 20px;
  }
  .eb-row-2 { grid-template-columns: 1fr 1fr; }
  .eb-row-3 { grid-template-columns: 1fr 1fr 1fr; }
  .eb-row-1 { grid-template-columns: 1fr; }
  .eb-row:last-child { margin-bottom: 0; }

  /* Labels & inputs */
  .eb-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }
  .eb-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    color: #1a1a1a;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    -webkit-appearance: none;
  }
  .eb-input:focus { border-color: #1a1a1a; box-shadow: 0 0 0 3px rgba(26,26,26,0.06); }
  .eb-input.error { border-color: #ef4444; }
  .eb-input::placeholder { color: #bbb; }
  .eb-textarea { resize: vertical; min-height: 130px; line-height: 1.65; }
  .eb-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
    cursor: pointer;
  }
  .eb-error-msg { font-size: 12px; color: #ef4444; margin-top: 5px; }
  .eb-warn {
    font-size: 12.5px; color: #d97706;
    margin-top: 12px;
    display: flex; align-items: center; gap: 5px;
  }

  /* Actions */
  .eb-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-bottom: 16px;
  }
  .eb-btn-cancel {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 12px 24px;
    border-radius: 100px;
    background: #fff; color: #374151;
    border: 1.5px solid #e0e0e0;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.18s;
  }
  .eb-btn-cancel:hover { border-color: #1a1a1a; color: #1a1a1a; }
  .eb-btn-save {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    border-radius: 100px;
    background: #1a1a1a; color: #fff;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .eb-btn-save:hover:not(:disabled) {
    background: #333;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
  .eb-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

  @media (max-width: 600px) {
    .eb-root { padding: 24px 16px; }
    .eb-card { padding: 20px; }
    .eb-row-2, .eb-row-3 { grid-template-columns: 1fr; }
  }
`;

export default function EditBook() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const fileInputRef = useRef();

  const [fetching,       setFetching]       = useState(true);
  const [loading,        setLoading]        = useState(false);
  const [errors,         setErrors]         = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [toDelete,       setToDelete]       = useState([]);
  const [newImages,      setNewImages]      = useState([]);

  const [form, setForm] = useState({
    title: '', author: '', description: '',
    price: '', stock: '', category: ''
  });

  useEffect(() => { fetchBook(); }, [id]);

  const fetchBook = async () => {
    try {
      setFetching(true);
      const { data } = await API.get(`/books/${id}`);
      const book = data.book;
      setForm({
        title:       book.title       || '',
        author:      book.author      || '',
        description: book.description || '',
        price:       book.price       || '',
        stock:       book.stock       || '',
        category:    book.category    || ''
      });
      setExistingImages(book.images || []);
    } catch {
      toast.error('Failed to load book.');
      navigate('/seller/books');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const markForDelete = (fileId) => {
    setToDelete(prev => [...prev, fileId]);
    setExistingImages(prev => prev.filter(img => img.fileId !== fileId));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - (existingImages.length + newImages.length);
    if (files.length > remaining) {
      toast.error(`Only ${remaining} more image(s) can be added.`);
      return;
    }
    setNewImages(prev => [...prev, ...files.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImages[index].preview);
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.price) errs.price = 'Price is required';
    else if (isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Enter valid price';
    if (existingImages.length + newImages.length === 0) errs.images = 'At least one image is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => { if (val !== '') formData.append(key, val); });
      if (toDelete.length > 0) formData.append('deleteImages', JSON.stringify(toDelete));
      newImages.forEach(img => formData.append('images', img.file));
      await API.patch(`/books/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Book updated successfully!');
      navigate('/seller/books');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update book.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={32} sx={{ color: '#1a1a1a' }} />
      </Box>
    );
  }

  const totalImages = existingImages.length + newImages.length;

  return (
    <>
      <style>{styles}</style>
      <div className="eb-root">
        {loading && (
          <LinearProgress sx={{
            position: 'fixed', top: 0, left: 0, right: 0,
            height: 3, zIndex: 9999,
            bgcolor: '#eee',
            '& .MuiLinearProgress-bar': { bgcolor: '#1a1a1a' }
          }} />
        )}

        <div className="eb-container">

          {/* Header */}
          <div className="eb-header">
            <button className="eb-back-btn" onClick={() => navigate('/seller/books')}>
              <ArrowBack sx={{ fontSize: 18 }} />
            </button>
            <div>
              <h1 className="eb-page-title">Edit Book</h1>
              <p className="eb-page-sub">Update your book details</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Images card ── */}
            <div className="eb-card">
              <div className="eb-card-header">
                <h2 className="eb-section-title">Book Images</h2>
                <span className="eb-count-pill" style={{
                  background: totalImages >= 5 ? '#fef2f2' : '#f3f4f6',
                  color:      totalImages >= 5 ? '#dc2626' : '#6b7280',
                  border:     `1px solid ${totalImages >= 5 ? '#fecaca' : '#e5e7eb'}`
                }}>
                  {totalImages} / 5
                </span>
              </div>

              <div className="eb-images-row">
                {existingImages.map((img, i) => (
                  <div key={img.fileId} className="eb-img-slot">
                    <img src={img.url} alt="" />
                    <button className="eb-img-remove" type="button" onClick={() => markForDelete(img.fileId)}>
                      <Delete sx={{ fontSize: 13 }} />
                    </button>
                    {i === 0 && <div className="eb-img-badge">Cover</div>}
                  </div>
                ))}

                {newImages.map((img, i) => (
                  <div key={i} className="eb-img-slot" style={{ borderColor: '#a5b4fc' }}>
                    <img src={img.preview} alt="" />
                    <button className="eb-img-remove" type="button" onClick={() => removeNewImage(i)}>
                      <Close sx={{ fontSize: 13 }} />
                    </button>
                    <div className="eb-img-badge" style={{ background: 'rgba(79,70,229,0.7)' }}>New</div>
                  </div>
                ))}

                {totalImages < 5 && (
                  <div
                    className={`eb-img-add${errors.images ? ' error' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUpload sx={{ fontSize: 26, color: '#bbb' }} />
                    <span>Add<br />Image</span>
                  </div>
                )}
              </div>

              {errors.images && <p className="eb-error-msg">{errors.images}</p>}
              {toDelete.length > 0 && (
                <p className="eb-warn">⚠ {toDelete.length} image(s) will be removed on save</p>
              )}

              <input ref={fileInputRef} type="file" accept="image/*" multiple
                style={{ display: 'none' }} onChange={handleNewImages} />
            </div>

            {/* ── Details card ── */}
            <div className="eb-card">
              <h2 className="eb-section-title">Book Details</h2>

              {/* Row 1: Title + Author */}
              <div className="eb-row eb-row-2">
                <div>
                  <label className="eb-label">Book Title *</label>
                  <input
                    className={`eb-input${errors.title ? ' error' : ''}`}
                    name="title" value={form.title}
                    onChange={handleChange} placeholder="e.g. The Alchemist"
                  />
                  {errors.title && <p className="eb-error-msg">{errors.title}</p>}
                </div>
                <div>
                  <label className="eb-label">Author Name *</label>
                  <input
                    className="eb-input" name="author"
                    value={form.author} onChange={handleChange}
                    placeholder="e.g. Paulo Coelho"
                  />
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="eb-row eb-row-1">
                <div>
                  <label className="eb-label">Description</label>
                  <textarea
                    className="eb-input eb-textarea"
                    name="description" value={form.description}
                    onChange={handleChange}
                    placeholder="Write a short description about the book…"
                  />
                </div>
              </div>

              {/* Row 3: Price + Stock + Category */}
              <div className="eb-row eb-row-3">
                <div>
                  <label className="eb-label">Price (₹) *</label>
                  <input
                    className={`eb-input${errors.price ? ' error' : ''}`}
                    name="price" value={form.price}
                    onChange={handleChange} type="number" placeholder="0"
                  />
                  {errors.price && <p className="eb-error-msg">{errors.price}</p>}
                </div>
                <div>
                  <label className="eb-label">Stock Quantity</label>
                  <input
                    className="eb-input" name="stock"
                    value={form.stock} onChange={handleChange}
                    type="number" placeholder="0"
                  />
                </div>
                <div>
                  <label className="eb-label">Category</label>
                  <select
                    className="eb-input eb-select"
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

            {/* Actions */}
            <div className="eb-actions">
              <button type="button" className="eb-btn-cancel" onClick={() => navigate('/seller/books')}>
                Cancel
              </button>
              <button type="submit" className="eb-btn-save" disabled={loading}>
                <Save sx={{ fontSize: 16 }} />
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}