import { Container, Form, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { loginAPI } from '../API/api.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginAPI({ email, password });

      if (response.message) {
        localStorage.setItem("token", response.token);
        navigate('/');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container fluid className="desktop-login-container">
      <Row className="min-vh-100 g-0">
        {/* Left decorative panel - 40% width */}
        <Col lg={5} className="d-none d-lg-flex decorative-panel align-items-center justify-content-center p-5">
          <div className="panel-content text-white text-center">
            <div className="logo-container mb-4">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="logo-icon">
                <path d="M12 2L3 7L12 12L21 7L12 2Z" fill="#FFD700"/>
                <path d="M3 7V17L12 22L21 17V7L12 12L3 7Z" fill="#FF6347"/>
                <path d="M12 12L21 7V17L12 22V12Z" fill="#FFA500"/>
              </svg>
            </div>
            <h1 className="display-5 fw-bold mb-3">Welcome to Admin Pro</h1>
            <p className="lead mb-4">Your powerful dashboard awaits</p>
            <div className="color-palette d-flex justify-content-center gap-3 mt-4">
              {['#FF4757', '#2ED573', '#1E90FF', '#FFA502', '#9C88FF'].map((color, i) => (
                <div 
                  key={i}
                  className="color-dot"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>
        </Col>
        
        {/* Right form panel - 60% width */}
        <Col lg={7} className="d-flex align-items-center justify-content-center form-panel p-5">
          <div className="form-container w-100" style={{ maxWidth: '500px' }}>
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-1" style={{ color: '#FF4757' }}>Sign In</h2>
              <p className="text-muted">Enter your credentials to continue</p>
            </div>

            {error && (
              <Alert variant="danger" className="text-center mb-4" style={{ 
                backgroundColor: 'rgba(255, 107, 129, 0.2)', 
                border: '1px solid rgba(255, 107, 129, 0.3)',
                color: '#FF4757'
              }}>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleFormSubmit} className="px-4">
              <Form.Group className="mb-4">
                <Form.Label className="small fw-medium mb-2" style={{ color: '#57606F' }}>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="py-3 px-4"
                  style={{ 
                    borderRadius: '12px',
                    border: '1px solid #DFE4EA',
                    backgroundColor: '#F8F9FA'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-medium mb-2" style={{ color: '#57606F' }}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="py-3 px-4"
                  style={{ 
                    borderRadius: '12px',
                    border: '1px solid #DFE4EA',
                    backgroundColor: '#F8F9FA'
                  }}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check 
                  type="checkbox" 
                  label="Remember me" 
                  className="small"
                  style={{ color: '#57606F' }}
                />
                <a href="/forgot-password" className="small text-decoration-none" style={{ color: '#FF4757' }}>
                  Forgot password?
                </a>
              </div>

              <Button 
                type="submit" 
                className="w-100 py-3 fw-bold border-0 mb-3"
                disabled={loading}
                style={{ 
                  borderRadius: '12px',
                  background: 'linear-gradient(45deg, #FF4757, #FF6347)',
                  boxShadow: '0 4px 15px rgba(255, 71, 87, 0.3)',
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Signing In...
                  </>
                ) : 'Sign In'}
              </Button>

              <div className="text-center mt-4 pt-3" style={{ borderTop: '1px solid #eee' }}>
                <p className="small mb-0" style={{ color: '#57606F' }}>
                  Don't have an account?{' '}
                  <a href="/request-access" className="text-decoration-none fw-medium" style={{ color: '#1E90FF' }}>
                    Request access
                  </a>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      {/* CSS Styles */}
      <style>{`
        .desktop-login-container {
          min-height: 100vh;
          background-color: #FFFFFF;
        }
        
        .decorative-panel {
          background: linear-gradient(135deg, #FF4757 0%, #FF6347 100%);
          position: relative;
          overflow: hidden;
        }
        
        .decorative-panel::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          transform: rotate(30deg);
        }
        
        .form-panel {
          background-color: #FFFFFF;
        }
        
        .logo-icon {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }
        
        .color-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .color-dot:hover {
          transform: scale(1.2);
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(255, 71, 87, 0.25);
          border-color: #FF4757;
          background-color: white;
        }
        
        .btn:hover {
          background: linear-gradient(45deg, #FF6347, #FF4757) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 71, 87, 0.4) !important;
        }
        
        .btn:active {
          transform: translateY(0);
        }
      `}</style>
    </Container>
  );
}

export default Login;
