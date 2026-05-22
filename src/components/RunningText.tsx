import { ChurchActivity } from '../types';
import { Calendar, Volume2 } from 'lucide-react';

interface RunningTextProps {
  activities: ChurchActivity[];
}

export default function RunningText({ activities }: RunningTextProps) {
  // Construct dynamic scrolling string from activities
  const tickerItems = activities.map((act) => {
    return `[ ${act.title}: ${act.dateTime} di ${act.location} ]`;
  });

  const scrollText = tickerItems.length > 0 
    ? tickerItems.join('  •  ') + '  •  Selamat Bersekutu di Hari Perhentian Kudus  •  Tuhan Yesus Memberkati  •  '
    : 'Jadwal Kebaktian Utama Rayon 1 & 2 dilaksanakan setiap Minggu Pagi pukul 08:00 WITA  •  Mari Persiapkan Diri Menyambut Ibadah Kudus  •  ';

  return (
    <div className="bg-gmit-blue-deep text-white border-t border-gmit-gold py-3 relative z-40 overflow-hidden shadow-inner flex items-center">
      {/* Static Label Tag */}
      <div className="flex-shrink-0 bg-gmit-gold text-gmit-blue-deep text-xs font-black px-4 py-1 rounded-r-md uppercase flex items-center space-x-1.5 shadow-md font-display z-10 relative">
        <Volume2 className="h-3.5 w-3.5 animate-pulse" />
        <span className="tracking-wider">INFO UTAMA JEMAAT:</span>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex items-center h-5 select-none text-xs">
        <div className="absolute whitespace-nowrap flex space-x-8 animate-[marquee_50s_linear_infinite] hover:[animation-play-state:paused] font-display font-semibold tracking-wide text-gmit-gold-light">
          <span>{scrollText}</span>
          <span>{scrollText}</span>
        </div>
      </div>

      {/* Styling injected custom marquee keyframes to index.css if not added yet */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
