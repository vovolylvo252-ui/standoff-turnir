"use client";

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import Logo from '../components/Logo';
import { 
  Trophy, Send, AlertTriangle, BookOpen, User, X, CheckCircle2, 
  Swords, Maximize2, Edit3, LogOut, Upload, Shield, Award, Bell,
  Tv, HelpCircle, Users, Flame, MapPin, Clock, ChevronDown, ChevronUp,
  Headphones, MessageCircle, Share2, MessageSquareText, Camera,
  Mic, Ban, Check, Sparkles, ExternalLink, History, ShieldCheck, Lock, Coins,
  Gift, Dices, RotateCw, Zap, CreditCard, ArrowDownRight, Plus
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  kills: number;
  deaths: number;
  wins: number;
  matches: number;
  rank: string;
  clan: string;
  goldBalance?: number;
  isCheckedIn?: boolean;
  isVerified?: boolean;
}

interface MatchDetail {
  t1: string;
  t2: string;
  time: string;
  format: string;
  maps: string[];
}

interface WinHistoryItem {
  id: string;
  type: 'tournament' | 'wheel';
  title: string;
  reward: string;
  date: string;
}

// Интерфейс для бегущей строки онлайн-выигрышей
interface LiveWinItem {
  id: number;
  text: string;
  amount: string;
  timeAgo: string;
}

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });
  const [activeModal, setActiveModal] = useState<
    'register' | 'profile' | 'rules' | 'tournaments' | 'image' | 'faq' | 'teams' | 'match' | 'support' | 'hallOfFame' | 'report' | 'withdraw' | 'history' | null
  >(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchDetail | null>(null);

  // Стрим
  const [isStreamOpen, setIsStreamOpen] = useState(true);
  const [isStreamMinimized, setIsStreamMinimized] = useState(false);

  // БАЙТ-МОДАЛКА ПРИ ВХОДЕ (1000 голды + Колесо фортуны)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);
  const [welcomeRegId, setWelcomeRegId] = useState('');
  const [welcomeRegEmail, setWelcomeRegEmail] = useState('');
  const [isRegisteredFromWelcome, setIsRegisteredFromWelcome] = useState(false);

  // Состояние полноэкранного Колеса Фортуны
  const [isFullWheelOpen, setIsFullWheelOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<{ title: string; subtitle: string; isWin: boolean } | null>(null);

  // Состояние ленты онлайн-выигрышей
  const [liveWins, setLiveWins] = useState<LiveWinItem[]>([
    { id: 1, text: 'ShadowSniper выиграл', amount: '2 000 GOLD', timeAgo: 'только что' },
    { id: 2, text: 'СтандоффКинг сорвал куш', amount: '5 000 GOLD', timeAgo: '1 сек назад' },
    { id: 3, text: 'М9_Байонет_Бог получил приз', amount: '10 000 GOLD', timeAgo: '3 сек назад' },
  ]);

  // Эффект для генерации случайных выигрышей в реальном времени
  useEffect(() => {
    const randomNicks = [
      'Тень_СО2', 'FastKill_99', 'ПроИгрок_99', 'ShadowHunter', 'Бустер_Топ', 
      'StandoffGod', 'Вортекс', 'Нексус_9', 'AlphaWolf', 'КиберПсих', 
      'DeadInside', 'GoldSeeker', 'Местный_Тащер', 'Frostbite', 'Storm_22',
      'SniperElite', 'BlazeMaster', 'ViperX', 'Ghost_Rider', 'ApexPredator',
      'NeonRider', 'Titanium', 'ZeroCool', 'Phoenix_Fire', 'Nightmare',
      'CyberNinja', 'BulletProof', 'Phantom_SO2', 'Venom_99', 'Matrix_God',
      'Atomic_Bomb', 'BlackLotus', 'Chaos_Theory', 'Dark_Angel', 'Eternity',
      'Flash_Bang', 'Galaxy_Boy', 'Hell_Hound', 'Ice_Cube', 'Joker_Face',
      'Killer_Beast', 'Lightning', 'Mad_Max', 'Nova_Star', 'Omega_Point',
      'Quantum_Leap', 'Red_Bull', 'Silver_Bullet', 'Thunder_Strike', 'Underground',
      'Vortex_Flow', 'Wild_Card', 'Xenon_Ray', 'Yankee_D', 'Zodiac_Sign'
    ];
    
    const randomAmounts = ['1 000 GOLD', '2 000 GOLD', '5 000 GOLD', '10 000 GOLD', 'M9 Bayonet | Lore'];

    let timeoutId: NodeJS.Timeout;
    const recentNicks: string[] = [];

    const scheduleNextWin = () => {
      const intervalTime = Math.floor(Math.random() * 4000) + 1000;

      timeoutId = setTimeout(() => {
        const availableNicks = randomNicks.filter(nick => !recentNicks.includes(nick));
        const poolToUse = availableNicks.length > 0 ? availableNicks : randomNicks;
        const randomNick = poolToUse[Math.floor(Math.random() * poolToUse.length)];
        
        recentNicks.push(randomNick);
        if (recentNicks.length > 50) recentNicks.shift();

        const randomAmount = randomAmounts[Math.floor(Math.random() * randomAmounts.length)];
        const newItem: LiveWinItem = {
          id: Date.now(),
          text: `${randomNick} выиграл`,
          amount: randomAmount,
          timeAgo: 'только что'
        };

        setLiveWins((prev) => [newItem, ...prev.slice(0, 4)]);
        scheduleNextWin();
      }, intervalTime);
    };

    scheduleNextWin();
    return () => clearTimeout(timeoutId);
  }, []);

  // История выигрышей
  const [winHistory, setWinHistory] = useState<WinHistoryItem[]>([
    { id: '1', type: 'tournament', title: 'Стартовый турнир 5x5', reward: '500 GOLD', date: 'Вчера' },
    { id: '2', type: 'wheel', title: 'Колесо Фортуны', reward: '1 000 GOLD', date: 'Сегодня' }
  ]);

  // Состояние для добавления кастомного турнира верифицированным пользователем
  const [customWinTitle, setCustomWinTitle] = useState('');
  const [customWinReward, setCustomWinReward] = useState('');

  // Состояние вывод золота
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawId, setWithdrawId] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Призы колеса фортуны (синхронизировано с вашей картинкой)
  const wheelPrizes = [
    { title: '10 000G', subtitle: 'Супер-приз', type: 'gold', value: 10000, isWin: true, icon: '🪙' },
    { title: '2 000G', subtitle: 'На аккаунт', type: 'gold', value: 2000, isWin: true, icon: '🪙' },
    { title: 'M9 Stone Cold', subtitle: 'Редкий нож', type: 'knife', value: 9500, isWin: true, icon: '🗡️' },
    { title: 'Flip Arctic', subtitle: 'Стильный нож', type: 'knife', value: 7500, isWin: true, icon: '🗡️' },
    { title: '1 000G', subtitle: 'Бонус голды', type: 'gold', value: 1000, isWin: true, icon: '🪙' },
    { title: 'Butterfly Legacy', subtitle: 'Топовый нож', type: 'knife', value: 12000, isWin: true, icon: '🦋' },
    { title: '500G', subtitle: 'Старт', type: 'gold', value: 500, isWin: true, icon: '🪙' },
    { title: '5 000G', subtitle: 'Крупный приз', type: 'gold', value: 5000, isWin: true, icon: '🪙' },
  ];

  // Форма регистрации в профиле
  const [regId, setRegId] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Состояние профиля
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Счётчик кликов по логотипу (скрытая пасхалка)
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<NodeJS.Timeout | null>(null);

  // Редактирование профиля
  const [editNick, setEditNick] = useState('');
  const [editClan, setEditClan] = useState('');
  const [editRank, setEditRank] = useState('');
  const [editKills, setEditKills] = useState(0);
  const [editWins, setEditWins] = useState(0);
  const [editMatches, setEditMatches] = useState(0);
  const [editGold, setEditGold] = useState(0);

  // Кастомный выбор карт (Map Veto)
  const [vetoMaps, setVetoMaps] = useState([
    { name: 'Sandstone', status: 'available' },
    { name: 'Sakura', status: 'available' },
    { name: 'Rust', status: 'available' },
    { name: 'Zone 9', status: 'available' },
    { name: 'Breeze', status: 'available' },
  ]);

  // Форма отправки отчета о матче
  const [reportScore, setReportScore] = useState('');
  const [reportComment, setReportComment] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Ссылки
  const TG_CHANNEL_LINK = "https://t.me/TURNIRSO2GOLD02";
  const TG_PROFILE_LINK = "https://t.me/goldgold05";
  const VK_LINK = "https://vk.ru/rocketvvs";
  const MAX_LINK = "https://max.ru/u/f9LHodD0cOJT9tlXZnaDv4RF3pLOWYR1yW86haLFHuYKTRFJ3zP_Ymk4EqA";

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    logoClickCount.current += 1;

    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);

    if (logoClickCount.current >= 15) {
      if (profile) {
        const nextVerifiedState = !profile.isVerified;
        const updated = { ...profile, isVerified: nextVerifiedState };
        setProfile(updated);
        fillEditState(updated);
        localStorage.setItem('so2_user_profile', JSON.stringify(updated));
      } else {
        const newProfile: UserProfile = {
          id: '777777',
          email: 'verified_user@standoff.cup',
          nickname: 'Verified_Player',
          avatar: '/logo.png',
          kills: 0,
          deaths: 0,
          wins: 0,
          matches: 0,
          rank: 'Элитный',
          clan: 'Elite',
          goldBalance: 1000,
          isCheckedIn: false,
          isVerified: true,
        };
        setProfile(newProfile);
        fillEditState(newProfile);
        localStorage.setItem('so2_user_profile', JSON.stringify(newProfile));
      }

      setActiveModal('profile');
      logoClickCount.current = 0;
    } else {
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 2000);
    }
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('so2_user_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      fillEditState(parsed);
      setIsWelcomeModalOpen(false);
    }

    const savedHistory = localStorage.getItem('so2_win_history');
    if (savedHistory) {
      try {
        setWinHistory(JSON.parse(savedHistory));
      } catch (e) {}
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fillEditState = (p: UserProfile) => {
    setEditNick(p.nickname);
    setEditClan(p.clan);
    setEditRank(p.rank);
    setEditKills(p.kills);
    setEditWins(p.wins);
    setEditMatches(p.matches);
    setEditGold(p.goldBalance || 0);
  };

  const handleWelcomeRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!welcomeRegId || !welcomeRegEmail) return;

    const newProfile: UserProfile = {
      id: welcomeRegId,
      email: welcomeRegEmail,
      nickname: `Player_${welcomeRegId.slice(-4)}`,
      avatar: '/logo.png',
      kills: 0,
      deaths: 0,
      wins: 0,
      matches: 0,
      rank: 'Новичок',
      clan: 'Без клана',
      goldBalance: 1000,
      isCheckedIn: false,
      isVerified: false,
    };

    setProfile(newProfile);
    fillEditState(newProfile);
    localStorage.setItem('so2_user_profile', JSON.stringify(newProfile));
    setIsRegisteredFromWelcome(true);
    setIsWelcomeModalOpen(false);
    setIsFullWheelOpen(true); // Автоматически открываем колесо после регистрации!
  };

  // ЛОГИКА ВРАЩЕНИЯ КОЛЕСА
  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);

    const winningIndices = [0, 1, 2, 3, 4, 5, 6, 7];
    const targetIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];

    const degreesPerSector = 360 / wheelPrizes.length;
    const extraSpins = 360 * 6; // 6 pełnych оборотов
    const targetDegree = wheelRotation + extraSpins + (wheelPrizes.length - targetIndex) * degreesPerSector - (degreesPerSector / 2);

    setWheelRotation(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const winningPrize = wheelPrizes[targetIndex];
      setWheelResult(winningPrize);

      if (winningPrize.isWin && profile) {
        const rewardVal = winningPrize.value;
        const updated = { 
          ...profile, 
          goldBalance: winningPrize.type === 'gold' ? (profile.goldBalance || 0) + rewardVal : (profile.goldBalance || 0) 
        };
        setProfile(updated);
        fillEditState(updated);
        localStorage.setItem('so2_user_profile', JSON.stringify(updated));

        const newHistoryItem: WinHistoryItem = {
          id: Date.now().toString(),
          type: 'wheel',
          title: `Колесо Фортуны (${winningPrize.title})`,
          reward: `${winningPrize.title}`,
          date: 'Только что'
        };
        const updatedHistory = [newHistoryItem, ...winHistory];
        setWinHistory(updatedHistory);
        localStorage.setItem('so2_win_history', JSON.stringify(updatedHistory));
      }
    }, 4500);
  };

  const handleAddCustomWin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.isVerified || !customWinTitle || !customWinReward) return;

    const newCustomItem: WinHistoryItem = {
      id: Date.now().toString(),
      type: 'tournament',
      title: customWinTitle,
      reward: customWinReward,
      date: 'Только что'
    };

    const updatedHistory = [newCustomItem, ...winHistory];
    setWinHistory(updatedHistory);
    localStorage.setItem('so2_win_history', JSON.stringify(updatedHistory));
    setCustomWinTitle('');
    setCustomWinReward('');
  };

  const handleCheckIn = () => {
    if (!profile || !profile.isVerified) {
      setActiveModal('profile');
      return;
    }
    const updated = { ...profile, isCheckedIn: true };
    setProfile(updated);
    localStorage.setItem('so2_user_profile', JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen relative text-white bg-black selection:bg-orange-500 selection:text-black font-sans">
      
      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/bg.png" 
          alt="Standoff 2 Background" 
          fill 
          className="object-cover object-center opacity-40 brightness-75 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/95" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* TOP ANNOUNCEMENT BAR */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-black font-black py-1.5 px-4 text-center text-xs tracking-wider uppercase flex items-center justify-center space-x-2 shadow-md">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>🔥 Бонус 1000 голды активирован! Нажмите кнопку «Колесо фортуны», чтобы испытать удачу!</span>
        </div>

        {/* ЛЕНТА ОНЛАЙН-ВЫИГРЫШЕЙ */}
        <div className="bg-neutral-950/90 border-b border-orange-500/30 py-2 px-2 sm:px-4 shadow-inner backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 sm:space-x-3 overflow-hidden py-1">
            <div className="flex items-center space-x-1.5 bg-amber-500/20 border border-amber-500/40 px-2 sm:px-2.5 py-1 rounded-full shrink-0 text-amber-400 text-[10px] font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>LIVE Выигрыши:</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
              {liveWins.slice(0, 3).map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  className="bg-black/80 border border-amber-500/30 hover:border-amber-400 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center space-x-2 sm:space-x-2.5 shrink-0 transition-all shadow-md"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 text-[10px] sm:text-xs shrink-0 font-black">
                    🪙
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] sm:text-[10px] text-gray-400 block leading-tight font-medium">{item.text}</span>
                    <span className="text-[11px] sm:text-xs font-black text-amber-400 leading-tight">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HEADER */}
        <header className="sticky top-0 backdrop-blur-md bg-black/70 border-b border-orange-500/20 px-4 md:px-6 py-4 flex items-center justify-between shadow-2xl z-40">
          <div onClick={handleLogoClick} className="cursor-pointer select-none active:scale-95 transition-transform inline-block">
            <div className="flex items-center gap-2">
              <img src="/logo1.png" alt="Logo" className="w-10 h-10 rounded-full object-cover border border-orange-500/30" />
              <span className="text-xl font-bold tracking-wider text-white">Standoff 2 Turnir</span>
            </div>
          </div>
        </header>
          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => setActiveModal(null)} className="hover:text-orange-400 transition-colors">Главная</button>
            <button onClick={() => setIsFullWheelOpen(true)} className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-black">
              <Dices className="w-4 h-4 animate-spin" />
              <span>Колесо Фортуны</span>
            </button>
            <a href={TG_CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>TG Канал</span>
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsFullWheelOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black px-3 py-1.5 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all text-xs"
            >
              <Dices className="w-4 h-4" />
              <span>Колесо</span>
            </button>

            {profile ? (
              <button 
                onClick={() => setActiveModal('profile')}
                className="flex items-center space-x-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/40 px-3 py-1.5 rounded-xl transition-all text-orange-400 font-bold text-xs"
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-orange-400 bg-black shrink-0">
                  <Image src={profile.avatar} alt="User Avatar" fill className="object-cover" />
                </div>
                <span className="font-black text-white">{profile.nickname}</span>
                {profile.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />}
              </button>
            ) : (
              <button 
                onClick={() => setActiveModal('profile')}
                className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-400 text-black font-black px-3 py-1.5 rounded-xl transition-all text-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Войти</span>
              </button>
            )}
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center text-center px-4 pt-12 pb-12 max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black tracking-widest uppercase shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <Trophy className="w-4 h-4" />
            <span>Официальная турнирная арена</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tight italic drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">STANDOFF 2</span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">TURNIR ARENA</span>
          </h1>

          <div className="bg-black/70 border border-orange-500/30 p-6 rounded-3xl backdrop-blur-md max-w-md w-full shadow-2xl">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-1">Призовой фонд турнира</p>
            <p className="text-4xl md:text-6xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">20 000 GOLD</p>
            
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { label: 'ЧАСОВ', val: timeLeft.hours },
                { label: 'МИНУТ', val: timeLeft.minutes },
                { label: 'СЕКУНД', val: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <span className="text-2xl font-black text-white">{String(item.val).padStart(2, '0')}</span>
                  <span className="block text-[9px] text-gray-400 font-bold mt-0.5">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-white/10">
              <button 
                onClick={() => setIsFullWheelOpen(true)}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black uppercase text-xs rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
              >
                <Dices className="w-5 h-5" />
                <span>Испытать удачу в Колесе Фортуны</span>
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/90 backdrop-blur-md py-10 px-4 text-center text-xs text-gray-400 mt-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-gray-500 pt-4 border-t border-white/5">© 2026 STANDOFF 2 TURNIR. Все права защищены.</p>
          </div>
        </footer>
      </div>

      {/* ================= ПОЛНОЭКРАННОЕ КОЛЕСО ФОРТУНЫ (ТОЧНАЯ КОПИЯ ДИЗАЙНА С ВАШЕГО СКРИНА) ================= */}
      {isFullWheelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-xl flex flex-col items-center justify-center p-4">
            
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setIsFullWheelOpen(false)} 
              className="absolute top-2 right-2 md:-top-4 md:-right-4 w-10 h-10 rounded-full bg-neutral-800 border border-amber-500/40 text-amber-400 flex items-center justify-center hover:bg-neutral-700 transition-all z-50 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Верхний золотой указатель (стрелка) */}
            <div className="absolute top-0 z-30 transform -translate-y-2 flex flex-col items-center">
              <div className="w-8 h-10 bg-gradient-to-b from-yellow-300 via-amber-500 to-amber-700 clip-path-triangle shadow-[0_0_15px_rgba(251,191,36,0.8)] border border-yellow-200" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
            </div>

            {/* ВНЕШНИЙ КРУГ КОЛЕСА С ЗОЛОТОЙ РАМКОЙ */}
            <div className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full p-3 bg-gradient-to-b from-amber-300 via-amber-600 to-yellow-900 shadow-[0_0_60px_rgba(251,191,36,0.4)] flex items-center justify-center">
              
              {/* ВНУТРЕННИЙ ВРАЩАЮЩИЙСЯ ДИСК */}
              <div 
                className="w-full h-full rounded-full relative overflow-hidden bg-neutral-950 border-4 border-amber-500/60 shadow-inner transition-all ease-out"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transitionDuration: isSpinning ? '4.5s' : '0s'
                }}
              >
                {/* Отрисовка секторов колеса */}
                {wheelPrizes.map((prize, index) => {
                  const angle = (360 / wheelPrizes.length) * index;
                  return (
                    <div 
                      key={index}
                      className="absolute top-0 left-1/2 w-1/2 h-full origin-left flex items-start justify-center pt-6 sm:pt-8"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        borderRight: '1px solid rgba(251, 191, 36, 0.3)'
                      }}
                    >
                      <div 
                        className="flex flex-col items-center text-center space-y-1"
                        style={{ transform: `rotate(${360 / wheelPrizes.length / 2}deg)` }}
                      >
                        <span className="text-lg sm:text-xl">{prize.icon}</span>
                        <span className="text-[11px] sm:text-xs font-black text-amber-300 uppercase tracking-tight drop-shadow-md max-w-[70px] truncate">
                          {prize.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ЦЕНТРАЛЬНАЯ КНОПКА «КРУТИТЬ» */}
              <button 
                onClick={spinWheel}
                disabled={isSpinning}
                className="absolute z-20 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-4 border-amber-400 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.9),inset_0_0_15px_rgba(251,191,36,0.5)] active:scale-95 transition-transform cursor-pointer group"
              >
                <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-pulse" />
                <span className="text-amber-400 font-black text-xs sm:text-base tracking-widest uppercase drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] group-hover:text-yellow-300">
                  {isSpinning ? 'КРУТИТСЯ...' : 'КРУТИТЬ'}
                </span>
              </button>
            </div>

            {/* НИЖНЯЯ ПЛАШКА КАК НА СКРИНШОТЕ */}
            <div className="mt-6 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-500/40 px-6 py-3 rounded-xl shadow-xl text-center">
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400 drop-shadow">
                ИСПЫТАЙ УДАЧУ — ПОЛУЧИ ЛУЧШИЕ ПРИЗЫ![cite: 8]
              </p>
            </div>

            {/* РЕЗУЛЬТАТ ВРАЩЕНИЯ */}
            {wheelResult && !isSpinning && (
              <div className="mt-4 bg-amber-500/20 border border-amber-500/50 p-4 rounded-2xl text-center animate-fadeIn w-full">
                <p className="text-xs text-gray-300 uppercase font-bold">🎉 Поздравляем! Ваш приз:</p>
                <p className="text-xl font-black text-amber-400 mt-1">{wheelResult.title} ({wheelResult.subtitle})</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ================= БАЙТ-МОДАЛКА ПРИ ВХОДЕ ================= */}
      {isWelcomeModalOpen && !profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-black border-2 border-orange-500/60 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(249,115,22,0.3)] space-y-6 text-center">
            
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.6)] flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span>Добро пожаловать в Standoff 2 Cup</span>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                ПРИВЕТСТВУЕМ НА ТУРНИРНОЙ ПЛАТФОРМЕ! 🎮
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl">
                🔥 Зарегистрируйтесь, чтобы забрать <span className="text-amber-400 font-bold">1 000 золота</span> и сразу крутить Колесо Фортуны!
              </p>
            </div>

            <form onSubmit={handleWelcomeRegister} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">ID Аккаунта Standoff 2</label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: 12345678"
                  value={welcomeRegId}
                  onChange={(e) => setWelcomeRegId(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Электронная почта</label>
                <input 
                  type="email" 
                  required
                  placeholder="player@example.com"
                  value={welcomeRegEmail}
                  onChange={(e) => setWelcomeRegEmail(e.target.value)}
                  className="w-full bg-black/80 border border-white/20 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all text-sm mt-2 flex items-center justify-center space-x-2"
              >
                <Coins className="w-5 h-5" />
                <span>Зарегистрироваться и крутить колесо</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= МОДАЛКА ПРОФИЛЯ ================= */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-orange-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            {profile ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 border-b border-white/10 pb-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-orange-500 bg-black shrink-0">
                    <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-black text-white">{profile.nickname}</h3>
                      {profile.isVerified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-gray-400">ID: {profile.id} | Баланс: <span className="text-amber-400 font-bold">{profile.goldBalance || 0} GOLD</span></p>
                    <span className={`inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold ${profile.isVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                      {profile.isVerified ? 'Верифицированный аккаунт ✅' : 'Обычный аккаунт'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsFullWheelOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black uppercase text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Dices className="w-4 h-4" />
                  <span>Открыть Колесо Фортуны</span>
                </button>

                <button 
                  onClick={() => { localStorage.removeItem('so2_user_profile'); setProfile(null); setActiveModal(null); }}
                  className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 rounded-xl font-bold text-xs uppercase transition-all"
                >
                  Выйти из аккаунта
                </button>
              </div>
            ) : (
              <div className="text-center">Войдите в систему</div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}