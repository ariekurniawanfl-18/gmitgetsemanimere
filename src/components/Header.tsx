import { useState } from 'react';
import { Menu, X, Landmark, ShieldCheck, Heart } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({ currentTab, setCurrentTab, isAdminLoggedIn, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil Jemaat' },
    { id: 'kegiatan', label: 'Kegiatan & Warta' },
    { id: 'pengajuan', label: 'Pengajuan Jemaat' },
    { id: 'galeri', label: 'Galeri Media' },
    { id: 'kontak', label: 'Hubungi Kami' },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gmit-blue-deep text-white shadow-md border-b-2 border-gmit-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabClick('beranda')}>
            <div className="bg-gmit-gold p-2.5 rounded-full text-gmit-blue-deep shadow-inner flex items-center justify-center">
              <Landmark className="h-6 w-6 stroke-[2]" />
            </div>
            <div>
              <span className="font-display font-bold text-lg md:text-xl tracking-wide block leading-tight text-white">
                GMIT GETSEMANI MERE
              </span>
              <span className="text-xs uppercase tracking-widest text-gmit-gold font-medium block">
                Kec. Amarasi Barat • NTT
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium tracking-wide transition duration-150 uppercase font-display border-b-2 ${
                  currentTab === item.id
                    ? 'border-gmit-gold text-gmit-gold bg-white/5'
                    : 'border-transparent text-gray-200 hover:text-gmit-gold hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-2 pl-4 border-l border-white/20">
                <button
                  onClick={() => handleTabClick('admin')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide flex items-center space-x-1.5 bg-gmit-gold text-gmit-blue-deep hover:bg-gmit-gold/90 transition-all`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>DASHBOARD ADMIN</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-900/40 transition-all border border-red-800"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('admin')}
                className="ml-4 px-3.5 py-2 bg-gradient-to-r from-gmit-gold to-gmit-gold-dark hover:from-gmit-gold/90 hover:to-gmit-gold-dark/90 text-gmit-blue-deep font-bold text-xs tracking-wider rounded shadow-md hover:shadow-lg transition-all duration-150 font-display uppercase"
              >
                Login Admin
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gmit-blue text-white select-none border-t border-gmit-gold/30">
          <div className="px-2 pt-3 pb-4 space-y-1.5 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-semibold tracking-wide border-l-4 ${
                  currentTab === item.id
                    ? 'bg-gmit-blue-deep text-gmit-gold border-gmit-gold'
                    : 'border-transparent hover:bg-gmit-blue-deep text-gray-100 hover:text-gmit-gold'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-4 pb-1 border-t border-white/10 px-4">
              {isAdminLoggedIn ? (
                <div className="flex items-center justify-between space-x-2">
                  <button
                    onClick={() => handleTabClick('admin')}
                    className="flex-1 py-2.5 px-4 bg-gmit-gold text-gmit-blue-deep rounded font-bold text-center text-sm shadow flex items-center justify-center space-x-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>PORTAL ADMIN</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="py-2.5 px-4 bg-red-800 text-white rounded font-bold text-sm"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleTabClick('admin')}
                  className="w-full py-2.5 px-4 bg-gmit-gold hover:bg-gmit-gold-dark text-gmit-blue-deep font-bold rounded text-center text-sm transition-all"
                >
                  PORTAL ADMIN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
