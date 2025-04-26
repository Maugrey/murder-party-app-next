import React from 'react';
import { useRouter } from 'next/navigation';

interface NavigationButtonProps {
  to: string;
  children: React.ReactNode;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({ to, children }) => {
  const router = useRouter();
  return (
    <button 
      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition" 
      onClick={() => router.push(to)}
    >
      {children}
    </button>
  );
};

export default NavigationButton;