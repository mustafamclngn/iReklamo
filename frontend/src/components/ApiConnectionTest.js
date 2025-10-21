import React, { useState, useEffect } from 'react';
import api from '../api/api';

const ApiConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError(null);

      const result = await api.get('/ping');
      setResponse(result.data);
      setConnectionStatus('success');
    } catch (err) {
      setError(err.message);
      setConnectionStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'orange';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success':
        return 'Connected Successfully';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Testing Connection...';
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px 0',
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>API Connection Test</h3>
      <p style={{ color: getStatusColor(), fontWeight: 'bold' }}>
        Status: {getStatusText()}
      </p>

      {connectionStatus === 'success' && response && (
        <div style={{ marginTop: '10px' }}>
          <h4>Response:</h4>
          <pre style={{
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div style={{ marginTop: '10px' }}>
          <h4>Error:</h4>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}

      <button
        onClick={testConnection}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Again
      </button>
    </div>
  );
};

export default ApiConnectionTest;
