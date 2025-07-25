import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    semester: '',
    photo: '',
    
    subjects: [
      {
        code: '',
        name: '',
        internalMarks: '',
        externalMarks: '',
      }
    ],
    
  });

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const newSubjects = [...formData.subjects];
      newSubjects[index][e.target.name] = e.target.value;
      setFormData({ ...formData, subjects: newSubjects });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [
        ...formData.subjects,
        {
          code: '',
          name: '',
          internalMarks: '',
          externalMarks: '',
        }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post('http://localhost:3000/submit-result', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Result submitted successfully!');
      setFormData({
        studentName: '',
        rollNo: '',
        semester: '',
        photo: '',
        subjects: [
          {
            code: '',
            name: '',
            internalMarks: '',
            externalMarks: '',
          }
        ],
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('Submission failed. Check console for details.');
    }
  };

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#1e1e2f',
        color: 'white'
      }}>
        <button onClick={handleLogout} style={{
          padding: '8px 16px',
          backgroundColor: '#ff4d4d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
        <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
      </div>

      <div className="admin-page-wrapper">
        <div className="admin-container">
          <h2>Admin Panel: Enter Student Result</h2>
          <form onSubmit={handleSubmit}>
            <input name="studentName" placeholder="Student Name" value={formData.studentName} onChange={handleChange} />
            <input name="rollNo" placeholder="Roll Number" value={formData.rollNo} onChange={handleChange} />
            <input name="semester" placeholder="Semester" value={formData.semester} onChange={handleChange} />
            <input name="photo" placeholder="Photo URL" value={formData.photo} onChange={handleChange} />

            <h4>Subjects</h4>
            <div className="subject-group">
              {formData.subjects.map((subject, index) => (
                <div key={index}>
                  <input name="code" placeholder="Subject Code" value={subject.code} onChange={(e) => handleChange(e, index)} />
                  <input name="name" placeholder="Subject Name" value={subject.name} onChange={(e) => handleChange(e, index)} />
                  <input name="internalMarks" placeholder="Internal Marks" value={subject.internalMarks} onChange={(e) => handleChange(e, index)} />
                  <input name="externalMarks" placeholder="External Marks" value={subject.externalMarks} onChange={(e) => handleChange(e, index)} />
                
          
                </div>
              ))}
            </div>

            <button type="button" onClick={addSubject}>+ Add Subject</button>
          
            <button type="submit">Submit Result</button>
          </form>
        </div>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </>
  );
};

export default AdminPage;
