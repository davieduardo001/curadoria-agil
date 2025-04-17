import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Container */}
      <div className="w-[1302px] mx-auto">
        {/* Navbar */}
        <nav className="bg-[#092C34] rounded-lg shadow-lg relative top-2">
          <div className="h-[101px] flex-shrink-0">
            <div className="flex justify-between h-full items-center px-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-white">HOME</span>
                </div>
              </div>
              
              {/* Profile Dropdown */}

            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">HOME</h1>
            <p className="mt-4 text-gray-600">Bem-vindo à sua página inicial</p>
          </div>
        </div>
      </main>
    </div>
  );
}
