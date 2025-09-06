import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { LayoutProps } from '@/types';

const Layout = ({ children, title }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Barra lateral */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Contenido principal */}
      <div className='flex-1 flex flex-col lg:ml-80'>
        {/* Encabezado */}
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

        {/* Contenido */}
        <main className='flex-1 bg-gray-50 p-6'>{children}</main>
      </div>
    </div>
  );
};

export { Layout };
