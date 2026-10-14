import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './components/Header.jsx';
import HeroAnimation from './components/HeroAnimation.jsx';
import { SignatureMenu, OurStory, Experience, Gallery, Reservation, Footer } from './components/Sections.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scroll-triggered section reveals
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      // Gentle parallax inside image frames
      gsap.utils.toArray('.parallax img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroAnimation />
        <SignatureMenu />
        <OurStory />
        <Experience />
        <Gallery />
        <Reservation />
      </main>
      <Footer />
    </>
  );
}
