import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

const mockTeachersData = async() => {
  const data = [
    {
      id: 1,
      img: '/profilePicAlt.png',
      name: 'Agyemang Yaw',
      subject: 'Mathematics',
      class: '10A',
      email: 'agyemang.yaw@example.com',
      gender: 'Male',
      yearJoined: 2021,
      salary: 5000,
      contact: '123-456-7890',
    },
    {
      id: 2,
      img: '/profilePicAlt.png',
      name: 'Christabel Boadu',
      subject: 'English',
      class: '10B',
      email: 'christabel.boadu@example.com',
      gender: 'Female',
      yearJoined: 2018,
      salary: 4100,
      contact: '123-456-7891',
    },
    {
      id: 3,
      img: '/profilePicAlt.png',
      name: 'Kwame Asante',
      subject: 'Science',
      class: '10C',
      email: 'kwame.asante@example.com',
      gender: 'Male',
      yearJoined: 2019,
      salary:  3250,
      contact: '123-456-7892',
    },
    {
      id: 4,
      img: '/profilePicAlt.png',
      name: 'Akua Mensah',
      subject: 'Biology',
      class: '11A',
      email: 'akua.mensah@example.com',
      gender: 'Female',
      yearJoined: 2020,
      salary: 6500,
      contact: '123-456-7893',
    },
    {
      id: 5,
      img: '/profilePicAlt.png',
      name: 'Yaw Owusu',
      subject: 'Chemistry',
      class: '11B',
      email: 'yaw.owusu@example.com',
      gender: 'Male',
      yearJoined: 2017,
      salary:  4000,
      contact: '123-456-7894',
    },
    {
      id: 6,
      img: '/profilePicAlt.png',
      name: 'Ama Ofori',
      subject: 'Physics',
      class: '12A',
      email: 'ama.ofori@example.com',
      gender: 'Female',
      yearJoined: 2016,
      salary: 5600,
      contact: '123-456-7895',
    },
    {
      id: 7,
      img: '/profilePicAlt.png',
      name: 'Kojo Adjei',
      subject: 'History',
      class: '10D',
      email: 'kojo.adjei@example.com',
      gender: 'Male',
      yearJoined: 2021,
      salary: 5100,
      contact: '123-456-7896',
    },
    {
      id: 8,
      img: '/profilePicAlt.png',
      name: 'Efua Amankwah',
      subject: 'Geography',
      class: '11C',
      email: 'efua.amankwah@example.com',
      gender: 'Female',
      yearJoined: 2018,
      salary: 5500,
      contact: '123-456-7897',
    },
    {
      id: 9,
      img: '/profilePicAlt.png',
      name: 'Kofi Boateng',
      subject: 'Mathematics',
      class: '12B',
      email: 'kofi.boateng@example.com',
      gender: 'Male',
      yearJoined: 2015,
      salary: 2800,
      contact: '123-456-7898',
    },
    {
      id: 10,
      img: '/profilePicAlt.png',
      name: 'Adjoa Agyeman',
      subject: 'Economics',
      class: '10E',
      email: 'adjoa.agyeman@example.com',
      gender: 'Female',
      yearJoined: 2019,
      salary: 5200,
      contact: '123-456-7899',
    },
    {
      id: 11,
      img: '/profilePicAlt.png',
      name: 'Mensah Nkrumah',
      subject: 'Political Science',
      class: '11D',
      email: 'mensah.nkrumah@example.com',
      gender: 'Male',
      yearJoined: 2020,
      salary: 5300,
      contact: '123-456-7800',
    },
    {
      id: 12,
      img: '/profilePicAlt.png',
      name: 'Nana Yaa Boadu',
      subject: 'Literature',
      class: '12C',
      email: 'nana.yaa.boadu@example.com',
      gender: 'Female',
      yearJoined: 2017,
      salary: 5400,
      contact: '123-456-7801',
    }
    
  ];
  // try {
  //   const teachersCollection = collection(db, 'teachers');
  //   for (const teacher of data) {
  //     await addDoc(teachersCollection, teacher);
  //   }
  //   console.log('teachers data added to Firestore');
  // } catch (error) {
  //   console.error('Error adding teachers data to Firestore:', error);
  // }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
};

export default mockTeachersData;
