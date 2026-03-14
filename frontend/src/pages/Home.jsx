import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight, BarChart2, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{
        background: 'rgba(15,23,42,0.95)',
        padding: '16px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #1e293b',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{ color: '#38bdf8', fontSize: '24px', fontWeight: 800 }}>CoreInventory</h1>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#94a3b8', textDecoration: 'none' }}>Features</a>
          <a href="#about" style={{ color: '#94a3b8', textDecoration: 'none' }}>About</a>
          <a href="#contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact</a>
          <button onClick={() => navigate('/login')} style={{
            background: '#3b82f6', color: '#fff', border: 'none',
            padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600
          }}>Login</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '90vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', textAlign: 'center', padding: '80px 24px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)'
      }}>
        <div>
          <div style={{
            display: 'inline-block', background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa',
            padding: '6px 16px', borderRadius: '20px', fontSize: '13px',
            marginBottom: '24px', fontWeight: 600
          }}>🚀 Smart Inventory Management</div>
          <h1 style={{ fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: '24px' }}>
            Manage Your <br /><span style={{ color: '#38bdf8' }}>Inventory</span> Smarter
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '20px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            CoreInventory helps businesses track stock, manage receipts, deliveries, and transfers — all in one place.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} style={{
              background: '#3b82f6', color: '#fff', border: 'none',
              padding: '16px 32px', borderRadius: '12px', cursor: 'pointer',
              fontWeight: 700, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>Get Started <ArrowRight size={18} /></button>
            <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'transparent', color: '#94a3b8',
              border: '1px solid #334155', padding: '16px 32px',
              borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '16px'
            }}>Learn More</button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 48px', background: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Everything You Need</h2>
          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px', marginBottom: '64px' }}>Powerful features to manage your inventory efficiently</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { icon: <Package size={32} />, title: 'Product Management', desc: 'Create and manage products with SKU, categories, and stock levels.', color: '#3b82f6' },
              { icon: <ArrowRight size={32} />, title: 'Receipts', desc: 'Track incoming stock from vendors with automatic stock updates.', color: '#10b981' },
              { icon: <Truck size={32} />, title: 'Deliveries', desc: 'Manage outgoing orders and deliveries to customers.', color: '#f59e0b' },
              { icon: <RefreshCw size={32} />, title: 'Transfers', desc: 'Move stock between warehouses and locations easily.', color: '#8b5cf6' },
              { icon: <BarChart2 size={32} />, title: 'Dashboard', desc: 'Real-time KPIs and analytics at a glance.', color: '#ef4444' },
              { icon: <Package size={32} />, title: 'Multi-Warehouse', desc: 'Manage multiple warehouses from a single platform.', color: '#06b6d4' },
            ].map((f, i) => (
              <div key={i} style={{
                background: '#1e293b', borderRadius: '16px', padding: '32px',
                border: '1px solid #334155', transition: 'all 0.3s', cursor: 'default'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = f.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
              >
                <div style={{
                  background: f.color + '20', color: f.color, width: '64px', height: '64px',
                  borderRadius: '16px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '20px'
                }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" style={{ padding: '100px 48px', background: '#1e293b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '40px', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>About CoreInventory</h2>
          <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 1.8, marginBottom: '24px' }}>
            CoreInventory is a modern, modular Inventory Management System built to replace manual registers and Excel sheets. Our platform provides real-time stock tracking, smart alerts, and seamless operations for businesses of all sizes.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 1.8 }}>
            Built with React, Node.js, and MongoDB — CoreInventory is fast, reliable, and easy to use for both inventory managers and warehouse staff.
          </p>
        </div>
      </section>

      {/* Contact */}
      {/* Contact */}
<section id="contact" style={{ padding: '100px 48px', background: '#0f172a' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', fontSize: '40px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>Contact Us</h2>
    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '18px', marginBottom: '64px' }}>We'd love to hear from you</p>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Contact Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { icon: <Mail size={24} />, title: 'Email', value: 'support@coreinventory.com', color: '#3b82f6' },
          { icon: <Phone size={24} />, title: 'Phone', value: '+91 98765 43210', color: '#10b981' },
          { icon: <MapPin size={24} />, title: 'Location', value: 'Ahmedabad, Gujarat, India', color: '#f59e0b' },
        ].map((c, i) => (
          <div key={i} style={{
            background: '#1e293b', borderRadius: '16px', padding: '24px',
            border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{
              color: c.color, background: c.color + '20',
              width: '48px', height: '48px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>{c.icon}</div>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 700, marginBottom: '4px' }}>{c.title}</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Google Map */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155', minHeight: '300px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d235013.56697977296!2d72.74927473281254!3d23.020484618454173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e848aba5bd449%3A0x4fcedd11614f6516!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '300px', display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

    </div>
  </div>
</section>

      {/* Footer */}
      <footer style={{
        background: '#1e293b', borderTop: '1px solid #334155',
        padding: '24px 48px', textAlign: 'center', color: '#475569', fontSize: '14px'
      }}>
        © 2026 CoreInventory. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;