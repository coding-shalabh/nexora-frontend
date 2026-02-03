'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

export default function AuthLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <Image
            src="/logo.png"
            alt="Nexora"
            width={180}
            height={48}
            className="h-12 w-auto mx-auto"
            priority
          />
          <p className="text-muted-foreground mt-3">Omni-Channel Business OS</p>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <div key={pathname}>{children}</div>
        </AnimatePresence>
      </div>
    </div>
  );
}
