import { Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header = ({ title, onMenuClick }: HeaderProps) => {
  return (
    <header className='px-6 py-4'>
      <div className='flex items-center justify-between md:justify-center w-full'>
        <div>
          <h1 className='text-center text-2xl uppercase font-bold text-gray-800'>
            Sistema de gestión de ingresos y gastos
          </h1>
        </div>
        <button
          onClick={onMenuClick}
          className='lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        >
          <Menu size={22} />
        </button>
      </div>
      <br />
      <br />
      <div className='flex'>
        <h2 className='text-center uppercase underline underline-offset-4 text-lg font-semibold text-gray-800'>
          {title}
        </h2>
      </div>
    </header>
  );
};

export default Header;
