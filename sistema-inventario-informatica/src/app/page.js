"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la página de login
    router.push('/login');
  }, []);

  return null;
}