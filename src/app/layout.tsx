import { Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'], // Choose the weights you want
  variable: '--font-lato',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
