import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useUserRole } from '../lib/hooks/useUserRole';
import Link from 'next/link';
import { DollarSign, Users, BarChart3, ArrowRight } from 'lucide-react';
import type { NavigationCard } from '../types';

// Tipo para los iconos de Lucide React
type LucideIcon = React.ComponentType<{ className?: string }>;

const Home = () => {
  const { isAdmin } = useUserRole();

  const navigationCards: NavigationCard[] = [
    {
      title: 'Ingresos y Egresos',
      description:
        'Registra y gestiona todos tus movimientos financieros de manera organizada',
      href: '/movimientos',
      icon: DollarSign as LucideIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgPattern: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      available: true,
    },
    {
      title: 'Usuarios',
      description: 'Gestiona usuarios, roles y permisos del sistema',
      href: '/usuarios',
      icon: Users as LucideIcon,
      gradient: 'from-violet-500 to-purple-600',
      bgPattern: 'bg-violet-50',
      iconColor: 'text-violet-600',
      available: isAdmin,
    },
    {
      title: 'Reportes',
      description: 'Visualiza reportes detallados y análisis financieros',
      href: '/reportes',
      icon: BarChart3 as LucideIcon,
      gradient: 'from-amber-500 to-orange-600',
      bgPattern: 'bg-amber-50',
      iconColor: 'text-amber-600',
      available: isAdmin,
    },
  ];

  return (
    <ProtectedRoute>
      <Layout title=''>
        <div className='bg-gray-900 rounded-lg pb-4'>
          <div className='space-y-8 p-6'>
            <div>
              <img
                src='https://www.prevalentware.com/wp-content/uploads/2024/07/logo-prevalentware.png'
                alt='PrevalentWare'
                className=' mx-auto'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'>
              {navigationCards.map((card) => {
                const IconComponent = card.icon;
                const isDisabled = !card.available;

                return (
                  <div
                    key={card.title}
                    className={`group bg-white border border-gray-200 relative overflow-hidden rounded-2xl transition-all duration-300 ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    {card.available ? (
                      <Link href={card.href} className='block h-full'>
                        <div
                          className={`h-full bg-white/90 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-lg transition-all duration-300`}
                        >
                          <div
                            className={`absolute inset-0 ${card.bgPattern} opacity-30`}
                          />

                          <div className='relative p-8 py-4 h-full flex flex-col'>
                            <div
                              className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                              <IconComponent className='w-8 h-8 text-white' />
                            </div>

                            <div className='flex-1'>
                              <h3 className='text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors'>
                                {card.title}
                              </h3>
                              <p className='text-gray-600 text-sm leading-relaxed mb-6'>
                                {card.description}
                              </p>
                            </div>

                            <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                              <span className='text-sm font-medium text-gray-500'>
                                Acceder
                              </span>
                              <ArrowRight
                                className={`w-5 h-5 ${card.iconColor} group-hover:translate-x-1 transition-transform duration-300`}
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <div className='h-full bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-center'>
                        <div className='w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-4'>
                          <IconComponent className='w-8 h-8 text-gray-400' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-400 mb-2'>
                          {card.title}
                        </h3>
                        <div className='px-4 py-2 bg-gray-100 rounded-full'>
                          <span className='text-xs font-medium text-gray-500'>
                            Solo administradores
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Home;
