'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ContractPage() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [contract, setContract] = useState<any>(null);
  const [loadingContract, setLoadingContract] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const docRef = doc(db, 'contratos', id as string);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContract(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching contract:', error);
      } finally {
        setLoadingContract(false);
      }
    };

    fetchContract();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-left">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-500 rounded-lg"></div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Bem vindo ao Contrato: {loadingContract ? 'Carregando...' : contract?.title}</h1>
                <p className="mt-4 text-gray-600">Gerencie e refine suas atividades com agilidade. Explore as opções e mantenha o fluxo de trabalho sempre otimizado!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
