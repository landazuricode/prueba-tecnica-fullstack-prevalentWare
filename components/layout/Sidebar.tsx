import {
  BarChart,
  DollarSign,
  Home,
  Users,
  User,
  ChevronRight,
  LogOut,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { authClient } from '../../lib/auth/client';
import { useUserRole } from '../../lib/hooks/useUserRole';
import type { SidebarProps, MenuItem } from '../../types';

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const router = useRouter();
  const { isAdmin } = useUserRole();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      // Forzar recarga de la página para limpiar el estado
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Si hay error, redirigir de todas formas
      window.location.href = '/login';
    }
  };

  // Menú base que todos pueden ver
  const baseMenuItems: MenuItem[] = [
    {
      href: '/',
      label: 'Inicio',
      icon: <Home size={22} />,
      section: 'Principal',
    },
    {
      href: '/movimientos',
      label: 'Ingresos y Egresos',
      icon: <DollarSign size={22} />,
      section: 'Utilidades',
    },
    {
      href: '/docs',
      target: '_blank',
      label: 'Documentación API',
      icon: <BookOpen size={22} />,
      section: 'Utilidades',
    },
  ];

  // Menú solo para administradores
  const adminMenuItems: MenuItem[] = [
    {
      href: '/usuarios',
      label: 'Usuarios',
      icon: <Users size={22} />,
      section: 'Administración',
    },
    {
      href: '/reportes',
      label: 'Reportes',
      icon: <BarChart size={22} />,
      section: 'Administración',
    },
  ];

  // Combinar menús según el rol
  const menuItems = isAdmin
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  const groupedItems = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = [];
      }
      acc[item.section]?.push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 h-screen ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gray-900
        shadow-2xl
      `}
      >
        <div className='flex flex-col h-full'>
          <div className='px-6 py-3 border-b border-gray-700'>
            <div
              onClick={() =>
                window.open('https://www.prevalentware.com/es/', '_blank')
              }
              className='bg-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-700 rounded-lg p-2 text-white font-medium text-sm uppercase text-center flex items-center justify-center gap-2'
            >
              <span>prevalentWare</span>
              <ExternalLink size={22} />
            </div>
          </div>

          {/* Navegación */}
          <nav className='flex-1 p-6 space-y-6'>
            {Object.entries(groupedItems).map(([section, items]) => (
              <div key={section}>
                <h3 className='text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3'>
                  {section}
                </h3>
                <div className='space-y-1'>
                  {items.map((item) => {
                    const isActive = router.pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        target={item?.target || '_self'}
                        className={`
                          group flex items-center justify-between p-3 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                          }
                        `}
                      >
                        <div className='flex items-center space-x-3'>
                          <span className='text-lg'>{item.icon}</span>
                          <span className='text-sm font-medium'>
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight
                          size={22}
                          color={isActive ? 'white' : '#787F8C'}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className='pt-6 border-t border-gray-700'>
              <h3 className='text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3'>
                Usuario
              </h3>
              <div className='space-y-1'>
                <Link
                  href='/mi-cuenta'
                  className='group flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>{<User size={22} />}</span>
                    <span className='text-sm font-medium'>Mi cuenta</span>
                  </div>
                  <ChevronRight size={22} color='#787F8C' />
                </Link>
                <button
                  onClick={handleLogout}
                  className='group flex items-center justify-between p-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 w-full text-left'
                >
                  <div className='flex items-center space-x-3'>
                    <span className='text-lg'>{<LogOut size={22} />}</span>
                    <span className='text-sm font-medium'>Cerrar sesión</span>
                  </div>
                  <ChevronRight size={22} color='#787F8C' />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
