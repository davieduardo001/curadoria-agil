'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/FormInput';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      email: email ? '' : 'E-mail obrigatório!',
      password: password ? '' : 'Senha obrigatória!'
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    // Here you would typically make an API call to authenticate the user
    // For now, we'll just simulate a successful login
    // Here you would typically make an API call to authenticate the user
    // For now, we'll just simulate a successful login
    router.push('/home');
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--primary)] p-4 lg:bg-[url('/images/background-login.png')] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:justify-end lg:pr-16">
      <div className="relative flex h-[34.3rem] w-[54.5rem] shrink-0 overflow-hidden rounded-xl border-2 border-white/20">
        {/* Left side with blur */}
        <div className="relative hidden w-1/3 items-center justify-center bg-white/10 backdrop-blur-md shadow-lg lg:flex before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-white/5 before:rounded-lg" />

        {/* Logo overlapping both sections */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 lg:left-[16%] lg:-translate-x-[20%]">
          <Image
            src="/images/system-logo.png"
            alt="SCA Logo"
            width={160}
            height={53}
            className="h-auto w-auto"
            priority
          />
        </div>

        {/* Right side - Form */}
        <div className="relative flex w-full items-center justify-center lg:w-2/3">
          {/* Form background */}
          <div className="absolute inset-0 bg-[url('/images/form-bg.png')] bg-cover bg-center bg-no-repeat" />
          
          {/* Form content */}
          <div className="relative w-full max-w-md p-8">
            {/* Add top margin to form to prevent logo overlap */}
            <form onSubmit={handleSubmit} className="mt-16 space-y-6">
              <FormInput
                type="email"
                id="email"
                label="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Digite seu e-mail"
                required
              />

              <FormInput
                type="password"
                id="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Digite sua senha"
                required
              />

              <button
                type="submit"
                className="w-full rounded-sm bg-[var(--primary)] py-3 text-center text-base font-medium text-white hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                Entrar
              </button>

              <div>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="text-sm text-gray-500">Lembrar-me</span>
              </div>
            </form>
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Não tem uma conta?{' '}
                <Link href="/create-account" className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                  Criar Conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
