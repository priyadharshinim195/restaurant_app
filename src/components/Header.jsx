import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#story', label: 'Our Story' },
  { href: '#menu', label: 'Menu' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`header ${solid ? 'is-solid' : ''}`}>
      <div className="container header__inner">
        <a href="#home" className="logo" onClick={close}>MAISON BURGER</a>

        <button
          className="burger-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav ${open ? 'is-open' : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="u-line" onClick={close}>
              {l.label}
            </a>
          ))}
          <a href="#reserve" className="btn btn--gold-sm" onClick={close}>Reserve a Table</a>
        </nav>
      </div>
    </header>
  );
}
