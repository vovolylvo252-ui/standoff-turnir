export default function Logo() {
  return (
    <div className="flex items-center space-x-3 cursor-pointer group">
      {/* Иконка логотипа с буквой T */}
      <div className="relative w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 p-[2px] shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.7)] transition-all duration-300">
        <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent" />
          <span className="font-black italic text-2xl bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 bg-clip-text text-transparent transform -skew-x-12 select-none">
            T
          </span>
        </div>
      </div>

      {/* Текстовая надпись TURNIR */}
      <div className="flex flex-col">
        <span className="text-2xl font-black italic tracking-wider bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 bg-clip-text text-transparent transform -skew-x-6 select-none drop-shadow-[0_2px_10px_rgba(249,115,22,0.3)]">
          TURNIR
        </span>
        <span className="text-[9px] font-extrabold tracking-[0.25em] text-orange-400/80 uppercase -mt-1 select-none">
          STANDOFF 2 CUP
        </span>
      </div>
    </div>
  );
}