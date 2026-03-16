import React, { useState } from 'react';
import { X, Hammer, HandHeart, AlignLeft, Type, Users } from 'lucide-react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export const PostSkillModal = ({ isOpen, onClose, onCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'offer',
    title: '',
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
        .from('skills')
        .insert([{ 
          user_id: user.id,
          type: formData.type,
          title: formData.title,
          description: formData.description
        }]);

      if (error) throw error;
      
      toast.success(formData.type === 'offer' ? 'Skill offered successfully!' : 'Skill requested successfully!');
      onCreated(); // Callback to refresh the feed
      setFormData({ type: 'offer', title: '', description: '' });
      onClose();
    } catch (err) {
      toast.error('Failed to post skill: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ padding: '2rem', maxWidth: '500px', width: '90%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Community Skill Swap</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            <button
              type="button"
              className={`btn ${formData.type === 'offer' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setFormData(prev => ({ ...prev, type: 'offer'}))}
            >
              <HandHeart size={18} /> Offer a Skill
            </button>
            <button
              type="button"
              className={`btn ${formData.type === 'request' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => setFormData(prev => ({ ...prev, type: 'request'}))}
            >
              <Users size={18} /> Request Help
            </button>
          </div>

          <div className="input-group">
            <Type size={18} />
            <input 
              type="text" 
              name="title"
              placeholder={formData.type === 'offer' ? "I can teach..." : "I need help with..."} 
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group" style={{ alignItems: 'flex-start' }}>
            <AlignLeft size={18} style={{ marginTop: '0.2rem' }} />
            <textarea 
              name="description"
              placeholder="Add more details (e.g. time commitment, beginner friendly, etc.)" 
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
            {loading ? 'Posting...' : 'Post to Community Board'}
          </button>
        </form>
      </div>
    </div>
  );
};
