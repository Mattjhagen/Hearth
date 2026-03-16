import React, { useState } from 'react';
import { X, Calendar, MapPin, Tag, AlignLeft, Type } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export const CreateGatheringModal = ({ isOpen, onClose, onCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    location: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('gatherings')
        .insert([{ 
          host_id: user.id,
          title: formData.title,
          category: formData.category,
          date: formData.date,
          location: formData.location,
          description: formData.description
        }]);

      if (error) throw error;
      
      toast.success('Gathering scheduled successfully!');
      onCreated(); // Callback to refresh the feed
      setFormData({ title: '', category: '', date: '', location: '', description: '' });
      onClose();
    } catch (err) {
      toast.error('Failed to create gathering: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Host a Gathering</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <Type size={18} />
            <input 
              type="text" 
              name="title"
              placeholder="Gathering Title (e.g. Park Cleanup)" 
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Tag size={18} />
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', color: formData.category ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              <option value="" disabled>Select Category</option>
              <option value="Social">Social</option>
              <option value="Environment">Environment</option>
              <option value="Learning">Learning</option>
              <option value="Mutual Aid">Mutual Aid</option>
              <option value="Creative">Creative</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <Calendar size={18} />
            <input 
              type="text" 
              name="date"
              placeholder="Date & Time (e.g. Saturday, 2:00 PM)" 
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <MapPin size={18} />
            <input 
              type="text" 
              name="location"
              placeholder="Location (e.g. Riverside Park)" 
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group" style={{ alignItems: 'flex-start' }}>
            <AlignLeft size={18} style={{ marginTop: '0.2rem' }} />
            <textarea 
              name="description"
              placeholder="What to expect? What should people bring?" 
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Gathering'}
          </button>
        </form>
      </div>
    </div>
  );
};
