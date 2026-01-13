import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ArrowLeft, Save, X } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Gaming', 'Movies', 'Music', 'Sports', 'Reading', 'Travel',
  'Cooking', 'Photography', 'Art', 'Technology', 'Fashion',
  'Fitness', 'Yoga', 'Dancing', 'Writing', 'Coding', 'Anime',
  'Food', 'Nature', 'Pets', 'Cars', 'Science', 'History'
];

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    interests: user?.interests || [],
    chatRate: user?.chatRate || '',
    videoRate: user?.videoRate || ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleInterest = (interest) => {
    const interests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({ ...formData, interests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.id), {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        interests: formData.interests,
        ...(user.userType === 'provider' && {
          chatRate: parseFloat(formData.chatRate) || 0,
          videoRate: parseFloat(formData.videoRate) || 0
        })
      });

      // Update local auth context
      await updateProfile(formData);

      alert('Profile updated successfully!');
      navigate('/home');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={20} />
        </button>
        <h2 style={styles.headerTitle}>Edit Profile</h2>
        <div style={{ width: '40px' }}></div>
      </div>

      {/* Form */}
      <div style={styles.content}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., New York, USA"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Interests ({formData.interests.length} selected)
            </label>
            <div style={styles.interestsGrid}>
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={{
                    ...styles.interestButton,
                    ...(formData.interests.includes(interest)
                      ? styles.interestButtonSelected
                      : {})
                  }}
                >
                  {interest}
                  {formData.interests.includes(interest) && (
                    <X size={14} style={{ marginLeft: '4px' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {user?.userType === 'provider' && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Chat Rate ($ per session)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="chatRate"
                  value={formData.chatRate}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., 5.00"
                />
                <p style={styles.helpText}>Set your rate for chat sessions</p>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Video Call Rate ($ per session)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="videoRate"
                  value={formData.videoRate}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., 10.00"
                />
                <p style={styles.helpText}>Set your rate for video call sessions</p>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.saveButton,
              ...(saving ? styles.saveButtonDisabled : {})
            }}
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f7fafc'
  },
  header: {
    background: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    background: '#f7fafc',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    color: '#4a5568'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a202c',
    margin: 0
  },
  content: {
    padding: '32px',
    maxWidth: '600px',
    margin: '0 auto'
  },
  form: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  textarea: {
    resize: 'vertical',
    minHeight: '100px',
    fontFamily: 'inherit'
  },
  interestsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px'
  },
  interestButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    background: 'white',
    color: '#4a5568',
    border: '2px solid #e2e8f0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  interestButtonSelected: {
    background: '#667eea',
    color: 'white',
    borderColor: '#667eea'
  },
  saveButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '8px'
  },
  helpText: {
    fontSize: '12px',
    color: '#718096',
    marginTop: '4px'
  },
  saveButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
};

export default EditProfile;
