import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPage.css';

// ✅ Toastify import
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



// import { useEffect } from 'react';
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
    subjects: [{ name: '', marks: '' }]
  });

  const [errors, setErrors] = useState({});

  // ✅ State for loading and form validation
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const updatedSubjects = [...formData.subjects];
      updatedSubjects[index][e.target.name] = e.target.value;
      setFormData({ ...formData, subjects: updatedSubjects });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', marks: '' }]
    });
  };

  // ✅ Validation logic
  const validateForm = () => {
    const errors = {};
    if (!formData.studentName.trim()) {
      errors.studentName = "Name is required";
    }
    if (!formData.rollNo.trim()) {
      errors.rollNo = "Roll number is required";
    }
    if (!/^[A-Z0-9]+$/i.test(formData.rollNo)) {
      errors.rollNo = "Invalid roll number format";
    }
    if (!formData.semester || isNaN(formData.semester) || formData.semester < 1 || formData.semester > 8) {
      errors.semester = "Enter a valid semester (1–8)";
    }
    formData.subjects.forEach((subject, index) => {
      if (!subject.name.trim()) {
        errors[`subjectName-${index}`] = "Subject name is required";
      }
      if (subject.marks === '' || isNaN(subject.marks) || subject.marks < 0 || subject.marks > 100) {
        errors[`subjectMarks-${index}`] = "Enter valid marks (0–100)";
      }
    });
    return errors;
  };

  // ✅ Revalidate form on data change
  useEffect(() => {
    const validationErrors = validateForm();
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true); // ✅ Start loading spinner

    try {
      const res = await axios.post('http://localhost:3000/submit-result', formData);
      toast.success('Result submitted successfully!');
      console.log(res.data);
      setFormData({
        studentName: '',
        rollNo: '',
        semester: '',
        subjects: [{ name: '', marks: '' }]
      });
      setErrors({});
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({ rollNo: "Result already exists for this roll number and semester" });
      } else {
        toast.error('Error submitting result. Please try again.');
      }
      console.error(error);
    } finally {
      setIsLoading(false); // ✅ End loading spinner
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
          <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={handleChange}
          />
          {errors.studentName && <p style={{ color: 'red' }}>{errors.studentName}</p>}

          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={formData.rollNo}
            onChange={handleChange}
          />
          {errors.rollNo && <p style={{ color: 'red' }}>{errors.rollNo}</p>}

          <input
            type="number"
            name="semester"
            placeholder="Semester"
            value={formData.semester}
            onChange={handleChange}
          />
          {errors.semester && <p style={{ color: 'red' }}>{errors.semester}</p>}

          <h4>Subjects</h4>
          <div className="subject-group">
            {formData.subjects.map((subject, index) => (
              <div key={index} style={{ flex: '1 1 45%' }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[`subjectName-${index}`] && (
                  <p style={{ color: "red" }}>{errors[`subjectName-${index}`]}</p>
                )}
                <input
                  type="number"
                  name="marks"
                  placeholder="Marks"
                  value={subject.marks}
                  onChange={(e) => handleChange(e, index)}
                />
                {errors[`subjectMarks-${index}`] && (
                  <p style={{ color: "red" }}>{errors[`subjectMarks-${index}`]}</p>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={addSubject}>+ Add Subject</button><br /><br />

          {/* ✅ Disable if invalid or loading */}
          <button type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Result'}
          </button>
        </form>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
    </>
    
  );
};

export default AdminPage;

