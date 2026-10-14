import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
  CONFIG
  Frames live in /public/restaurant-frames/frame-001.jpg ... frame-260.jpg
  Change FRAME_COUNT or FRAME_PATH if your files are named or stored differently.
*/
const FRAME_COUNT = 260;
const FIRST_BATCH = 16; // frames loaded right after the first one
const BATCH_SIZE = 24; // then loaded in small batches so the browser never freezes
const framePath = (n) => `/restaurant-frames/frame-${String(n).padStart(3, '0')}.jpg`;

export default function HeroAnimation() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyARef = useRef(null);
  const copyBRef = useRef(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext('2d');
    const frames = new Array(FRAME_COUNT).fill(null);
    // Tiny offscreen canvas: upscaling it gives a soft blurred backdrop that fills the letterbox bars
    const backdrop = document.createElement('canvas');
    backdrop.width = 96;
    backdrop.height = 54;
    const bctx = backdrop.getContext('2d');
    const state = { frame: 0 }; // GSAP tweens this value while scrolling
    let cancelled = false;
    let dirty = false;
    let rafId = 0;

    // Find the nearest loaded frame so a slow connection never shows a blank canvas
    const nearest = (i) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (frames[i - d]) return frames[i - d];
        if (frames[i + d]) return frames[i + d];
      }
      return null;
    };

    // Draw on the next animation frame only when something changed
    const draw = () => {
      rafId = 0;
      if (!dirty) return;
      dirty = false;
      const img = nearest(Math.round(state.frame));
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      // Blurred backdrop: same scene, cover-fitted, softened and darkened
      const bw = backdrop.width;
      const bh = backdrop.height;
      const cs = Math.max(bw / img.naturalWidth, bh / img.naturalHeight);
      bctx.drawImage(img, (bw - img.naturalWidth * cs) / 2, (bh - img.naturalHeight * cs) / 2, img.naturalWidth * cs, img.naturalHeight * cs);
      ctx2d.imageSmoothingEnabled = true;
      ctx2d.drawImage(backdrop, 0, 0, cw, ch);
      ctx2d.fillStyle = 'rgba(11, 11, 11, 0.45)';
      ctx2d.fillRect(0, 0, cw, ch);
      // "contain" scaling: the whole frame stays visible, nothing is cropped
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx2d.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };
    const requestDraw = () => {
      dirty = true;
      if (!rafId) rafId = requestAnimationFrame(draw);
    };

    // Keep the canvas sharp, but cap DPR at 2 to protect memory on phones
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      requestDraw();
    };

    // Load one frame; a broken file is skipped instead of breaking the page
    const loadFrame = (n) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!cancelled) frames[n - 1] = img;
          resolve(true);
        };
        img.onerror = () => {
          console.warn(`Missing or unreadable frame: ${framePath(n)}`);
          resolve(false);
        };
        img.src = framePath(n);
      });

    const loadAll = async () => {
      await loadFrame(1); // first frame shows as soon as it is ready
      if (cancelled) return;
      requestDraw();
      setReady(true);
      setLoaded(1);

      let next = 2;
      let size = FIRST_BATCH;
      while (next <= FRAME_COUNT && !cancelled) {
        const batch = [];
        for (let n = next; n < next + size && n <= FRAME_COUNT; n++) batch.push(loadFrame(n));
        next += size;
        size = BATCH_SIZE;
        await Promise.all(batch);
        if (cancelled) return;
        setLoaded(frames.filter(Boolean).length);
        requestDraw();
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const ctx = gsap.context(() => {
      gsap.from(copyARef.current.children, {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3,
      });

      // One timeline, scrubbed by scroll: frames + text stay in sync
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=350%', // longer distance = slower, more cinematic
          pin: true,
          scrub: 0.6, // smooths the scroll input; reverses naturally when scrolling up
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(state, { frame: FRAME_COUNT - 1, ease: 'none', duration: 10, onUpdate: requestDraw }, 0)
        .to(copyARef.current, { autoAlpha: 0, y: -40, duration: 1.1, ease: 'power2.in' }, 2.8)
        .fromTo(
          copyBRef.current,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' },
          5.4
        )
        // Clear the stage at the end so the separated ingredients are never covered
        .to(copyBRef.current, { autoAlpha: 0, duration: 0.8, ease: 'power1.in' }, 9.2);
    }, section);

    loadAll();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      ctx.revert(); // kills the ScrollTrigger and removes the pin
    };
  }, []);

  const pct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section className="hero" id="home" ref={sectionRef}>
      <canvas
        ref={canvasRef}
        className="hero__canvas"
        role="img"
        aria-label="Cinematic sequence: a fine-dining interior that becomes a gourmet burger whose ingredients float apart as you scroll"
      />
      <div className="hero__shade" />

      <div className={`hero__loader ${ready ? 'is-done' : ''}`} aria-hidden={ready}>
        <span>Preparing {pct}%</span>
      </div>

      <div className="hero__copy" ref={copyARef}>
        <p className="eyebrow">An Extraordinary Dining Experience</p>
        <h1>
          Crafted for the
          <br />
          Exceptional.
        </h1>
        <p className="hero__text">Discover a world where gourmet flavours meet timeless elegance.</p>
        <div className="hero__btns">
          <a href="#menu" className="btn btn--solid">Explore Our Menu</a>
          <a href="#story" className="btn">Discover Our Story</a>
        </div>
      </div>

      <div className="hero__alt" ref={copyBRef}>
        <h2>
          More Than a Burger.
          <br />
          An Experience.
        </h2>
        <p className="hero__text">Exceptional ingredients. Unforgettable flavour.</p>
      </div>
    </section>
  );
}
