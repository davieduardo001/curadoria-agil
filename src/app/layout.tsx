import { Lato } from "next/font/google";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
