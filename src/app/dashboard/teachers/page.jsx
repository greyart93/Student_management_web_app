'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BiSolidSearchAlt2 } from 'react-icons/bi';
import { FaListAlt, FaChartArea } from "react-icons/fa";
import Papa from 'papaparse';
import Image from 'next/image';
import TeacherForm from '@/components/TeacherForm';
import { useRouter } from 'next/navigation';
import { collection, getDocs, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import BarChartSalary from '@/components/BarChartSalary';

const Page = () => {
  const [user, setUser] = useState(null);
  const [teachersData, setTeachersData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formToggle, setFormToggle] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [editingTeacher, setEditingTeacher] = useState(null);

  const formRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) {
      router.push('/auth/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [router]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachers = [];
      querySnapshot.forEach((doc) => {
        teachers.push({ id: doc.id, ...doc.data() });
      });
      setTeachersData(teachers);
    } catch (error) {
      console.error('Failed to fetch teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacherId) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
      try {
        await deleteDoc(doc(db, 'teachers', teacherId));
        fetchTeachers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Failed to delete teacher');
      }
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormToggle(true);
  };

  const handleDownload = () => {
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Class', key: 'class' },
      { label: 'Email', key: 'email' },
      { label: 'Gender', key: 'gender' },
      { label: 'Subjects', key: 'subjects' },
      { label: 'Salary', key: 'salary' },
      { label: 'Contact', key: 'contact' },
      { label: 'Designation', key: 'designation' },
      { label: 'Year Joined', key: 'yearJoined' },
    ];

    const csvString = Papa.unparse({
      fields: headers.map((header) => header.label),
      data: teachersData.map((teacher) => [
        teacher.name,
        teacher.class,
        teacher.email,
        teacher.gender,
        teacher.subjects?.join(', ') || '',
        teacher.salary,
        teacher.contact,
        teacher.designation || '',
        teacher.yearJoined || '',
      ]),
    });

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'teachers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = teachersData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleForm = () => {
    setFormToggle((prev) => !prev);
    if (formToggle) {
      setEditingTeacher(null);
    }
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setFormToggle(false);
      setEditingTeacher(null);
    }
  };

  useEffect(() => {
    if (formToggle) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formToggle]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  if (!user) {
    return null;
  }

  return (
    <div className='flex flex-col sm:p-[30px] w-full flex-1 h-screen overflow-y-auto pt-[80px] lg:pt-8 relative gap-6'>
      {formToggle && (
        <div className='bg-black/30 rounded-tl-xl container absolute top-0 left-0 h-screen z-10 grid place-items-center'>
          <div ref={formRef} className='bg-white p-6 rounded-lg'>
            <TeacherForm 
              onSuccess={() => {
                fetchTeachers();
                setFormToggle(false);
                setEditingTeacher(null);
              }} 
              teacherData={editingTeacher}
            />
          </div>
        </div>
      )}
      <div className='flex gap-5'>
        <button
          onClick={toggleForm}
          className='bg-indigo-500 text-white font-semibold rounded-lg py-2 px-4 hover:bg-indigo-600'
        >
          {editingTeacher ? 'Edit Teacher' : 'Add Teachers'}
        </button>
        <button
          className='font-semibold text-indigo-600 border-[2px] rounded-md hover:border-indigo-600 py-2 px-4'
          onClick={handleDownload}
        >
          Export CSV
        </button>
      </div>

      <div className='relative rounded-lg'>
        <input
          className='rounded-md border px-4 py-2 pl-10 text-indigo-600 focus:outline-none focus:border-indigo-500 w-full'
          placeholder='Search for teacher by name or email'
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <BiSolidSearchAlt2 className='absolute left-[10px] top-[50%] -translate-y-[50%] text-indigo-600 text-[18px]' />
        <div className='absolute top-[50%] right-[10px] -translate-y-[50%] flex flex-row items-center justify-between gap-3'>
          <button 
            onClick={() => handleTabSwitch('list')} 
            className={`${activeTab === 'list' ? 'text-indigo-500' : 'text-gray-500'} text-3xl cursor-pointer hover:text-indigo-600`}
          >
            <FaListAlt className='hover:text-indigo-600 hover:scale-110 transition-transform transform' />
          </button>
          <button 
            onClick={() => handleTabSwitch('graph')} 
            className={`${activeTab === 'graph' ? 'text-[rgb(252,196,62)]' : 'text-gray-500'} text-3xl cursor-pointer`}
          >
            <FaChartArea className='hover:text-[rgb(252,196,62)] hover:scale-110 transition-transform transform'/>
          </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {loading ? (
            <div className='italic text-gray-400 text-[13px]'>Fetching...</div>
          ) : (
            <div className='overflow-x-auto'>
              {filteredData.length > 0 ? (
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-yellow-300'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                        Name
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                        Subjects
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                        Class
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                        Email
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                        Salary
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredData.map((row, index) => (
                      <tr
                        key={row.id}
                        className={
                          index % 2 === 0
                            ? 'bg-white cursor-pointer hover:scale-[1.02] transition-transform transform'
                            : 'bg-yellow-50 cursor-pointer hover:scale-[1.02] transition-transform transform'
                        }
                      >
                        <td className='flex items-center gap-3 px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
                          <div className='overflow-hidden max-w-10 max-h-10 rounded-full border-2 border-yellow-400'>
                            <Image
                              src={row.img || '/profilePicAlt.png'}
                              alt='teacher profile'
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                          {row.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-indigo-500'>
                          {row.subjects?.join(', ') || 'None'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-indigo-500'>
                          {row.class}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-indigo-500'>
                          {row.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-indigo-500'>
                          {row.salary}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-indigo-500'>
                          <div className='flex gap-2'>
                            <button 
                              onClick={() => handleEdit(row)}
                              className='text-blue-500 hover:text-blue-700'
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(row.id)}
                              className='text-red-500 hover:text-red-700'
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='text-gray-300 text-[15px]'>No teachers found!</div>
              )}
            </div>
          )}
        </>
      ) : (
        <BarChartSalary info={filteredData} />
      )}
    </div>
  );
};

export default Page;