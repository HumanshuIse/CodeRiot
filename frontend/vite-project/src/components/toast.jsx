
// // import React from 'react';
// // import { CheckCircle, AlertCircle, X } from 'lucide-react';

// // const Toast = ({ message, type, onClose, duration = 3000 }) => {
// //   // Automatically close the toast after 'duration' milliseconds
// //   React.useEffect(() => {
// //     const timer = setTimeout(() => {
// //       onClose();
// //     }, duration);
// //     // Cleanup the timer if the component unmounts or duration/onClose changes
// //     return () => clearTimeout(timer);
// //   }, [onClose, duration]);

// //   return (
// //     <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
// //       type === 'success'
// //         ? 'bg-gray-800 text-white border-l-4 border-green-500'
// //         : 'bg-gray-800 text-white border-l-4 border-red-500'
// //     }`}>
// //       {type === 'success' ? (
// //         <CheckCircle className="w-5 h-5 text-green-500" />
// //       ) : (
// //         <AlertCircle className="w-5 h-5 text-red-500" />
// //       )}
// //       <span className="font-medium">{message}</span>
// //       <button
// //         onClick={onClose}
// //         className="ml-2 hover:bg-gray-700 rounded-full p-1 transition-colors text-gray-400"
// //       >
// //         <X className="w-4 h-4" />
// //       </button>
// //     </div>
// //   );
// // };

// // export default Toast;
// // src/components/Toast.jsx
// import React from 'react';
// import { CheckCircle, AlertCircle, X } from 'lucide-react';

// const Toast = ({ message, type, onClose, duration = 3000 }) => {
//   React.useEffect(() => {
//     const timer = setTimeout(() => {
//       onClose();
//     }, duration);
//     return () => clearTimeout(timer);
//   }, [onClose, duration]);

//   // NOTE: The parent component is now responsible for positioning.
//   // This makes the Toast component more reusable.
//   return (
//     <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in-down ${
//       type === 'success'
//         ? 'bg-gray-800 text-white border-l-4 border-green-500'
//         : 'bg-gray-800 text-white border-l-4 border-red-500'
//     }`}>
//       {type === 'success' ? (
//         <CheckCircle className="w-5 h-5 text-green-500" />
//       ) : (
//         <AlertCircle className="w-5 h-5 text-red-500" />
//       )}
//       <span className="font-medium">{message}</span>
//       <button
//         onClick={onClose}
//         className="ml-2 hover:bg-gray-700 rounded-full p-1 transition-colors text-gray-400"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// export default Toast;
// src/components/Toast.jsx
import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-fade-in-down ${
      type === 'success'
        ? 'bg-gray-800 text-white border-l-4 border-green-500'
        : 'bg-gray-800 text-white border-l-4 border-red-500'
    }`}>
      {type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:bg-gray-700 rounded-full p-1 transition-colors text-gray-400"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;