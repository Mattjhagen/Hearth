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
import { CreateGatheringModal } from './CreateGatheringModal';
import { PostSkillModal } from './PostSkillModal';
import { supabase } from './supabaseClient';
import { Toaster, toast } from 'react-hot-toast';

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


const GatheringsSection = ({ onOpenAuth, onOpenCreate }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('gatherings')
        .select(`
          *,
          profiles:host_id (name),
          gathering_attendees (user_id)
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
      onOpenCreate();
    }
  };

  const handleJoin = async (gatheringId, isJoining) => {
    if (!user) {
      onOpenAuth();
      return;
    }

    try {
      if (isJoining) {
        const { error } = await supabase
          .from('gathering_attendees')
          .insert([{ gathering_id: gatheringId, user_id: user.id }]);
        if (error) throw error;
        toast.success("You're going! See you there.");
      } else {
        const { error } = await supabase
          .from('gathering_attendees')
          .delete()
          .match({ gathering_id: gatheringId, user_id: user.id });
        if (error) throw error;
        toast.success("You've left this gathering.");
      }
      fetchEvents(); // Refresh data
    } catch (err) {
      toast.error(err.message);
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
            {events.map(event => {
              const attendees = event.gathering_attendees || [];
              const isAttending = user && attendees.some(a => a.user_id === user.id);
              
              return (
              <div key={event.id} className="event-card">
                <div className="card-header">
                  <span className="card-tag">{event.category}</span>
                  {user && event.host_id === user.id ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>Your Event</span>
                  ) : (
                    <button onClick={() => handleJoin(event.id, !isAttending)} className={`btn ${isAttending ? 'btn-secondary' : 'btn-primary'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      {isAttending ? 'Leave' : 'Join'}
                    </button>
                  )}
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
                <div className="card-footer">
                  <div className="attendee-stack" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--text-secondary)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {attendees.length} joining
                    </span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={handleAction} className="btn btn-secondary border">Host a Gathering</button>
        </div>
      </div>
    </section>
  );
};

const SkillSwapSection = ({ onOpenAuth, onOpenCreate }) => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // We are using a function reference for fetchSkills in the component, so export it or call it inside useEffect directly.
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

  useEffect(() => {
    fetchSkills();
  }, [user]);

  const handleAction = () => {
    if (!user) {
      onOpenAuth();
    } else {
      onOpenCreate();
    }
  };

  const handleConnect = (skill) => {
    if (!user) {
      onOpenAuth();
    } else {
      if (user.id === skill.user_id) {
         toast("This is your own post.");
      } else {
         toast.success(`Message Request sent to ${skill.profiles?.name?.split(' ')[0] || 'User'}! (Demo)`);
      }
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
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <button onClick={() => handleConnect(skill)} className="btn btn-primary" style={{ width: '100%' }}>
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
  const [isGatheringModalOpen, setIsGatheringModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  // Using a trick to force child components to refresh data
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="app-wrapper" style={{ padding: '0 1rem' }}>
      <div className="container">
        <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />
      </div>
      
      <main key={refreshKey}>
        <HeroSection onOpenAuth={() => setIsAuthModalOpen(true)} />
        <GatheringsSection 
          onOpenAuth={() => setIsAuthModalOpen(true)} 
          onOpenCreate={() => setIsGatheringModalOpen(true)} 
        />
        <SkillSwapSection 
          onOpenAuth={() => setIsAuthModalOpen(true)} 
          onOpenCreate={() => setIsSkillModalOpen(true)} 
        />
      </main>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <CreateGatheringModal 
         isOpen={isGatheringModalOpen}
         onClose={() => setIsGatheringModalOpen(false)}
         onCreated={() => {
           setRefreshKey(k => k + 1); // Triggers re-render of GatheringSection
         }}
      />

      <PostSkillModal 
         isOpen={isSkillModalOpen}
         onClose={() => setIsSkillModalOpen(false)}
         onCreated={() => {
           setRefreshKey(k => k + 1); // Triggers re-render of SkillSection
         }}
      />

      <Toaster position="bottom-center" />
    </div>
  );
}
