export default function Header() {
  return (
    <header className="w-full bg-surface border-b border-outline-variant/30 py-6 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">church</span>
          </div>
          <div>
            <span className="block font-serif text-xl font-bold text-primary leading-tight">
              Adullam 2026
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-medium"></span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-on-surface-variant font-medium text-sm uppercase tracking-wider">
          <a className="hover:text-primary transition-colors" href="#">
            The
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Pillar
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Of Our Faith
          </a>
        </nav>
      </div>
    </header>
  );
}
