import { useState } from "react";
import './ContactPage.css';
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Message Sent! Thank you for contacting us.");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="contact-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Contact Us</h1>
        <p>Have questions or feedback? Reach out to us!</p>
      </section>

      {/* Contact Form and Info */}
      <section className="contact-content">
        <div className="contact-form-container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Sending..." : "Send Message"} <Send />
            </button>
          </form>
        </div>

        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <Mail />
            <div>
              <p>Email</p>
              <span>info@yourwebsite.com</span>
            </div>
          </div>
          <div className="info-item">
            <Phone />
            <div>
              <p>Phone</p>
              <span>+1 (234) 567-890</span>
            </div>
          </div>
          <div className="info-item">
            <MapPin />
            <div>
              <p>Address</p>
              <span>123 Education Street, City, Country</span>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map-section">
      <h2>Find Us</h2>
      <iframe
        className="map-frame"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509366!2d144.95592831566766!3d-37.81720997975161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5779df69c4a400!2sYour%20Business%20Location!5e0!3m2!1sen!2s!4v1614312110484"
        allowFullScreen=""
        loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
