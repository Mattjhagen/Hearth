import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight,
  HandHeart,
  Hammer,
  Leaf,
  LogOut
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { AuthModal } from './AuthModal';
import { supabase } from './supabaseClient';
import { Toaster } from 'react-hot-toast';

// ... (Navbar, HeroSection, Footer remain unchanged) ...
const Navbar = ({ onOpenAuth }) => {
  const { user, signOut } = useAuth();

  return (
    <nav className="glass-nav">
      <a href="/" className="nav-brand">
        <Flame size={28} />
        Hearth
      </a>
      <div className="nav-links">
        <a href="#gatherings" className="nav-link">Gatherings</a>
        <a href="#skills" className="nav-link">Skill Swap</a>
        <a href="#about" className="nav-link">Our Mission</a>
        {user ? (
          <button onClick={signOut} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Sign Out
          </button>
        ) : (
          <button onClick={onOpenAuth} className="btn btn-primary">Join Locally</button>
        )}
      </div>
    </nav>
  );
};

const HeroSection = ({ onOpenAuth }) => {
  const { user } = useAuth();
  
  return (
    <section className="hero">
      <div className="hero-tag">
        <span role="img" aria-label="wave">👋</span> Disconnect to Connect
      </div>
      <h1 className="hero-title">
        Bring People <br /> <span className="text-gradient">Back Together.</span>
      </h1>
      <p className="hero-desc">
        In a world of endless feeds and digital isolation, Hearth helps you find real people, 
        share real skills, and build a local community right where you live.
      </p>
      <div className="hero-actions">
        {user ? (
           <a href="#gatherings" className="btn btn-primary">
             Find Local Gatherings <ArrowRight size={18} />
           </a>
        ) : (
           <button onClick={onOpenAuth} className="btn btn-primary">
             Get Started <ArrowRight size={18} />
           </button>
        )}
        <a href="#skills" className="btn btn-secondary">
          Offer a Skill
        </a>
      </div>
    </section>
  );
};


const GatheringsSection = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('gatherings')
        .select(`
          *,
          profiles:host_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (!user) {
      onOpenAuth();
    } else {
      alert("Opening 'Create Gathering' modal... (To be implemented)");
    }
  };

  return (
    <section id="gatherings" className="section-padding">
      <div className="container">
        <h2 className="section-title">Local Gatherings</h2>
        <p className="section-subtitle">
          Small, intentional meetups happening in your neighborhood this week. 
          No screens, just real conversations.
        </p>

        {loading ? (
           <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>Loading gatherings...</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
            No gatherings found. Be the first to host one!
          </div>
        ) : (
          <div className="card-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="card-header">
                  <span className="card-tag">{event.category}</span>
                  <button onClick={handleAction} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    Join
                  </button>
                </div>
                <h3 className="card-title">{event.title}</h3>
                <div className="card-details">
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="detail-item">
                    <span style={{fontWeight: 600, color: 'var(--text-primary)'}}>Host:</span>
                    <span>{event.profiles?.name || 'Unknown User'}</span>
                  </div>
                </div>
                {/* Mocking attendees UI for now since joining logic isn't built yet */}
                <div className="card-footer">
                  <div className="attendee-stack">
                    <div className="attendee-avatar">+</div>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    0 joining
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center' }}>
          <button onClick={handleAction} className="btn btn-secondary border">Host a Gathering</button>
        </div>
      </div>
    </section>
  );
};

const SkillSwapSection = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          profiles:user_id (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    if (!user) {
      onOpenAuth();
    } else {
      alert("Opening 'New Skill' modal... (To be implemented)");
    }
  };

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('plant') || t.includes('garden')) return <Leaf size={20} />;
    if (t.includes('fix') || t.includes('build') || t.includes('wood')) return <Hammer size={20} />;
    return <HandHeart size={20} />;
  }

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <h2 className="section-title">Community Skill Swap</h2>
        <p className="section-subtitle">
          Trade the algorithm for mutual aid. Offer what you know, request what you need, 
          and build a resilient local network.
        </p>

        {loading ? (
           <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>Loading skills...</div>
        ) : skills.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>
            No skills posted yet. Be the first to offer or request a skill!
          </div>
        ) : (
          <div className="card-grid">
            {skills.map(skill => (
              <div key={skill.id} className={`event-card skill-card ${skill.type}`}>
                <div className="card-header">
                  <span className="card-tag">
                    {skill.type === 'offer' ? 'Offering' : 'Requesting'}
                  </span>
                  {getIcon(skill.title)}
                </div>
                <h3 className="card-title">{skill.title}</h3>
                <div className="card-details">
                  <div className="detail-item">
                    <Users size={16} />
                    <span>{skill.profiles?.name || 'Unknown User'}</span>
                  </div>
                  {/* We removed hardcoded distance since location tracking isn't fully built into schema yet */}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={handleAction} className="btn btn-primary" style={{ width: '100%' }}>
                    {skill.type === 'offer' ? 'Learn from ' : 'Help '} {skill.profiles?.name?.split(' ')[0] || 'User'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
           <button onClick={handleAction} className="btn btn-primary">Post a Skill</button>
        </div>
      </div>
    </section>
  );
};


const Footer = () => (
  <footer className="glass-footer">
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Flame size={24} color="var(--primary-color)" />
        <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Hearth</span>
      </div>
      <p style={{ color: 'var(--text-secondary)' }}>
        Rebuilding the village, one connection at a time.
      </p>
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        &copy; {new Date().getFullYear()} Hearth Local Community Network.
      </div>
    </div>
  </footer>
);

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="app-wrapper" style={{ padding: '0 1rem' }}>
      <div className="container">
        <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />
      </div>
      
      <main>
        <HeroSection onOpenAuth={() => setIsAuthModalOpen(true)} />
        <GatheringsSection onOpenAuth={() => setIsAuthModalOpen(true)} />
        <SkillSwapSection onOpenAuth={() => setIsAuthModalOpen(true)} />
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <Toaster position="bottom-center" />
    </div>
  );
}
