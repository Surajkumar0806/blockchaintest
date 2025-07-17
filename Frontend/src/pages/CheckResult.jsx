import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckResult = () => {
  const [rollNo, setRollNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/find-student', {
         studentName: studentName.trim(),
         rollNo: rollNo.trim().toUpperCase()
      });
      if (res.data.studentId) {
        navigate(`/result/${res.data.studentId}`);
      } else {
        setError('Invalid name or roll number');
      }
    } catch (err) {
      setError('Invalid name or roll number');
    }
  };

  return (
    <div>
      <h2>Check Your Result</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={(e) => setStudentName(e.target.value)} required />
        <input type="text" placeholder="Roll Number" onChange={(e) => setRollNo(e.target.value)} required />
        <button type="submit">Search Result</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CheckResult;
