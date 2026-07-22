'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Shield, User, Globe, Menu, X } from 'lucide-react';

export function Navbar() {
  const [lang, setLang] = useState<'RU' | 'EN'>('RU');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-gold-400 animate-pulse" />
          <span className="text-2xl font-black tracking-wider gold-text">TURNIR</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-gold-400 transition-colors">Главная</Link>
          <Link href="/tournaments" className="hover:text-gold-400 transition-colors">Турниры</Link>
          <Link href="/rules" className="hover:text-gold-400 transition-colors">Правила</Link>
          <Link href="/verification" className="hover:text-gold-400 transition-colors">Проверка</Link>
          <Link href="/contacts" className="hover:text-gold-400 transition-colors">Контакты</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={() => setLang(lang === 'RU' ? 'EN' : 'RU')}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-surface border border-white/10 text-xs font-bold hover:border-gold-400 transition-all"
          >
            <Globe className="w-4 h-4 text-gold-400" />
            <span>{lang}</span>
          </button>

          <Link href="/profile" className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-lg transition-all shadow-orange-glow">
            <User className="w-4 h-4" />
            <span>Профиль</span>
          </Link>
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel px-4 pt-2 pb-6 space-y-3">
          <Link href="/" className="block py-2 hover:text-gold-400">Главная</Link>
          <Link href="/tournaments" className="block py-2 hover:text-gold-400">Турниры</Link>
          <Link href="/rules" className="block py-2 hover:text-gold-400">Правила</Link>
          <Link href="/verification" className="block py-2 hover:text-gold-400">Проверка</Link>
          <Link href="/profile" className="block py-2 text-gold-400 font-bold">Профиль</Link>
        </div>
      )}
    </nav>
  );
}