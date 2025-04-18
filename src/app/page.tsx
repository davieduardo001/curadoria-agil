'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import Toast from '@/components/Toast';
import EmailNotFoundToast from '@/components/EmailNotFoundToast';
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [rememberedUser, setRememberedUser] = useLocalStorage('rememberedUser', null);

  useEffect(() => {
    if (rememberedUser) {
      const userData = rememberedUser;
      // Only use stored credentials if they are less than 7 days old
      if (Date.now() - userData.timestamp < 7 * 24 * 60 * 60 * 1000) {
        setEmail(userData.email);
        setPassword(userData.password);
        setRemember(true);
      }
    }
  }, [rememberedUser]);

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [showEmailNotFoundToast, setShowEmailNotFoundToast] = useState(false);

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

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrors({
          email: 'E-mail inválido',
          password: ''
        });
        return;
      }

      // Sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // If remember is checked, store credentials
      if (remember) {
        setRememberedUser({
          email,
          password,
          timestamp: Date.now()
        });
      } else {
        setRememberedUser(null);
      }

      router.push('/home');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase Auth errors
      if (error.code === 'auth/user-not-found') {
        setShowEmailNotFoundToast(true);
      } else if (error.code === 'auth/wrong-password') {
        setToastMessage('Senha incorreta');
        setToastType('error');
        setShowToast(true);
      } else if (error.code === 'auth/invalid-email') {
        setToastMessage('E-mail inválido');
        setToastType('error');
        setShowToast(true);
      } else if (error.code === 'auth/invalid-credential') {
        setToastMessage('Credenciais inválidas');
        setToastType('error');
        setShowToast(true);
      } else {
        setToastMessage('Erro ao fazer login: ' + error.message);
        setToastType('error');
        setShowToast(true);
      }

      // Refresh the page after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  return (
    <>
      {showEmailNotFoundToast && (
        <EmailNotFoundToast
          email={email}
          duration={5000}
        />
      )}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
        />
      )}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Lembrar de mim
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                >
                  Entrar
                </Button>

                <div className="text-center">
                  <Link
                    href="/create-account"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Não tem uma conta? Cadastre-se
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
