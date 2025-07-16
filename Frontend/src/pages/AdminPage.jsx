import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    semester: '',
    subjects: [{ name: '', marks: '' }]
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/submit-result', formData);
      alert('Result saved successfully');
      console.log(res.data);
    } catch (error) {
      alert('Error submitting result');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Admin Panel: Enter Student Result</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="studentName" placeholder="Student Name" onChange={handleChange} required />
        <input type="text" name="rollNo" placeholder="Roll Number" onChange={handleChange} required />
        <input type="number" name="semester" placeholder="Semester" onChange={handleChange} required />

        <h4>Subjects</h4>
        {formData.subjects.map((subject, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Subject Name"
              value={subject.name}
              onChange={(e) => handleChange(e, index)}
              required
            />
            <input
              type="number"
              name="marks"
              placeholder="Marks"
              value={subject.marks}
              onChange={(e) => handleChange(e, index)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addSubject}>+ Add Subject</button><br /><br />
        <button type="submit">Submit Result</button>
      </form>
    </div>
  );
};

export default AdminPage;
