'use client'

import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

const TeacherForm = ({ onSuccess, teacherData }) => {
  const [classRooms] = useState(['11A', '11B', '11C', '11D', '12A', '12B', '12C', '12D']);
  const [allSubjects] = useState(['Math', 'Science', 'English', 'History', 'Geography', 'Art', 'Music']);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const initialFormData = {
    name: '',
    email: '',
    class: '',
    gender: '',
    subjects: [],
    salary: '',
    contact: '',
    designation: '',
    yearJoined: new Date().getFullYear().toString(),
    img: '/profilePicAlt.png'
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (teacherData) {
      const subjects = teacherData.subjects || [];
      setFormData({
        name: teacherData.name || '',
        email: teacherData.email || '',
        class: teacherData.class || '',
        gender: teacherData.gender || '',
        subjects: subjects,
        salary: teacherData.salary || '',
        contact: teacherData.contact || '',
        designation: teacherData.designation || '',
        yearJoined: teacherData.yearJoined || new Date().getFullYear().toString(),
        img: teacherData.img || '/profilePicAlt.png'
      });
      setSelectedSubjects(subjects);
    } else {
      setFormData(initialFormData);
      setSelectedSubjects([]);
    }
  }, [teacherData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubjectChange = (subject) => {
    let newSubjects;
    if (selectedSubjects.includes(subject)) {
      newSubjects = selectedSubjects.filter(s => s !== subject);
    } else {
      newSubjects = [...selectedSubjects, subject];
    }
    setSelectedSubjects(newSubjects);
    setFormData({
      ...formData,
      subjects: newSubjects
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (teacherData) {
        await updateDoc(doc(db, "teachers", teacherData.id), {
          ...formData,
          subjects: selectedSubjects
        });
        alert("Teacher updated successfully!");
      } else {
        await addDoc(collection(db, "teachers"), {
          ...formData,
          subjects: selectedSubjects
        });
        alert("Teacher added successfully!");
      }
      setFormData(initialFormData);
      setSelectedSubjects([]);
      onSuccess();
    } catch (error) {
      console.error("Error saving teacher: ", error);
      alert("Error saving teacher. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 z-50">
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      />
      <select
        name="class"
        value={formData.class}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      >
        <option value="">Select Class</option>
        {classRooms.map((classRoom, index) => (
          <option key={index} value={classRoom}>{classRoom}</option>
        ))}
      </select>
      
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Subjects</label>
        <div className="grid grid-cols-2 gap-2">
          {allSubjects.map((subject) => (
            <div key={subject} className="flex items-center">
              <input
                type="checkbox"
                id={`subject-${subject}`}
                checked={selectedSubjects.includes(subject)}
                onChange={() => handleSubjectChange(subject)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`subject-${subject}`} className="ml-2 block text-sm text-gray-700">
                {subject}
              </label>
            </div>
          ))}
        </div>
      </div>

      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      <input
        type="text"
        name="salary"
        placeholder="Salary"
        value={formData.salary}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Phone Number"
        value={formData.contact}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      />
      <input
        type="text"
        name="designation"
        placeholder="Designation"
        value={formData.designation}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <input
        type="number"
        name="yearJoined"
        placeholder="Year Joined"
        value={formData.yearJoined}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
        required
      />
      <button 
        type="submit" 
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {teacherData ? 'Update Teacher' : 'Add Teacher'}
      </button>
    </form>
  );
};

export default TeacherForm;