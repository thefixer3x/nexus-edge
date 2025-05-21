import React from 'react';
import './IntegrationsInterface.css';

const IntegrationsInterface = () => {
  const integrations = [
    { name: 'PayPal', icon: '💰', status: 'Connected' },
    { name: 'Google Auth', icon: '🔐', status: 'Available' },
    { name: 'Twitter', icon: '🐦', status: 'Available' },
    { name: 'GitHub', icon: '🐙', status: 'Available' },
  ];

  return (
    <div className="integrations-container">
      <h1>Available Integrations</h1>
      <div className="integrations-grid">
        {integrations.map((integration, index) => (
          <div key={index} className="integration-card">
            <div className="integration-icon">{integration.icon}</div>
            <h3>{integration.name}</h3>
            <span className={`status ${integration.status.toLowerCase()}`}>
              {integration.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsInterface;
