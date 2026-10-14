import { useState } from 'react';

/*
  PHOTO PLACEHOLDERS
  Every <Photo> loads an image from /public/images/... If the file is missing,
  the image hides itself and a gold label shows the exact path to add.
*/
export function Photo({ src, alt = '', className = '' }) {
  return (
    <div className={`ph ${className}`}>
      <span className="ph__label">Add photo: {src}</span>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}

/* ---------- Signature burgers ---------- */
const DISHES = [
  {
    name: 'The Golden Classic',
    img: '/images/burgers/golden-classic.jpg',
    text: 'A perfectly grilled beef patty, aged cheddar, crisp lettuce, ripe tomato, and our signature house sauce in a toasted brioche bun.',
  },
  {
    name: 'The Truffle Royale',
    img: '/images/burgers/truffle-royale.jpg',
    text: 'A gourmet burger featuring rich truffle-inspired flavours, melted cheese, caramelized onions, and a soft golden brioche bun.',
  },
  {
    name: 'The Smokehouse',
    img: '/images/burgers/smokehouse.jpg',
    text: 'A flame-grilled beef patty with smoky sauce, melted cheddar, crispy onions, and fresh ingredients.',
  },
];

export function SignatureMenu() {
  return (
    <section className="section bg-signature" id="menu">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">Signature Burgers</p>
          <h2>The Art of the Burger</h2>
          <p className="lead">
            Every ingredient is chosen with intention. Every layer brings its own character. Together, they
            create a flavour worth remembering.
          </p>
        </header>

        <div className="dishes">
          {DISHES.map((d, i) => (
            <article className={`dish reveal dish--${i + 1}`} key={d.name}>
              <Photo src={d.img} alt={d.name} className="dish__media" />
              <span className="dish__num">0{i + 1}</span>
              <h3>{d.name}</h3>
              <p>{d.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Our story ---------- */
export function OurStory() {
  return (
    <section className="section story bg-story" id="story">
      <div className="container story__grid">
        <div className="story__media reveal">
          <Photo src="/images/restaurant/chef-preparation.jpg" alt="Chef preparing a burger" />
        </div>
        <div className="story__text reveal">
          <p className="eyebrow">Our Philosophy</p>
          <h2>
            Simple Ingredients.
            <br />
            Exceptional Craft.
          </h2>
          <p className="lead">
            We believe great food begins with exceptional ingredients, thoughtful preparation, and a genuine
            passion for flavour. Every burger is crafted to deliver a memorable experience, from the first glance
            to the final bite.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Experience ---------- */
const BLOCKS = [
  {
    title: 'The Ambience',
    img: '/images/restaurant/ambience.jpg',
    text: 'An intimate dining environment shaped by warm lighting, elegant interiors, and thoughtful design.',
  },
  {
    title: 'The Ingredients',
    img: '/images/restaurant/ingredients.jpg',
    text: 'Fresh ingredients, carefully selected produce, and expertly prepared flavours.',
  },
  {
    title: 'The Craft',
    img: '/images/restaurant/craft.jpg',
    text: 'Every burger assembled with attention to detail and a passion for exceptional food.',
  },
];

export function Experience() {
  return (
    <section className="section experience bg-experience" id="experience">
      <div className="container">
        <header className="section-head center reveal">
          <p className="eyebrow">The Experience</p>
          <h2>Where Every Detail Matters</h2>
        </header>
      </div>
      <div className="xp-grid">
        {BLOCKS.map((b) => (
          <article className="xp reveal" key={b.title}>
            <div className="parallax">
              <Photo src={b.img} alt={b.title} className="xp__bg" />
            </div>
            <div className="xp__body">
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */
const GALLERY = [
  { cls: 'g1', img: '/images/gallery/burger-closeup.jpg', cap: 'The Burger, Up Close' },
  { cls: 'g2', img: '/images/gallery/melted-cheese.jpg', cap: 'Melted Cheddar' },
  { cls: 'g3', img: '/images/gallery/fresh-ingredients.jpg', cap: 'Fresh Ingredients' },
  { cls: 'g4', img: '/images/gallery/restaurant-interior.jpg', cap: 'The Dining Room' },
  { cls: 'g5', img: '/images/gallery/elegant-table.jpg', cap: 'Reserved Tables' },
  { cls: 'g6', img: '/images/gallery/burger-preparation.jpg', cap: 'In the Kitchen' },
];

export function Gallery() {
  return (
    <section className="section bg-gallery" id="gallery">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow">Gallery</p>
          <h2>Moments from the Kitchen and Floor</h2>
        </header>
        <div className="gallery-grid">
          {GALLERY.map((g) => (
            <figure className={`gal reveal ${g.cls}`} key={g.img}>
              <Photo src={g.img} alt={g.cap} />
              <figcaption>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Reservation ---------- */
const EMPTY = { name: '', email: '', phone: '', date: '', time: '', guests: '2', requests: '' };

function validate(f) {
  const e = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
  if (!/^\+?[\d\s-]{7,}$/.test(f.phone)) e.phone = 'Enter a valid phone number.';
  if (!f.date) e.date = 'Choose a date.';
  if (!f.time) e.time = 'Choose a time.';
  if (!f.guests || Number(f.guests) < 1) e.guests = 'Enter at least 1 guest.';
  return e;
}

export function Reservation() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);
  const today = new Date().toISOString().slice(0, 10);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setConfirmed(null);
      return;
    }
    // Frontend only: no booking backend exists yet, so this does NOT claim a booking was made.
    // To connect one, send `form` to your API inside this function.
    setConfirmed(form);
    setForm(EMPTY);
  };

  return (
    <section className="section reserve" id="reserve">
      <div className="container reserve__grid">
        <div className="reveal">
          <p className="eyebrow">Reservations</p>
          <h2>Your Table Awaits</h2>
          <p className="lead">
            Make room for something extraordinary. Join us for an unforgettable dining experience.
          </p>
        </div>

        <div className="reveal">
          {confirmed && (
            <div className="confirm" role="status">
              Thank you, {confirmed.name}. Your request for {confirmed.guests} guest(s) on {confirmed.date} at{' '}
              {confirmed.time} has been noted. It is not yet a confirmed booking.
            </div>
          )}

          <form className="form" onSubmit={handleSubmit} noValidate>
            <Field label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
            <Field label="Number of guests" name="guests" type="number" min="1" value={form.guests} onChange={handleChange} error={errors.guests} />
            <Field label="Date" name="date" type="date" min={today} value={form.date} onChange={handleChange} error={errors.date} />
            <Field label="Time" name="time" type="time" value={form.time} onChange={handleChange} error={errors.time} />
            <div className="field field--full">
              <label htmlFor="requests">Special requests</label>
              <textarea id="requests" name="requests" rows="3" value={form.requests} onChange={handleChange} />
            </div>
            <div className="field--full">
              <button type="submit" className="btn btn--solid">Reserve Your Table</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, error, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...rest} />
      {error && <span className="err">{error}</span>}
    </div>
  );
}

/* ---------- Footer ---------- */
const FOOTER_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#story', label: 'Our Story' },
  { href: '#menu', label: 'Menu' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
];

/* CONFIG: replace every [bracketed] value with your real details */
const CONTACT = {
  address: '[Street address, City, Postcode]',
  phone: '[+00 00000 00000]',
  email: '[hello@your-domain.com]',
  hours: [
    ['Mon – Thu', '[12:00 – 22:30]'],
    ['Fri – Sun', '[12:00 – 23:30]'],
  ],
  social: [
    { label: 'Instagram', url: '[https://instagram.com/your-handle]' },
    { label: 'Facebook', url: '[https://facebook.com/your-page]' },
  ],
};

export function Footer() {
  return (
    <footer className="footer bg-footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div>
            <p className="logo">MAISON BURGER</p>
            <p className="lead">Exceptional ingredients. Crafted with passion.</p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            <nav className="footer__links">
              {FOOTER_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="u-line">{l.label}</a>
              ))}
            </nav>
          </div>
          <div>
            <p className="eyebrow">Visit</p>
            <p>{CONTACT.address}</p>
            <p>{CONTACT.phone}</p>
            <p>{CONTACT.email}</p>
          </div>
          <div>
            <p className="eyebrow">Opening Hours</p>
            {CONTACT.hours.map(([day, time]) => (
              <p key={day}>{day}: {time}</p>
            ))}
          </div>
          <div>
            <p className="eyebrow">Follow</p>
            {CONTACT.social.map((s) => (
              <p key={s.label}><a href="#" className="u-line">{s.label} {s.url}</a></p>
            ))}
          </div>
        </div>
        <div className="gold-sep" />
        <p className="copy">© {new Date().getFullYear()} Maison Burger. All rights reserved.</p>
      </div>
    </footer>
  );
}
