import { useEffect } from 'react';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const Toast = ({ 
  isVisible, 
  message, 
  type = 'success', 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600';
  const Icon = type === 'success' ? IoCheckmarkCircleOutline : IoCloseCircleOutline;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${bgColor} ${borderColor} shadow-lg max-w-sm`}>
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        <p className={`text-sm font-medium ${textColor}`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-auto ${textColor} hover:opacity-70 transition-opacity`}
        >
          <IoCloseCircleOutline className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
