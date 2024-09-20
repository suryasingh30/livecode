import React from 'react';

const Alert = ({ title } : {title: string}) => {
  return (
    <div style={{ padding: '10px', backgroundColor: 'red', color: 'white', borderRadius: '5px' }}>
      <p>{title}</p>
    </div>
  );
};

export default Alert;
