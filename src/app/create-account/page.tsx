'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function CreateAccount() {
  const router = useRouter();
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrors({
          name: '',
          email: 'E-mail inválido',
          password: '',
          confirmPassword: ''
        });
        return;
      }

      // Validate password strength (at least 6 characters)
      if (formData.password.length < 6) {
        setErrors({
          name: '',
          email: '',
          password: 'Senha deve ter no mínimo 6 caracteres',
          confirmPassword: ''
        });
        return;
      }

      // Create user in Firebase
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Store additional user data (name) in Firebase
      // This would typically be stored in Firestore or Realtime Database
      // For now, we'll just redirect to login
      router.push('/');
    } catch (error: any) {
      console.error('Account creation error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setErrors({
          name: '',
          email: 'E-mail já cadastrado',
          password: '',
          confirmPassword: ''
        });
      } else {
        setErrors({
          name: '',
          email: '',
          password: 'Erro ao criar conta',
          confirmPassword: ''
        });
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[var(--primary)] p-4 lg:bg-[url('/images/background-login.png')] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:justify-end lg:pr-16">
      <div className="relative flex h-[50rem] w-[60rem] shrink-0 overflow-hidden rounded-xl border-2 border-white/20">
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

        {/* Right side with form */}
        <div className="relative w-[40rem] bg-white px-12 py-6 lg:px-16 lg:py-8">
          <div className="space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-[var(--primary)]">
                Criar Conta
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button type="submit">
                Criar Conta
              </Button>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>
                  Já tem uma conta?{' '}
                  <Link href="/" className="text-[var(--primary)] hover:text-[var(--primary-dark)]">
                    Faça login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
