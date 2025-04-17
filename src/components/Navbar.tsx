"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="flex items-center justify-center h-16">Carregando...</div>;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="w-[1302px] mx-auto">
      <nav className="bg-[#092C34] rounded-lg shadow-lg relative top-2">
        <div className="h-[101px] flex-shrink-0">
          <div className="flex justify-between h-full items-center px-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-white">HOME</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
