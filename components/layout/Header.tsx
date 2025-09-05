import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

const Header = ({ title, subtitle, onMenuClick }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      Ejemplo
    </header>
  );
};

export default Header;
