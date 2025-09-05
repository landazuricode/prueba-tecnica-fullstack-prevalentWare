import { ChevronRight, Github } from 'lucide-react';

const LoginPage = () => {
  const handleGitHubLogin = () => {
    alert('Proximamente...');
  };

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <img
            src='https://www.prevalentware.com/wp-content/uploads/2024/07/logo-prevalentware.png'
            alt='PrevalentWare'
            className=' mx-auto'
          />
          <p className='mt-6 text-lg text-gray-300'></p>
        </div>

        <div className='bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700'>
          <button
            onClick={handleGitHubLogin}
            className='w-full flex items-center justify-center space-x-3 py-4 px-6 bg-gray-900 hover:bg-gray-700 border border-gray-600 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg group'
          >
            <Github className='w-6 h-6' />
            <span className='text-lg'>Continuar con GitHub</span>
            <ChevronRight className='w-6 h-6 group-hover:translate-x-1 transition-transform text-gray-500 group-hover:text-white  duration-200' />
          </button>

          <div className='mt-8 flex items-center'>
            <div className='flex-1 border-t border-gray-600'></div>
            <span className='px-4 text-sm text-gray-400'>o</span>
            <div className='flex-1 border-t border-gray-600'></div>
          </div>

          <div className='mt-8 p-6 bg-gray-700 rounded-xl text-center border border-gray-600'>
            <div className='flex items-center justify-center mb-3'>
              <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center'>
                <span className='text-white text-xl animate-wave origin-[70%_70%]'>
                  👋
                </span>
              </div>
            </div>
            <p className='text-gray-200 text-lg font-medium mb-2'>
              Bienvenido, inicia sesión con tu cuenta de GitHub! 🔐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
