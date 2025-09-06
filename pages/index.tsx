import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useUserRole } from '@/lib/hooks/useUserRole';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  Users,
  BarChart3,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import type { NavigationCard } from '@/types';

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
        <div className='space-y-8'>
          {/* Header con logo */}
          <Card className='bg-gradient-to-r from-slate-900 to-slate-800 border-0'>
            <CardContent className='flex justify-center py-8'>
              <Image
                src='https://www.prevalentware.com/wp-content/uploads/2024/07/logo-prevalentware.png'
                alt='PrevalentWare'
                width={200}
                height={64}
                className='h-16 w-auto'
                priority
              />
            </CardContent>
          </Card>

          {/* Tarjetas de navegación */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {navigationCards.map((card) => {
              const IconComponent = card.icon;
              const isDisabled = !card.available;

              return (
                <Card
                  key={card.title}
                  className={`group transition-all duration-300 hover:shadow-lg ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer '
                  }`}
                >
                  {card.available ? (
                    <Link href={card.href} className='block h-full'>
                      <CardHeader className='pb-4'>
                        <div className='flex items-center space-x-4'>
                          <div
                            className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className='w-6 h-6 text-white' />
                          </div>
                          <div className='flex-1'>
                            <CardTitle className='text-lg group-hover:text-primary transition-colors'>
                              {card.title}
                            </CardTitle>
                          </div>
                          <ArrowRight className='w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform duration-300' />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className='text-sm leading-relaxed'>
                          {card.description}
                        </CardDescription>
                        <div className='mt-4 flex items-center justify-between'>
                          <Badge variant='secondary' className='text-xs'>
                            Disponible
                          </Badge>
                          <span className='text-xs text-muted-foreground'>
                            Hacer clic para acceder
                          </span>
                        </div>
                      </CardContent>
                    </Link>
                  ) : (
                    <>
                      <CardHeader className='pb-4'>
                        <div className='flex items-center space-x-4'>
                          <div className='w-12 h-12 bg-muted rounded-lg flex items-center justify-center'>
                            <IconComponent className='w-6 h-6 text-muted-foreground' />
                          </div>
                          <div className='flex-1'>
                            <CardTitle className='text-lg text-muted-foreground'>
                              {card.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className='text-sm text-muted-foreground'>
                          {card.description}
                        </CardDescription>
                        <div className='mt-4'>
                          <Badge variant='outline' className='text-xs'>
                            <UserCheck className='w-3 h-3 mr-1' />
                            Solo administradores
                          </Badge>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Home;
