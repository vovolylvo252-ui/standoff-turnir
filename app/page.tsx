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
  Gift, Dices, RotateCw, Zap, CreditCard, ArrowDownRight
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
  totalWithdrawn?: number;
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

  // Состояние ленты онлайн-выигрышей (без свайпа, меняется по таймеру от 1 до 5 сек)
  const [liveWins, setLiveWins] = useState<LiveWinItem[]>([
    { id: 1, text: 'ShadowSniper выиграл', amount: '2 000 GOLD', timeAgo: 'только что' },
    { id: 2, text: 'СтандоффКинг сорвал куш', amount: '5 000 GOLD', timeAgo: '1 сек назад' },
    { id: 3, text: 'М9_Байонет_Бог получил приз', amount: '10 000 GOLD', timeAgo: '3 сек назад' },
  ]);

  // Эффект для генерации случайных выигрышей в реальном времени с меняющейся скоростью (от 1 до 5 секунд)
  useEffect(() => {
    // База из 100 уникальных никнеймов
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
      'Vortex_Flow', 'Wild_Card', 'Xenon_Ray', 'Yankee_D', 'Zodiac_Sign',
      'Alpha_Centauri', 'Beta_Tester', 'Gamma_Ray', 'Delta_Force', 'Epsilon_ID',
      'Zeta_Reticuli', 'Eta_Carinae', 'Theta_Wave', 'Iota_Prime', 'Kappa_Path',
      'Lambda_Core', 'Mu_Network', 'Nu_Clear', 'Xi_Warrior', 'Omicron_Persei',
      'Pi_Constant', 'Rho_Stream', 'Sigma_Male', 'Tau_Ceti', 'Upsilon_Sun',
      'Phi_Matrix', 'Chi_Square', 'Psi_Factor', 'Omega_Man', 'Ares_God',
      'Boreas_Wind', 'Cronus_Time', 'Daemon_X', 'Erebus_Dark', 'Faunus_Wild',
      'Hades_Lord', 'Helios_Sun', 'Hypnos_Sleep', 'Momus_Mock', 'Nereus_Sea',
      'Pan_Wild', 'Pluto_Rich', 'Proteus_Change', 'Styx_River', 'Tartarus_Pit',
      'Triton_Wave', 'Typhon_Storm', 'Uranus_Sky', 'Zeus_Thunder', 'Atlas_Hold'
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
        if (recentNicks.length > 50) {
          recentNicks.shift();
        }

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

  // История выигрышей (турниры и колесо фортуны)
  const [winHistory, setWinHistory] = useState<WinHistoryItem[]>([
    { id: '1', type: 'tournament', title: 'Стартовый турнир 5x5', reward: '500 GOLD', date: 'Вчера' },
    { id: '2', type: 'wheel', title: 'Колесо Фортуны', reward: '1 000 GOLD', date: 'Сегодня' }
  ]);

  // Состояние вывод золота
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawId, setWithdrawId] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Призы для колеса фортуны Standoff 2 (с добавлением изображения gold.png для голды)
  const wheelPrizes = [
    { title: '5 000 GOLD', subtitle: 'На игровой аккаунт', type: 'gold', value: 5000, isWin: true, icon: '/gold.png', isImage: true },
    { title: 'M9 Bayonet | Treasure Hunter', subtitle: 'Легендарный нож', type: 'knife', value: 10000, isWin: true, icon: '🗡️', isImage: false },
    { title: 'AWP | Sport', subtitle: 'Элитная снайперская винтовка', type: 'weapon', value: 3500, isWin: true, icon: '🎯', isImage: false },
    { title: '1 000 GOLD', subtitle: 'Стартовый бонус', type: 'gold', value: 1000, isWin: true, icon: '/gold.png', isImage: true },
    { title: 'Karambit | Scratch', subtitle: 'Редкий нож', type: 'knife', value: 8500, isWin: true, icon: '🔪', isImage: false },
    { title: 'AKR | Carbon', subtitle: 'Популярный автомат', type: 'weapon', value: 2500, isWin: true, icon: '🔫', isImage: false },
    { title: '10 000 GOLD', subtitle: 'Супер-приз голды', type: 'gold', value: 10000, isWin: true, icon: '/gold.png', isImage: true },
    { title: 'Butterfly | Legacy', subtitle: 'Топовый нож сезона', type: 'knife', value: 12000, isWin: true, icon: '🦋', isImage: false },
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
  const [editDeaths, setEditDeaths] = useState(0);
  const [editTotalWithdrawn, setEditTotalWithdrawn] = useState(0);

  // Состояния для разворачиваемых списков (История матчей и История выигрышей)
  const [isMatchHistoryOpen, setIsMatchHistoryOpen] = useState(false);
  const [isWinHistoryOpen, setIsWinHistoryOpen] = useState(false);

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

    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
    }

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
          totalWithdrawn: 0,
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
      } catch (e) {
        // Игнорировать ошибку парсинга
      }
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
    setEditDeaths(p.deaths || 0);
    setEditTotalWithdrawn(p.totalWithdrawn || 0);
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
      totalWithdrawn: 0,
    };

    setProfile(newProfile);
    fillEditState(newProfile);
    localStorage.setItem('so2_user_profile', JSON.stringify(newProfile));
    setIsRegisteredFromWelcome(true);
  };

  const handleRegisterProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regId || !regEmail) return;

    const newProfile: UserProfile = {
      id: regId,
      email: regEmail,
      nickname: `Player_${regId.slice(-4)}`,
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
      totalWithdrawn: 0,
    };

    setProfile(newProfile);
    fillEditState(newProfile);
    localStorage.setItem('so2_user_profile', JSON.stringify(newProfile));
  };

  const spinWheel = () => {
    if (isSpinning || !profile?.isVerified) return;
    setIsSpinning(true);
    setWheelResult(null);

    const winningIndices = [0, 1, 2, 3, 4, 5, 6, 7];
    const targetIndex = winningIndices[Math.floor(Math.random() * winningIndices.length)];

    const degreesPerSector = 360 / wheelPrizes.length;
    const extraSpins = 360 * 6;
    const targetDegree = extraSpins + (wheelPrizes.length - targetIndex) * degreesPerSector - (degreesPerSector / 2);

    setWheelRotation(targetDegree);

    setTimeout(() => {
      setIsSpinning(false);
      const winningPrize = wheelPrizes[targetIndex];
      setWheelResult(winningPrize);

      if (winningPrize.isWin && profile && profile.isVerified) {
        if (winningPrize.type === 'gold' || winningPrize.type === 'knife' || winningPrize.type === 'weapon') {
          const rewardVal = winningPrize.type === 'gold' ? winningPrize.value : winningPrize.value;
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
      }
    }, 4500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !profile.isVerified) return;
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0 || (profile.goldBalance || 0) < amount) return;

    const updatedGold = (profile.goldBalance || 0) - amount;
    const updatedTotalWithdrawn = (profile.totalWithdrawn || 0) + amount;
    const updated = { ...profile, goldBalance: updatedGold, totalWithdrawn: updatedTotalWithdrawn };
    setProfile(updated);
    fillEditState(updated);
    localStorage.setItem('so2_user_profile', JSON.stringify(updated));

    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setActiveModal(null);
      setWithdrawAmount('');
      setWithdrawId('');
    }, 2000);
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

  const toggleBanMap = (index: number) => {
    if (!profile || !profile.isVerified) {
      setActiveModal('profile');
      return;
    }

    setVetoMaps(prev => prev.map((m, i) => {
      if (i === index) {
        const nextStatus = m.status === 'available' ? 'banned' : m.status === 'banned' ? 'picked' : 'available';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Avatar = reader.result as string;
        const updated = { ...profile, avatar: base64Avatar };
        setProfile(updated);
        localStorage.setItem('so2_user_profile', JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      nickname: editNick,
      clan: editClan,
      rank: profile.isVerified ? editRank : profile.rank,
      kills: profile.isVerified ? Number(editKills) : profile.kills,
      deaths: profile.isVerified ? Number(editDeaths) : profile.deaths,
      wins: profile.isVerified ? Number(editWins) : profile.wins,
      matches: profile.isVerified ? Number(editMatches) : profile.matches,
      goldBalance: profile.isVerified ? Number(editGold) : (profile.goldBalance || 0),
      totalWithdrawn: profile.isVerified ? Number(editTotalWithdrawn) : (profile.totalWithdrawn || 0),
    };
    setProfile(updated);
    localStorage.setItem('so2_user_profile', JSON.stringify(updated));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('so2_user_profile');
    setProfile(null);
    setRegId('');
    setRegEmail('');
    setIsEditing(false);
    setIsWelcomeModalOpen(true);
  };

  const openMatchDetail = (t1: string, t2: string) => {
    setSelectedMatch({
      t1,
      t2,
      time: "18:00 МСК",
      format: "BO3 (Best of 3)",
      maps: ["Sandstone", "Sakura", "Rust"]
    });
    setActiveModal('match');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setActiveModal(null);
      setReportScore('');
      setReportComment('');
    }, 2000);
  };

  const redBracket = [
    { id: 1, t1: 'VOIDRIFT', t2: 'HEXNOVA' },
    { id: 2, t1: 'OBLIVYX', t2: 'CRIMSON IX' },
    { id: 3, t1: 'NEXORA', t2: 'SYNTHRIX' },
    { id: 4, t1: 'BLACKPULSE', t2: 'VENOM CORE' },
  ];

  const blueBracket = [
    { id: 5, t1: 'FROSTBYTE', t2: 'AETHERIX' },
    { id: 6, t1: 'NEON SHADE', t2: 'PHANTOM CTRL' },
    { id: 7, t1: 'ZERO SPECTRA', t2: 'LUMEN X' },
    { id: 8, t1: 'QUANTEX', t2: 'ECLIPSE VOID' },
  ];

  const topPlayers = [
    { rank: 1, nick: 'S1mple_SO2', kd: '2.45', kills: 340, clan: 'VOIDRIFT', badge: '🥇 MVP' },
    { rank: 2, nick: 'Horizon_X', kd: '2.10', kills: 295, clan: 'HEXNOVA', badge: '🥈 Top 2' },
    { rank: 3, nick: 'NecroKing', kd: '1.98', kills: 270, clan: 'FROSTBYTE', badge: '🥉 Top 3' },
  ];

  const casters = [
    { nick: 'CyberCaster', role: 'Main Commentator', platform: 'YouTube', live: true },
    { nick: 'SO2_Analyst', role: 'Tactical Analyst', platform: 'Twitch', live: false },
  ];

  const hallOfFame = [
    { season: 'Season 1 Gold Cup', winner: 'VOIDRIFT', runnerUp: 'HEXNOVA', prize: '15 000 GOLD', date: 'Январь 2026' },
    { season: 'Winter Arena 2025', winner: 'PHANTOM CTRL', runnerUp: 'OBLIVYX', prize: '10 000 GOLD', date: 'Декабрь 2025' },
  ];

  const faqList = [
    { q: 'Разрешено ли играть с ПК (Эмуляторов)?', a: 'Нет! Турнир проводится исключительно для мобильных устройств (iOS / Android). Игроки на ПК дисквалифицируются.' },
    { q: 'Как и когда выплачиваются призовые?', a: 'Начисление 20 000 GOLD происходит прямо на игровой аккаунт Standoff 2 в течение 24 часов после окончания финала.' },
    { q: 'Что делать, если противник не пришел?', a: 'Время ожидания соперника — 15 минут. Если команда не зашла в лобби, ей засчитывается техническое поражение (Тех.поб).' },
    { q: 'Как работает Check-In?', a: 'Чек-ин открывается за 1 час до турнира. Требуется верифицированный аккаунт.' },
  ];

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
          <span>🔥 Бонус 1000 голды активирован! Нажмите на мини-колесо слева внизу для запуска!</span>
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
                  className="bg-black/80 border border-amber-500/30 hover:border-amber-400 px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center space-x-2 sm:space-x-2.5 shrink-0 transition-all shadow-md animate-fadeIn"
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
            <Logo />
          </div>

          <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold uppercase tracking-wider">
            <button onClick={() => setActiveModal(null)} className="hover:text-orange-400 transition-colors">Главная</button>
            <button onClick={() => setActiveModal('tournaments')} className="hover:text-orange-400 transition-colors">Турниры</button>
            <button onClick={() => setActiveModal('teams')} className="hover:text-orange-400 transition-colors">Команды</button>
            <button onClick={() => setActiveModal('hallOfFame')} className="hover:text-orange-400 transition-colors flex items-center gap-1">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Зал Славы</span>
            </button>
            <button onClick={() => setActiveModal('rules')} className="hover:text-orange-400 transition-colors">Правила</button>
            <button onClick={() => setActiveModal('faq')} className="hover:text-orange-400 transition-colors">FAQ</button>
            <a href={TG_CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>TG Канал</span>
            </a>
          </nav>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setActiveModal('report')}
              className="hidden sm:flex items-center space-x-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-xl transition-all text-emerald-400 font-bold text-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Отчёт матча</span>
            </button>

            <button 
              onClick={() => setActiveModal('support')}
              className="flex items-center space-x-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/40 px-3 py-1.5 rounded-xl transition-all text-blue-400 font-bold text-xs"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Поддержка</span>
            </button>

            <button 
              onClick={() => { setIsStreamOpen(true); setIsStreamMinimized(false); }}
              className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 px-3 py-1.5 rounded-xl transition-all text-red-400 font-bold text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LIVE</span>
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
        <section className="flex flex-col items-center justify-center text-center px-4 pt-8 pb-8 max-w-5xl mx-auto space-y-6">
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
              {profile?.isCheckedIn ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-2xl flex items-center justify-center space-x-2 text-emerald-400 font-bold text-xs uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Вы подтвердили участие (Check-In)</span>
                </div>
              ) : (
                <button 
                  onClick={handleCheckIn}
                  className={`w-full py-3 font-black uppercase text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg ${
                    profile?.isVerified 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                      : 'bg-neutral-800 text-gray-400 border border-neutral-700 hover:border-amber-500/50'
                  }`}
                >
                  {profile?.isVerified ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
                  <span>{profile?.isVerified ? 'Подтвердить присутствие (Check-In)' : 'Чек-ин заблокирован (Нужна верификация)'}</span>
                </button>
              )}
              {(!profile || !profile.isVerified) && (
                <p className="text-[10px] text-amber-400/90 mt-2 font-bold">
                  ⚠️ Для чек-ина необходим верифицированный аккаунт
                </p>
              )}
            </div>
          </div>

          <div className="w-full max-w-md space-y-3">
            <button 
              onClick={() => setActiveModal('register')}
              className="w-full py-5 font-black text-lg uppercase tracking-wider text-black bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] transform hover:scale-[1.02] transition-all duration-300"
            >
              Зарегистрироваться на турнир
            </button>

            <div className="grid grid-cols-3 gap-2">
              <a 
                href={TG_PROFILE_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-sky-600/15 hover:bg-sky-600/30 border border-sky-500/40 rounded-xl font-bold text-sky-400 text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>
              <a 
                href={VK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-blue-600/15 hover:bg-blue-600/30 border border-blue-500/40 rounded-xl font-bold text-blue-400 text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>VK</span>
              </a>
              <a 
                href={MAX_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-purple-600/15 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl font-bold text-purple-400 text-[11px] uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>MAX</span>
              </a>
            </div>
          </div>

          <div className="w-full max-w-md bg-gradient-to-r from-cyan-950/80 via-blue-900/60 to-black/80 border-2 border-cyan-500/50 p-5 rounded-3xl backdrop-blur-md shadow-[0_0_35px_rgba(6,182,212,0.25)] flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
            <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-black uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>Главный анонс-канал</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase text-white tracking-wide">
                Наш Telegram-канал
              </h3>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                Следите за сеткой, результатами матчей и новыми турнирами!
              </p>
            </div>

            <a 
              href={TG_CHANNEL_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95"
            >
              <Send className="w-5 h-5 fill-black" />
              <span>Подписаться на канал</span>
            </a>
          </div>
        </section>

        {/* MAP VETO INTERACTIVE BAN/PICK SYSTEM */}
        <section className="py-8 px-4 max-w-5xl mx-auto w-full space-y-4">
          <div className="bg-neutral-900/80 border border-orange-500/30 p-6 rounded-3xl backdrop-blur-md shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Интерактивный Бан/Пик карт (Map Veto)</span>
                <h3 className="text-lg font-black text-white uppercase">Черкание карт перед матчем</h3>
              </div>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1 ${profile?.isVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {!profile?.isVerified && <Lock className="w-3 h-3" />}
                {profile?.isVerified ? 'Доступно (Верифицирован)' : 'Заблокировано (Требуется верификация)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {vetoMaps.map((map, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleBanMap(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all text-center space-y-2 select-none relative ${
                    !profile?.isVerified ? 'opacity-70 border-dashed border-red-500/40 bg-neutral-950/50' : ''
                  } ${
                    map.status === 'banned' ? 'bg-red-950/40 border-red-500/50 text-red-400' :
                    map.status === 'picked' ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' :
                    'bg-black/60 border-white/10 text-gray-300 hover:border-orange-500/50'
                  }`}
                >
                  {!profile?.isVerified && (
                    <div className="absolute top-2 right-2 text-red-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex justify-center">
                    {map.status === 'banned' && <Ban className="w-5 h-5 text-red-400" />}
                    {map.status === 'picked' && <Check className="w-5 h-5 text-emerald-400" />}
                    {map.status === 'available' && <MapPin className="w-5 h-5 text-gray-400" />}
                  </div>
                  <span className="block text-xs font-black uppercase">{map.name}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider block opacity-80">
                    {map.status === 'banned' ? 'Забанена' : map.status === 'picked' ? 'Выбрана' : 'Доступна'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOURNAMENT BRACKET SECTION */}
        <section className="py-10 px-4 max-w-7xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 text-amber-400 font-black tracking-widest uppercase text-sm">
              <Swords className="w-5 h-5" />
              <span>Турнирная сетка 1/8 Финала</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider">Участники Standoff 2 Cup</h2>
            <p className="text-gray-400 text-xs md:text-sm">Нажмите на любой матч, чтобы узнать подробности и карты</p>
          </div>

          <div className="relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.2)] bg-black/80" onClick={() => setActiveModal('image')}>
            <img 
              src="/bracket.png" 
              alt="Турнирная сетка Standoff 2" 
              className="w-full h-auto block group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-amber-400 font-black uppercase tracking-wider">
              <Maximize2 className="w-6 h-6" />
              <span>Нажмите, чтобы открыть во весь экран</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-3xl backdrop-blur-md space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <div className="flex justify-between items-center border-b border-red-500/20 pb-3">
                <span className="font-black text-red-500 uppercase tracking-wider text-sm">Красный дивизион</span>
                <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-bold border border-red-500/30">1/8 Финала</span>
              </div>
              <div className="space-y-3">
                {redBracket.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => openMatchDetail(m.t1, m.t2)}
                    className="bg-black/60 border border-red-500/20 p-4 rounded-xl flex justify-between items-center hover:border-red-500/60 hover:scale-[1.02] cursor-pointer transition-all"
                  >
                    <span className="font-black text-red-400 text-sm">{m.t1}</span>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider px-2 bg-amber-500/10 py-1 rounded-md">Детали</span>
                    <span className="font-black text-red-400 text-sm">{m.t2}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-500/30 p-6 rounded-3xl backdrop-blur-md space-y-4 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <div className="flex justify-between items-center border-b border-blue-500/20 pb-3">
                <span className="font-black text-blue-400 uppercase tracking-wider text-sm">Синий дивизион</span>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold border border-blue-500/30">1/8 Финала</span>
              </div>
              <div className="space-y-3">
                {blueBracket.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => openMatchDetail(m.t1, m.t2)}
                    className="bg-black/60 border border-blue-500/20 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/60 hover:scale-[1.02] cursor-pointer transition-all"
                  >
                    <span className="font-black text-blue-400 text-sm">{m.t1}</span>
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider px-2 bg-amber-500/10 py-1 rounded-md">Детали</span>
                    <span className="font-black text-blue-400 text-sm">{m.t2}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MVP / LEADERBOARD SECTION */}
        <section className="py-10 px-4 max-w-5xl mx-auto w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 text-amber-400 font-black tracking-widest uppercase text-sm">
              <Flame className="w-5 h-5 text-orange-500" />
              <span>Лидеры Турнира</span>
            </div>
            <h2 className="text-3xl font-black uppercase tracking-wider">Топ MVP Игроков</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {topPlayers.map((player) => (
              <div key={player.rank} className="bg-black/70 border border-amber-500/30 p-5 rounded-3xl backdrop-blur-md text-center space-y-3 relative overflow-hidden shadow-xl">
                <div className="inline-block bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-amber-400 text-xs font-black uppercase">
                  {player.badge}
                </div>
                <h3 className="text-xl font-black text-white">{player.nick}</h3>
                <p className="text-xs text-gray-400 font-bold">Клан: <span className="text-white">{player.clan}</span></p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="block text-xs text-gray-400">K/D</span>
                    <span className="text-lg font-black text-amber-400">{player.kd}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="block text-xs text-gray-400">Убийств</span>
                    <span className="text-lg font-black text-white">{player.kills}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CASTERS & MEDIA SECTION */}
        <section className="py-8 px-4 max-w-5xl mx-auto w-full space-y-6">
          <div className="bg-neutral-900/60 border border-red-500/30 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center space-x-2 text-red-500">
              <Mic className="w-6 h-6" />
              <h3 className="text-xl font-black uppercase text-white">Официальные кастеры и комментаторы</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {casters.map((caster, idx) => (
                <div key={idx} className="bg-black/60 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-white text-sm">{caster.nick}</span>
                      {caster.live && (
                        <span className="bg-red-500 text-black font-black text-[9px] px-1.5 py-0.5 rounded uppercase">LIVE</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 block">{caster.role}</span>
                  </div>
                  <a href={TG_CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SPONSORS & PARTNERS (БАННЕР WINLINE 1920x768 БЕЗ ИСКАЖЕНИЙ) */}
        <section className="py-12 px-4 max-w-5xl mx-auto w-full text-center space-y-6 border-t border-white/10">
          <span className="text-xs font-black uppercase text-gray-400 tracking-widest">Официальные спонсоры и партнёры турнира</span>
          
          <a 
            href="https://winline.ru" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full rounded-3xl overflow-hidden border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:scale-[1.01] transition-transform duration-300 relative group"
          >
            <div className="relative w-full aspect-[1920/768] bg-black">
              <Image 
                src="/bet.jpg" 
                alt="Winline Banner" 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              <div className="absolute bottom-4 right-4 bg-orange-500 text-black font-black text-xs uppercase px-4 py-2 rounded-xl flex items-center space-x-2 shadow-lg">
                <span>Перейти на сайт</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all pt-2">
            <span className="font-black text-xl text-gray-400 tracking-widest">STANDOFF 2 HUB</span>
            <span className="font-black text-xl text-gray-400 tracking-widest">CYBER ARENA</span>
            <span className="font-black text-xl text-gray-400 tracking-widest">MAX MEDIA</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 bg-black/90 backdrop-blur-md py-10 px-4 text-center text-xs text-gray-400 mt-auto pb-28 md:pb-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2">
              <h4 className="text-lg font-black uppercase text-amber-400 tracking-wider">Контактные данные и поддержка</h4>
              <p className="text-gray-400 text-xs">Свяжитесь с организатором по всем вопросам регистрации и проведения турниров</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a 
                href={TG_PROFILE_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/40 px-4 py-2.5 rounded-xl font-bold text-sky-400 transition-all"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>Telegram Профиль</span>
              </a>

              <a 
                href={VK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 px-4 py-2.5 rounded-xl font-bold text-blue-400 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>ВКонтакте (VK)</span>
              </a>

              <a 
                href={MAX_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 px-4 py-2.5 rounded-xl font-bold text-purple-400 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Мессенджер MAX</span>
              </a>

              <a 
                href={TG_CHANNEL_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/40 px-4 py-2.5 rounded-xl font-bold text-cyan-400 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>TG Канал</span>
              </a>
            </div>

            <p className="text-600 pt-4 border-t border-white/5">© 2026 STANDOFF 2 TURNIR. Все права защищены.</p>
          </div>
        </footer>
      </div>

      {/* ================= БАЙТ-МОДАЛКА ПРИ ВХОДЕ С ПРИВЕТСТВИЕМ (ТУРНИРЫ ТУДА СЮДА) ================= */}
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
                🔥 У нас тут турниры туда-сюда, крутые матчи, фаст-капы, розыгрыши ножей и голды каждый день! Зарегистрируйтесь, чтобы забрать <span className="text-amber-400 font-bold">1 000 золота</span> и участвовать в сетке.
              </p>
            </div>

            {isRegisteredFromWelcome ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-5 rounded-2xl space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-black text-white uppercase">Бонус 1,000 голды начислено!</h4>
                <p className="text-xs text-gray-300">
                  Теперь кликните на колесо слева внизу, чтобы испытать удачу и выиграть приз!
                </p>
                <button 
                  onClick={() => setIsWelcomeModalOpen(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-black uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition-all text-xs"
                >
                  Перейти на сайт и крутить колесо
                </button>
              </div>
            ) : (
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
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 text-black font-black uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] transition-all text-sm mt-2 flex items-center justify-center space-x-2"
                >
                  <Coins className="w-5 h-5" />
                  <span>Зарегистрироваться и войти</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= МИНИ-КОЛЕСО ФОРТУНЫ В НИЖНЕМ ЛЕВОМ УГЛУ ================= */}
      <div 
        onClick={() => setIsFullWheelOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-black border-2 border-amber-500/80 rounded-3xl p-3.5 shadow-[0_0_35px_rgba(251,191,36,0.35)] backdrop-blur-md cursor-pointer hover:scale-105 transition-transform duration-300 flex items-center space-x-3 group"
      >
        <div className="relative w-12 h-12 rounded-full border-2 border-amber-400 bg-black flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:rotate-180 transition-transform duration-700">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 to-amber-500/30 animate-pulse" />
          <Dices className="w-6 h-6 text-amber-400 z-10" />
        </div>
        <div className="text-left pr-2">
          <div className="flex items-center space-x-1">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Колесо Фортуны</span>
            <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" />
          </div>
          <p className="text-xs font-black text-white uppercase group-hover:text-amber-300 transition-colors">Кликни и выиграй нож!</p>
        </div>
      </div>

      {/* ================= ПОЛНОЭКРАННОЕ КОЛЕСО ФОРТУНЫ ================= */}
      {isFullWheelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fadeIn">
          <div className="bg-gradient-to-b from-neutral-900 via-neutral-950 to-black border-2 border-amber-500/60 rounded-3xl p-6 md:p-10 max-w-2xl w-full relative shadow-[0_0_70px_rgba(251,191,36,0.4)] flex flex-col items-center space-y-6 max-h-[95vh] overflow-y-auto">
            
            <button 
              onClick={() => { setIsFullWheelOpen(false); setWheelResult(null); }} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 p-2.5 rounded-full hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/40 px-4 py-1.5 rounded-full text-amber-400 text-xs font-black uppercase tracking-widest shadow-lg">
                <Zap className="w-4 h-4 animate-bounce" />
                <span>Элитный розыгрыш Standoff 2</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                КОЛЕСО <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">ФОРТУНЫ</span>
              </h2>
              <p className="text-xs md:text-sm text-gray-300 max-w-md mx-auto">
                Вращайте колесо и забирайте легендарные ножи (<span className="text-amber-400 font-bold">M9 Bayonet, Butterfly</span>) или пушки и голду!
              </p>
            </div>

            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-2">
              <div className="absolute -top-4 z-30 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow-[0_3px_8px_rgba(251,191,36,0.8)]" />
              
              <div 
                className="w-full h-full rounded-full border-8 border-amber-500/90 bg-neutral-950 relative overflow-hidden transition-all shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                style={{ 
                  transform: `rotate(${wheelRotation}deg)`,
                  transitionDuration: isSpinning ? '4500ms' : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.15, 0.85, 0.25, 1)'
                }}
              >
                {wheelPrizes.map((prize, idx) => {
                  const angle = (360 / wheelPrizes.length) * idx;
                  return (
                    <div 
                      key={idx}
                      className="absolute w-full h-full flex flex-col items-center pt-4 text-[10px] font-black uppercase text-center select-none"
                      style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}
                    >
                      <div className="space-y-1 transform -rotate-45">
                        {prize.isImage ? (
                          <div className="w-6 h-6 mx-auto relative inline-block filter drop-shadow">
                            <Image src={prize.icon} alt={prize.title} fill className="object-contain" />
                          </div>
                        ) : (
                          <span className="text-xl block filter drop-shadow">{prize.icon}</span>
                        )}
                        <span className="px-1.5 py-0.5 rounded text-[9px] block text-amber-300 bg-amber-500/20 border border-amber-500/30">
                          {prize.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-neutral-900 to-black border-4 border-amber-500/60 flex flex-col items-center justify-center text-center shadow-2xl z-20">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">SO2</span>
                <span className="text-sm font-black text-amber-400 uppercase">CUP</span>
              </div>
            </div>

            {wheelResult && (
              <div className="w-full p-4 rounded-2xl border text-center space-y-1 animate-fadeIn bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                <div className="text-2xl flex justify-center">
                  {wheelResult.isImage ? (
                    <div className="w-8 h-8 relative inline-block">
                      <Image src={wheelResult.icon} alt={wheelResult.title} fill className="object-contain" />
                    </div>
                  ) : (
                    <span>{wheelResult.icon}</span>
                  )}
                </div>
                <h4 className="text-lg font-black uppercase">{wheelResult.title}</h4>
                <p className="text-xs text-gray-300 font-medium">{wheelResult.subtitle}</p>
              </div>
            )}

            <div className="w-full space-y-3">
              {profile?.isVerified ? (
                <button 
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="w-full py-4 rounded-2xl font-black text-sm md:text-base uppercase tracking-wider bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 text-black hover:brightness-110 shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all flex items-center justify-center space-x-2"
                >
                  <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'Вращаем барабан...' : 'Крутить колесо фортуны!'}</span>
                </button>
              ) : (
                <div className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-neutral-800 border border-amber-500/40 text-amber-400 flex items-center justify-center space-x-2 shadow-lg">
                  <Lock className="w-5 h-5" />
                  <span>Колесо доступно только с верификацией</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs px-2 text-gray-400 font-bold">
                <span>Статус аккаунта:</span>
                <span className={profile?.isVerified ? 'text-emerald-400 font-black' : 'text-amber-400 font-black'}>
                  {profile?.isVerified ? 'Верифицирован ✅' : 'Обычный (Требуется верификация)'}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING MINI-STREAM WINDOW */}
      {isStreamOpen && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
          {!isStreamMinimized ? (
            <div className="bg-neutral-900 border-2 border-red-500/60 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] overflow-hidden w-[280px] sm:w-[340px] backdrop-blur-md">
              <div className="bg-black/90 px-3 py-2 flex items-center justify-between border-b border-red-500/20">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  <span className="text-[11px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1">
                    <Tv className="w-3.5 h-3.5" /> LIVE Стрим
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button onClick={() => setIsStreamMinimized(true)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsStreamOpen(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/live_stream?channel=UC_EXAMPLE" 
                  title="Standoff 2 Live Stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsStreamMinimized(false)}
              className="bg-neutral-900 border-2 border-red-500 px-4 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center space-x-2.5 text-white font-black text-xs hover:scale-105 transition-transform"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <Tv className="w-4 h-4 text-red-400" />
              <span>Развернуть эфир</span>
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      )}

      {/* ================= MODALS ================= */}

      {/* МОДАЛКА ВЫВОДА ЗОЛОТА */}
      {activeModal === 'withdraw' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white">Вывод золота</h3>
              <p className="text-gray-400 text-xs mt-1">Доступно только верифицированным пользователям</p>
            </div>

            {profile?.isVerified ? (
              withdrawSuccess ? (
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-2xl text-center text-emerald-400 font-bold text-sm">
                  ✅ Заявка на вывод золота успешно создана! Ожидайте зачисления.
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  <div className="bg-black/50 p-3 rounded-xl border border-white/10 flex justify-between items-center text-xs">
                    <span className="text-gray-400">Ваш баланс:</span>
                    <span className="text-amber-400 font-black">{profile.goldBalance || 0} GOLD</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Сумма для вывода</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      max={profile.goldBalance || 0}
                      placeholder="100"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">ID Аккаунта Standoff 2</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ваш игровой ID"
                      value={withdrawId}
                      onChange={(e) => setWithdrawId(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-amber-500"
                    />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase rounded-xl hover:brightness-110 transition-all shadow-lg text-xs">
                    Запросить вывод
                  </button>
                </form>
              )
            ) : (
              <div className="bg-red-500/20 border border-red-500/40 p-5 rounded-2xl text-center space-y-4">
                <Lock className="w-10 h-10 text-red-400 mx-auto" />
                <div className="space-y-2">
                  <p className="text-xs text-red-300 font-bold leading-relaxed">
                    Нельзя вывести и нужно верификацию пройти! Обратитесь к менеджеру турнира:
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <a 
                    href={TG_PROFILE_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/40 rounded-xl font-bold text-sky-400 text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageSquareText className="w-4 h-4" />
                    <span>Telegram</span>
                  </a>
                  <a 
                    href={VK_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 rounded-xl font-bold text-blue-400 text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>VK</span>
                  </a>
                  <a 
                    href={MAX_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 rounded-xl font-bold text-purple-400 text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>MAX</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === 'report' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase text-white">Отчёт о матче</h3>
              <p className="text-gray-400 text-xs mt-1">Отправьте итоговый счёт и скриншот победы</p>
            </div>

            {reportSuccess ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-2xl text-center text-emerald-400 font-bold text-sm">
                ✅ Отчёт успешно отправлен судьям!
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Итоговый счёт (например: 10 - 8)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="10 - 8"
                    value={reportScore}
                    onChange={(e) => setReportScore(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Комментарий / Ссылка на скриншот</label>
                  <textarea 
                    placeholder="Вставьте ссылку на скриншот или опишите детали..."
                    value={reportComment}
                    onChange={(e) => setReportComment(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500 h-24"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase rounded-xl transition-all">
                  Отправить судье
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {activeModal === 'hallOfFame' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 text-amber-400">
              <History className="w-8 h-8" />
              <h3 className="text-2xl font-black uppercase text-white">Зал Славы (Архив)</h3>
            </div>
            <div className="space-y-4">
              {hallOfFame.map((item, idx) => (
                <div key={idx} className="bg-black/50 border border-amber-500/20 p-5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-amber-400 text-base">{item.season}</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md font-bold">{item.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                    <div>
                      <span className="text-gray-400 block">🥇 Чемпион:</span>
                      <span className="font-black text-white text-sm">{item.winner}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">🥈 2 Место:</span>
                      <span className="font-bold text-gray-300 text-sm">{item.runnerUp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-blue-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl space-y-6 text-center">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto text-blue-400">
              <Headphones className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase text-white">Служба Поддержки</h3>
              <p className="text-gray-400 text-xs mt-1">Выберите удобный способ связи с организатором</p>
            </div>

            <div className="space-y-3 pt-2">
              <a href={TG_PROFILE_LINK} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <MessageSquareText className="w-5 h-5" />
                <span>Написать в Telegram</span>
              </a>
              <a href={VK_LINK} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <Share2 className="w-5 h-5" />
                <span>Написать ВКонтакте</span>
              </a>
              <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span>Мессенджер MAX</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'register' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-orange-500/40 rounded-3xl p-6 md:p-8 max-w-md w-full relative shadow-2xl text-center space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase text-white">Регистрация на турнир</h3>
              <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                Для подачи заявки напишите организатору в одну из соцсетей:
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a href={TG_PROFILE_LINK} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <MessageSquareText className="w-5 h-5" />
                <span>Подать заявку в Telegram</span>
              </a>
              <a href={VK_LINK} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <Share2 className="w-5 h-5" />
                <span>Подать заявку через VK</span>
              </a>
              <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all">
                <MessageCircle className="w-5 h-5" />
                <span>Заявка в Мессенджер MAX</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'match' && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-orange-500/40 rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-6">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="text-center space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-orange-400">Детали матча 1/8</span>
              <h3 className="text-2xl font-black text-white">{selectedMatch.t1} vs {selectedMatch.t2}</h3>
            </div>
            
            <div className="space-y-3 bg-black/50 p-4 rounded-2xl border border-white/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1"><Clock className="w-4 h-4 text-amber-400" /> Время старта:</span>
                <span className="font-bold text-white">{selectedMatch.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-1"><Swords className="w-4 h-4 text-orange-400" /> Формат:</span>
                <span className="font-bold text-white">{selectedMatch.format}</span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="text-gray-400 flex items-center gap-1 mb-2"><MapPin className="w-4 h-4 text-cyan-400" /> Маппул матча:</span>
                <div className="flex gap-2">
                  {selectedMatch.maps.map((m, idx) => (
                    <span key={idx} className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-white font-bold">{m}</span>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full py-3 bg-orange-500 text-black font-black uppercase rounded-xl hover:bg-orange-400">
              Закрыть
            </button>
          </div>
        </div>
      )}

      {activeModal === 'faq' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-orange-500/40 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 text-orange-500">
              <HelpCircle className="w-8 h-8" />
              <h3 className="text-2xl font-black uppercase text-white">Часто задаваемые вопросы</h3>
            </div>
            <div className="space-y-4">
              {faqList.map((item, idx) => (
                <div key={idx} className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-1">
                  <h4 className="font-bold text-amber-400 text-sm">{item.q}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'teams' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-orange-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3 text-orange-500">
              <Users className="w-8 h-8" />
              <h3 className="text-2xl font-black uppercase text-white">Команды-участники</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['VOIDRIFT', 'HEXNOVA', 'OBLIVYX', 'CRIMSON IX', 'FROSTBYTE', 'AETHERIX'].map((team, idx) => (
                <div key={idx} className="bg-black/50 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <span className="font-black text-white text-sm">{team}</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-bold border border-green-500/30">Подтвержден</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'image' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg" onClick={() => setActiveModal(null)}>
          <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 z-50">
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-6xl h-[85vh]">
            <Image src="/bracket.png" alt="Сетка во весь экран" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* PROFILE MODAL */}
      {activeModal === 'profile' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-orange-500/40 rounded-3xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setActiveModal(null); setIsEditing(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            {!profile ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-white">Создание профиля</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    Введите данные игрока для входа на турнирную платформу (+1000 голды бонус!)
                  </p>
                </div>

                <form onSubmit={handleRegisterProfile} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">ID Аккаунта Standoff 2</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Например: 12345678"
                      value={regId}
                      onChange={(e) => setRegId(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Ваша Электронная почта</label>
                    <input 
                      type="email" 
                      required
                      placeholder="player@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-orange-500 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black uppercase rounded-xl shadow-lg hover:brightness-110 transition-all mt-4 flex items-center justify-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Создать профиль (+1000 GOLD)</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-neutral-800/80 border border-neutral-700 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <ShieldCheck className={`w-8 h-8 shrink-0 ${profile.isVerified ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <div>
                      <span className="text-xs text-gray-400 block font-bold">Статус аккаунта:</span>
                      <span className="text-sm font-black uppercase tracking-wider text-white">
                        {profile.isVerified ? (
                          <span className="text-emerald-400">Верифицирован ✅ (Колесо фортуны и вывод доступны)</span>
                        ) : (
                          <span className="text-amber-400">Обычный аккаунт 🔒</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {!profile.isVerified && (
                    <div className="w-full sm:w-auto space-y-2">
                      <a 
                        href={TG_PROFILE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-xs uppercase rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Пройти верификацию</span>
                      </a>
                    </div>
                  )}
                </div>

                {!profile.isVerified && (
                  <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                    <span className="text-xs font-bold uppercase text-gray-400 block text-center">Свяжитесь с организатором:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <a 
                        href={TG_PROFILE_LINK} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/40 rounded-xl font-bold text-sky-400 text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                      >
                        <MessageSquareText className="w-4 h-4" />
                        <span>Telegram</span>
                      </a>
                      <a 
                        href={VK_LINK} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/40 rounded-xl font-bold text-blue-400 text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>VK</span>
                      </a>
                      <a 
                        href={MAX_LINK} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/40 rounded-xl font-bold text-purple-400 text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>MAX</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Единый блок профиля игрока (аватар, ник, айди, редактирование и выйти), расположенный под плашкой верификации */}
                <div className="space-y-6 pt-2">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-white/10 pb-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                      <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] bg-black">
                        <Image src={profile.avatar} alt="Avatar" fill className="object-cover" />
                        <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-[10px] font-bold uppercase text-amber-400 text-center p-1">
                          <Upload className="w-5 h-5 mb-1" />
                          Изменить
                          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                        </label>
                      </div>

                      <div>
                        <div className="flex items-center justify-center sm:justify-start space-x-2">
                          <h3 className="text-2xl font-black uppercase text-white">{profile.nickname}</h3>
                          {profile.isVerified && (
                            <span className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Проверено</span>
                            </span>
                          )}
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2.5 py-0.5 rounded-md font-bold border border-orange-500/30">
                            ID: {profile.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{profile.email}</p>
                        <div className="flex items-center justify-center sm:justify-start space-x-3 mt-2 text-xs font-bold">
                          <span className="text-amber-400">🏆 Звание: {profile.rank}</span>
                          <span className="text-gray-400">🛡️ Клан: {profile.clan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-orange-400 transition-colors"
                        title="Редактировать профиль"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 transition-colors"
                        title="Выйти из аккаунта"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-orange-500/20">
                      <h4 className="text-sm font-black uppercase text-amber-400">Редактирование профиля</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Никнейм</label>
                          <input type="text" value={editNick} onChange={(e) => setEditNick(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Клан</label>
                          <input type="text" value={editClan} onChange={(e) => setEditClan(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                        </div>
                      </div>

                      {profile.isVerified && (
                        <div className="space-y-3 pt-3 border-t border-white/10">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Звание</label>
                              <input type="text" value={editRank} onChange={(e) => setEditRank(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Убийства</label>
                              <input type="number" value={editKills} onChange={(e) => setEditKills(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Смерти</label>
                              <input type="number" value={editDeaths} onChange={(e) => setEditDeaths(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Победы</label>
                              <input type="number" value={editWins} onChange={(e) => setEditWins(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Матчи</label>
                              <input type="number" value={editMatches} onChange={(e) => setEditMatches(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Баланс (Gold)</label>
                              <input type="number" value={editGold} onChange={(e) => setEditGold(Number(e.target.value))} className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-orange-500" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 pt-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold rounded-lg">Отмена</button>
                        <button onClick={handleSaveProfile} className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-black text-xs rounded-lg shadow-lg">Сохранить</button>
                      </div>
                    </div>
                  )}

                  {/* Блок для отображения аватарки на сайте (добавлен по вашему запросу) */}
                  <div className="bg-neutral-950/60 border border-orange-500/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 bg-black shrink-0 shadow-md">
                        <Image src={profile.avatar} alt="Avatar Preview" fill className="object-cover" />
                      </div>
                      <div className="text-left">
                        <h5 className="text-xs font-black uppercase text-amber-400">Аватарка на сайте</h5>
                        <p className="text-[11px] text-gray-300">Ваше текущее изображение профиля успешно отображается на платформе.</p>
                      </div>
                    </div>
                    <label className="px-4 py-2.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 font-bold text-xs uppercase rounded-xl cursor-pointer transition-all flex items-center space-x-2 shrink-0">
                      <Camera className="w-4 h-4" />
                      <span>Сменить фото</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div 
                      onClick={() => setIsMatchHistoryOpen(!isMatchHistoryOpen)}
                      className="bg-black/40 hover:bg-black/60 border border-white/10 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 text-amber-400 font-black text-xs uppercase">
                        <History className="w-4 h-4" />
                        <span>История матчей (Турнирные игры)</span>
                      </div>
                      {isMatchHistoryOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>

                    {isMatchHistoryOpen && (
                      <div className="space-y-2 animate-fadeIn pl-2">
                        <div className="bg-black/60 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white block">VOIDRIFT vs HEXNOVA</span>
                            <span className="text-[10px] text-gray-400">Карта: Sandstone (Победа)</span>
                          </div>
                          <span className="text-emerald-400 font-black text-xs">+10:8</span>
                        </div>
                        <div className="bg-black/60 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-white block">FROSTBYTE vs AETHERIX</span>
                            <span className="text-[10px] text-gray-400">Карта: Sakura (Поражение)</span>
                          </div>
                          <span className="text-red-400 font-black text-xs">7:10</span>
                        </div>
                      </div>
                    )}

                    <div 
                      onClick={() => setIsWinHistoryOpen(!isWinHistoryOpen)}
                      className="bg-black/40 hover:bg-black/60 border border-white/10 p-4 rounded-2xl flex justify-between items-center cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-2 text-amber-400 font-black text-xs uppercase">
                        <Award className="w-4 h-4" />
                        <span>История выигрышей и наград ({winHistory.length})</span>
                      </div>
                      {isWinHistoryOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>

                    {isWinHistoryOpen && (
                      <div className="space-y-2 animate-fadeIn pl-2">
                        {winHistory.map((item) => (
                          <div key={item.id} className="bg-black/60 p-3 rounded-xl border border-amber-500/20 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-amber-300 block">{item.title}</span>
                              <span className="text-[10px] text-gray-400">{item.date}</span>
                            </div>
                            <span className="text-amber-400 font-black text-xs">{item.reward}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setActiveModal('withdraw')}
                      className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase text-xs rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
                    >
                      <Coins className="w-4 h-4" />
                      <span>Вывести золото ({profile.goldBalance || 0} GOLD)</span>
                    </button>
                    <button 
                      onClick={() => setActiveModal(null)} 
                      className="px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase text-xs rounded-xl transition-all"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}
