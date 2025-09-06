import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import RoleGuard from '../../components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { useGet } from '@/lib/hooks/useApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatCurrency } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: string;
  user: {
    name: string;
  };
  index: number;
}

interface ReportData {
  balance: number;
  chartData: Movement[];
  statistics: {
    totalIncome: number;
    totalExpense: number;
    movementCount: number;
  };
  movements: any[];
}

const ReportesPage = () => {
  const {
    data: reportData,
    isLoading,
    error,
  } = useGet<ReportData>('/api/reportes', {
    immediate: true,
  });

  const [isDownloading, setIsDownloading] = useState(false);

  //  descargar CSV
  const downloadCSV = () => {
    if (!reportData) return;

    setIsDownloading(true);

    try {
      // Preparar datos para CSV
      const csvData = reportData.movements.map((movement) => ({
        Fecha: new Date(movement.date).toLocaleDateString('es-ES'),
        Concepto: movement.concept,
        Tipo: movement.type === 'INCOME' ? 'Ingreso' : 'Egreso',
        Monto: movement.amount,
        Usuario: movement.user.name,
      }));

      // Crear contenido CSV
      const headers = ['Fecha', 'Concepto', 'Tipo', 'Monto', 'Usuario'];
      const csvContent = [
        headers.join(','),
        ...csvData.map((row) =>
          headers
            .map((header) => `"${row[header as keyof typeof row]}"`)
            .join(',')
        ),
      ].join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `reporte-movimientos-${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Reportes'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>Cargando reportes...</div>
              </div>
            </div>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Reportes'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex flex-col justify-center items-center h-64 space-y-4'>
                <div className='text-red-500 text-center'>
                  <div className='font-semibold'>Error al cargar reportes</div>
                  <div className='text-sm mt-2'>{error}</div>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Reintentar
                </button>
              </div>
            </div>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  if (!reportData) {
    return (
      <ProtectedRoute>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Layout title='Reportes'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex justify-center items-center h-64'>
                <div className='text-gray-500'>No hay datos disponibles</div>
              </div>
            </div>
          </Layout>
        </RoleGuard>
      </ProtectedRoute>
    );
  }

  // Preparar datos para el gráfico
  const chartData = {
    labels: reportData.chartData.map((m) => m.concept),
    datasets: [
      {
        label: 'Movimientos',
        data: reportData.chartData.map((m) => m.amount),
        backgroundColor: reportData.chartData.map(
          (m) => (m.type === 'INCOME' ? '#10B981' : '#EF4444') // Verde para ingresos, rojo para egresos
        ),
        borderColor: reportData.chartData.map((m) =>
          m.type === 'INCOME' ? '#059669' : '#DC2626'
        ),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: any) {
            const movement = reportData.chartData[context.dataIndex];
            return [
              `Concepto: ${movement.concept}`,
              `Monto: ${formatCurrency(Math.abs(movement.amount))}`,
              `Tipo: ${movement.type === 'INCOME' ? 'Ingreso' : 'Egreso'}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 0,
        borderSkipped: false,
      },
    },
  };

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN']}>
        <Layout title='Reportes'>
          <div className='space-y-6'>
            {/* Header */}
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <div className='flex justify-between items-center'>
                <div>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                    Reportes Financieros
                  </h2>
                  <p className='text-gray-600'>
                    Análisis de movimientos y saldo actual
                  </p>
                </div>
                <Button
                  onClick={downloadCSV}
                  disabled={isDownloading}
                  className='bg-green-600 hover:bg-green-700 text-white'
                >
                  {isDownloading ? (
                    <>
                      <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        fill='none'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                      </svg>
                      Descargando...
                    </>
                  ) : (
                    <>
                      <svg
                        className='w-4 h-4 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                        />
                      </svg>
                      Descargar CSV
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Movimientos
                </h3>
                <div className='h-80'>
                  {reportData.chartData.length === 0 ? (
                    <div className='flex items-center justify-center h-full text-gray-500'>
                      No hay movimientos para mostrar
                    </div>
                  ) : (
                    <Bar data={chartData} options={chartOptions} />
                  )}
                </div>
              </div>

              <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Saldo
                </h3>
                <div className='space-y-6'>
                  <div className='text-center'>
                    <div
                      className={`text-4xl font-bold ${
                        reportData.balance >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(reportData.balance)}
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>Saldo Actual</p>
                  </div>

                  <div className='space-y-4'>
                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                      <span className='text-sm font-medium text-gray-600'>
                        Total Ingresos
                      </span>
                      <span className='text-sm font-semibold text-green-600'>
                        {formatCurrency(reportData.statistics.totalIncome)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                      <span className='text-sm font-medium text-gray-600'>
                        Total Egresos
                      </span>
                      <span className='text-sm font-semibold text-red-600'>
                        {formatCurrency(reportData.statistics.totalExpense)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center py-2'>
                      <span className='text-sm font-medium text-gray-600'>
                        Total Movimientos
                      </span>
                      <span className='text-sm font-semibold text-gray-800'>
                        {reportData.statistics.movementCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Movimientos Recientes
              </h3>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Fecha
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Concepto
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Tipo
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Monto
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Usuario
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {reportData.movements.slice(0, 10).map((movement) => (
                      <tr key={movement.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(movement.date).toLocaleDateString('es-ES')}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {movement.concept}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              movement.type === 'INCOME'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {movement.type === 'INCOME' ? 'Ingreso' : 'Egreso'}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                            movement.type === 'INCOME'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {movement.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(movement.amount)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {movement.user.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Layout>
      </RoleGuard>
    </ProtectedRoute>
  );
};

export default ReportesPage;
