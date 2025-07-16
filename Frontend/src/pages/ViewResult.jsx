import React from 'react';
import { useParams } from 'react-router-dom';

const ViewResult = () => {
  const { id } = useParams();

  return (
    <div>
      
      <iframe
        title="result"
        src={`http://localhost:3000/student/${id}/result`}
        style={{ width: '100%', height: '100vh', }}
      />
    </div>
  );
};

export default ViewResult;
