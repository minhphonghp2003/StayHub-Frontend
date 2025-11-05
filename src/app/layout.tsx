import { Outfit, Roboto, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import StoreProvider from '@/context/StoreContext';
import { ToastContainer } from 'react-toastify';
// TODO set current user, Logo, brand, slogan, favicon
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'], // Include both for broader support
  weight: ['400', '700'], // Specify desired weights
  variable: '--font-be-vietnam-pro', // Optional: for use with Tailwind CSS
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en antialiased ">
      <body className={`${beVietnamPro.className} dark:bg-gray-900`}>
        <StoreProvider>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </StoreProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
