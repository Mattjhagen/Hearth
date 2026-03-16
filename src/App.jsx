import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight,
  HandHeart,
  Hammer,
  Leaf
} from 'lucide-react';

const Navbar = () => (
  <nav className="glass-nav">
    <a href="/" className="nav-brand">
      <Flame size={28} />
      Hearth
    </a>
    <div className="nav-links">
      <a href="#gatherings" className="nav-link">Gatherings</a>
      <a href="#skills" className="nav-link">Skill Swap</a>
      <a href="#about" className="nav-link">Our Mission</a>
      <button className="btn btn-primary">Join Locally</button>
    </div>
  </nav>
);

const HeroSection = () => (
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
      <a href="#gatherings" className="btn btn-primary">
        Find Local Gatherings <ArrowRight size={18} />
      </a>
      <a href="#skills" className="btn btn-secondary">
        Offer a Skill
      </a>
    </div>
  </section>
);

const GatheringsSection = () => {
  const events = [
    {
      id: 1,
      title: 'Community Garden Cleanup',
      category: 'Environment',
      date: 'Tomorrow, 9:00 AM',
      location: 'Riverside Park',
      host: 'Sarah J.',
      attendees: 12
    },
    {
      id: 2,
      title: 'Board Game Cafe Meetup',
      category: 'Social',
      date: 'Friday, 7:00 PM',
      location: 'The Roasted Bean',
      host: 'Mike T.',
      attendees: 5
    },
    {
      id: 3,
      title: 'Beginner Woodworking Workshop',
      category: 'Learning',
      date: 'Saturday, 1:00 PM',
      location: 'MakerSpace Downtown',
      host: 'Elena R.',
      attendees: 8
    }
  ];

  return (
    <section id="gatherings" className="section-padding">
      <div className="container">
        <h2 className="section-title">Local Gatherings</h2>
        <p className="section-subtitle">
          Small, intentional meetups happening in your neighborhood this week. 
          No screens, just real conversations.
        </p>

        <div className="card-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="card-header">
                <span className="card-tag">{event.category}</span>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
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
                  <span>{event.host}</span>
                </div>
              </div>
              <div className="card-footer">
                <div className="attendee-stack">
                  <div className="attendee-avatar">+</div>
                  <div className="attendee-avatar">{}</div>
                  <div className="attendee-avatar">{}</div>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {event.attendees} joining
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-secondary border">Host a Gathering</button>
        </div>
      </div>
    </section>
  );
};

const SkillSwapSection = () => {
  const skills = [
    {
      id: 1,
      type: 'offer',
      title: 'Sourdough Baking Basics',
      person: 'David K.',
      distance: '0.5 miles away',
      icon: <HandHeart size={20} />
    },
    {
      id: 2,
      type: 'request',
      title: 'Need help fixing bike chain',
      person: 'Anna L.',
      distance: '1.2 miles away',
      icon: <Hammer size={20} />
    },
    {
      id: 3,
      type: 'offer',
      title: 'Urban Gardening Tips & Seeds',
      person: 'Marcus F.',
      distance: '0.8 miles away',
      icon: <Leaf size={20} />
    }
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <h2 className="section-title">Community Skill Swap</h2>
        <p className="section-subtitle">
          Trade the algorithm for mutual aid. Offer what you know, request what you need, 
          and build a resilient local network.
        </p>

        <div className="card-grid">
          {skills.map(skill => (
            <div key={skill.id} className={`event-card skill-card ${skill.type}`}>
              <div className="card-header">
                <span className="card-tag">
                  {skill.type === 'offer' ? 'Offering' : 'Requesting'}
                </span>
                {skill.icon}
              </div>
              <h3 className="card-title">{skill.title}</h3>
              <div className="card-details">
                <div className="detail-item">
                  <Users size={16} />
                  <span>{skill.person}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{skill.distance}</span>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  {skill.type === 'offer' ? 'Learn from ' : 'Help '} {skill.person.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
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
  return (
    <div className="app-wrapper" style={{ padding: '0 1rem' }}>
      <div className="container">
        <Navbar />
      </div>
      
      <main>
        <HeroSection />
        <GatheringsSection />
        <SkillSwapSection />
      </main>

      <Footer />
    </div>
  );
}
