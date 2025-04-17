import Image from 'next/image';
import Link from 'next/link';

export default function CreateAccount() {
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
            <form className="mt-16 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-[var(--primary)]">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-sm border-2 border-[var(--primary)] bg-white py-2.5 pl-3 text-[var(--primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-[var(--primary)]">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-sm border-2 border-[var(--primary)] bg-white py-2.5 pl-3 text-[var(--primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="Digite seu e-mail"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-[var(--primary)]">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full rounded-sm border-2 border-[var(--primary)] bg-white py-2.5 pl-3 text-[var(--primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="Digite sua senha"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--primary)]">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full rounded-sm border-2 border-[var(--primary)] bg-white py-2.5 pl-3 text-[var(--primary)] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  placeholder="Confirme sua senha"
                />
              </div>

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
