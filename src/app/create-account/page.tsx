'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FormInput from '@/components/FormInput';

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      name: formData.name ? '' : 'Campo Obrigatório, preencha-o',
      email: formData.email ? '' : 'Campo Obrigatório, preencha-o',
      password: formData.password ? '' : 'Campo Obrigatório, preencha-o',
      confirmPassword: formData.password === formData.confirmPassword ? '' : 'As senhas não coincidem'
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    // Here you would typically make an API call to create the account
    // For now, we'll just redirect to login
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
          <div className="relative w-full max-w-md p-8 pb-12">
            {/* Add top margin to form to prevent logo overlap */}
            <form onSubmit={handleSubmit} className="mt-16 space-y-6">
              <FormInput
                type="text"
                id="name"
                name="name"
                label="Nome Completo"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Digite seu nome completo"
                required
              />

              <FormInput
                type="email"
                id="email"
                name="email"
                label="E-mail"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Digite seu e-mail"
                required
              />

              <FormInput
                type="password"
                id="password"
                name="password"
                label="Senha"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Digite sua senha"
                required
              />

              <FormInput
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Confirme sua senha"
                required
              />

              <button
                type="submit"
                className="w-full rounded-sm bg-[var(--primary)] py-3 text-center text-base font-medium text-white hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                Criar Conta
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Já tem uma conta?{' '}
                <Link href="/" className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
