'use client';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { BsFillCalendarEventFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { PiExamFill } from "react-icons/pi";
import { FaMoneyBill } from "react-icons/fa";

const QuickInfoBoard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    events: 0,
    totalFees: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students count
        const studentsSnapshot = await getDocs(collection(db, 'students'));
        const studentCount = studentsSnapshot.size;

        // Fetch teachers count
        const teachersSnapshot = await getDocs(collection(db, 'teachers'));
        const teacherCount = teachersSnapshot.size;

        // Fetch events count 
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventCount = eventsSnapshot.size;

        // Calculate total fees (sum of all students' fees)
        let totalFees = 200000;
        // studentsSnapshot.forEach(doc => {
        //   const fee = doc.data().fee || 0;
        //   totalFees += parseFloat(fee);
        // });

        setStats({
          students: studentCount,
          teachers: teacherCount,
          totalFees: totalFees
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-evenly flex-wrap gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="border-2 border-gray-200 w-[200px] sm:w-[260px] h-[120px] rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-evenly flex-wrap gap-5">
      {/* Students Card */}
      <div className="border-2 border-indigo-500 flex flex-col sm:flex-row items-center w-[200px] sm:w-[260px] py-4 justify-evenly rounded-xl">
        <div className="text-indigo-500 text-[60px]">
          <IoIosPeople />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-500 text-[16px]">Students</p>
          <p className="text-indigo-500 font-bold text-[30px]">
            {formatNumber(stats.students)}
          </p>
        </div>
      </div>

      {/* Teachers Card */}
      <div className="border-2 border-[#fb7d5b] flex flex-col sm:flex-row items-center w-[200px] sm:w-[260px] py-4 justify-evenly rounded-xl">
        <div className="text-[#FB7D5B] text-[60px]">
          <IoIosPeople />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-500 text-[16px]">Teachers</p>
          <p className="text-[#FB7D5B] font-bold text-[30px]">
            {formatNumber(stats.teachers)}
          </p>
        </div>
      </div>

      {/* Events Card */}
      <div className="border-2 border-[rgb(252,196,62)] flex flex-col sm:flex-row items-center w-[200px] sm:w-[260px] py-4 justify-evenly rounded-xl">
        <div className="text-[#FCC43E] text-[45px]">
          <BsFillCalendarEventFill />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-500 text-[16px]">Events</p>
          <p className="text-[rgb(252,196,62)] font-bold text-[30px]">
            {formatNumber(5)}
          </p>
        </div>
      </div>

      {/* Total Fees Card */}
      {/* <div className="border-2 border-indigo-600 flex flex-col sm:flex-row items-center w-[200px] sm:w-[260px] justify-evenly py-4 rounded-xl">
        <div className="text-indigo-600 text-[60px]">
          <FaMoneyBill />
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="text-gray-500 text-[16px]">Total Fees</p>
          <p className="text-indigo-600 font-bold text-[30px]">
            {formatCurrency(200000)}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default QuickInfoBoard;