// import React from 'react';
// import { LayoutDashboard, BookOpen, FileText, LineChart, UserCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const tabs = [
//   { name: 'Dashboard', icon: <LayoutDashboard />, color: '#F0DD63', path: '/dashboard' },
//   { name: 'My Bookings', icon: <BookOpen />, color: '#D1DC80', path: '/my-bookings' },
//   { name: 'Accounts', icon: <FileText />, color: '#E0959A', path: '/accounts' },
//   { name: 'Sales', icon: <LineChart />, color: '#BE94C3', path: '/sales' },
//   { name: 'User Management', icon: <UserCircle />, color: '#ACA171', path: '/user-management' },
//   { name: 'My Profile', icon: <UserCircle />, color: '#DCA171', path: '/my-profile' },
// ];

// const DashboardHeader = () => {
//   const navigate = useNavigate();

//   const navigateTo = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="flex justify-around items-center p-2 md:flex-row flex-col md:ml-[100px] md:mr-[100px] lg:ml-[300px] lg:mr-[300px]">
//       {tabs.map((tab) => (
//         <div
//           key={tab.name}
//           className="flex flex-col items-center cursor-pointer text-center text-gray-800 hover:text-black transition-colors"
//           onClick={() => navigateTo(tab.path)}
//         >
//           <div
//             className="w-16 h-16 rounded-full flex items-center justify-center mb-0.5"
//             style={{ backgroundColor: tab.color }}
//           >
//             <span className="text-white text-2xl">{tab.icon}</span>
//           </div>
//           <span className="text-sm font-medium">{tab.name}</span>
//         </div>
        
//       ))}
//     </div>
//   );
// };

// export default DashboardHeader;

// import React from 'react';
// import { LayoutDashboard, BookOpen, FileText, LineChart, UserCircle, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const tabs = [
//   { name: 'Back', icon: <ArrowLeft />, color: '#B0BEC5', path: '/' },
//   { name: 'Dashboard', icon: <LayoutDashboard />, color: '#F0DD63', path: '/dashboard' },
//   { name: 'My Bookings', icon: <BookOpen />, color: '#D1DC80', path: '/my-bookings' },
//   { name: 'Accounts', icon: <FileText />, color: '#E0959A', path: '/accounts' },
//   { name: 'Sales', icon: <LineChart />, color: '#BE94C3', path: '/sales' },
//   { name: 'User Management', icon: <UserCircle />, color: '#ACA171', path: '/user-management' },
//   { name: 'My Profile', icon: <UserCircle />, color: '#DCA171', path: '/my-profile' },
// ];

// const DashboardHeader = () => {
//   const navigate = useNavigate();

//   const navigateTo = (path) => {
//     navigate(path);
//   };

//   return (
//     <div className="flex justify-around items-center p-2 md:flex-row flex-col md:ml-[100px] md:mr-[100px] lg:ml-[300px] lg:mr-[300px]">
//       {tabs.map((tab) => (
//         <div
//           key={tab.name}
//           className="flex flex-col items-center cursor-pointer text-center text-gray-800 hover:text-black transition-colors"
//           onClick={() => navigateTo(tab.path)}
//         >
//           <div
//             className="w-16 h-16 rounded-full flex items-center justify-center mb-0.5"
//             style={{ backgroundColor: tab.color }}
//           >
//             <span className="text-white text-2xl">{tab.icon}</span>
//           </div>
//           <span className="text-sm font-medium">{tab.name}</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DashboardHeader;


import React from 'react';
import { LayoutDashboard, BookOpen, FileText, LineChart, UserCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { name: 'Back', icon: <ArrowLeft />, color: '#B0BEC5', path: '/', permissionName: null },
  { name: 'Dashboard', icon: <LayoutDashboard />, color: '#F0DD63', path: '/dashboard', permissionName: 'Dashboard' },
  { name: 'My Bookings', icon: <BookOpen />, color: '#D1DC80', path: '/my-bookings', permissionName: 'My Bookings' },
  { name: 'Accounts', icon: <FileText />, color: '#E0959A', path: '/accounts', permissionName: 'Accounts' },
  { name: 'Sales', icon: <LineChart />, color: '#BE94C3', path: '/sales', permissionName: 'Sales' },
  { name: 'User Management', icon: <UserCircle />, color: '#ACA171', path: '/user-management', permissionName: 'User Management' },
  { name: 'My Profile', icon: <UserCircle />, color: '#DCA171', path: '/my-profile', permissionName: 'My Profile' },
];

const DashboardHeader = () => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const permissions = authData?.userType === 'subvendor'
    ? JSON.parse(localStorage.getItem('subvendor_permissions') || '[]')
    : [];

  const filteredTabs = authData?.userType === 'subvendor'
    ? tabs.filter(tab => {
        if (tab.name === 'Back') return true; // Always show Back
        if (tab.name === 'User Management') return false; // Subvendors can't access User Management
        const perm = permissions.find(p => p.name === tab.permissionName);
        return perm && (perm.can_view || perm.can_manage);
      })
    : tabs;

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="flex justify-around items-center p-2 md:flex-row flex-col md:ml-[100px] md:mr-[100px] lg:ml-[300px] lg:mr-[300px]">
      {filteredTabs.map((tab) => (
        <div
          key={tab.name}
          className="flex flex-col items-center cursor-pointer text-center text-gray-800 hover:text-black transition-colors"
          onClick={() => navigateTo(tab.path)}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-0.5"
            style={{ backgroundColor: tab.color }}
          >
            <span className="text-white text-2xl">{tab.icon}</span>
          </div>
          <span className="text-sm font-medium">{tab.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DashboardHeader;