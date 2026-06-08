import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Typed from 'typed.js';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import { NOW_SHOWING, UPCOMING_MOVIES, BOOKMYSHOW_BASE } from './movies.config.js';

import 'swiper/css';
import 'swiper/css/pagination';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 🎬 CURTAIN REVEAL ANIMATION
window.addEventListener('load', () => {
  try {
    const curtainContainer = document.querySelector('.curtain-container');
    if (curtainContainer) {
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            curtainContainer.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
            
            // Trigger page load hero animations once curtain is gone
            const heroTl = gsap.timeline({
              onComplete: () => {
                document.body.style.overflow = 'auto';
                document.body.style.overflowX = 'hidden';
              }
            });
            heroTl.from(".hero-badge", { opacity: 0, y: -20, duration: 0.5 })
                  .from(".hero-hindi", { opacity: 0, y: 30, duration: 0.7 }, "-=0.2")
                  .from(".hero-title", { opacity: 0, y: 40, duration: 0.8 }, "-=0.4")
                  .from(".hero-sub", { opacity: 0, duration: 0.6 }, "-=0.3")
                  .from(".hero-buttons", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2");
          } catch(e) {
            // If GSAP fails, make everything visible immediately
            document.querySelectorAll(
              '.hero-hindi, .hero-title, .hero-sub, .hero-buttons, .curtain-panel'
            ).forEach(el => {
              el.style.opacity = '1';
              el.style.transform = 'none';
              el.style.visibility = 'visible';
            });
            document.querySelector('.curtain-container')?.remove();
            document.body.style.overflow = 'auto';
            document.body.style.overflowX = 'hidden';
          }
        }
      });

      tl.to('.curtain-logo', { opacity: 0, duration: 0.5, ease: 'power2.out', delay: 0.3 })
        .to('.curtain-left', { xPercent: -100, duration: 1.2, ease: 'power3.inOut' }, '-=0.2')
        .to('.curtain-right', { xPercent: 100, duration: 1.2, ease: 'power3.inOut' }, '<')
        .to('.curtain-container', { opacity: 0, duration: 0.2 }, '-=0.2');
    } else {
      // If no curtain, trigger hero animations immediately
      const heroTl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = 'auto';
          document.body.style.overflowX = 'hidden';
        }
      });
      heroTl.from(".hero-badge", { opacity: 0, y: -20, duration: 0.5 })
            .from(".hero-hindi", { opacity: 0, y: 30, duration: 0.7 }, "-=0.2")
            .from(".hero-title", { opacity: 0, y: 40, duration: 0.8 }, "-=0.4")
            .from(".hero-sub", { opacity: 0, duration: 0.6 }, "-=0.3")
            .from(".hero-buttons", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2");
    }
  } catch(e) {
    // If GSAP fails, make everything visible immediately
    document.querySelectorAll(
      '.hero-hindi, .hero-title, .hero-sub, .hero-buttons, .curtain-panel'
    ).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
    document.querySelector('.curtain-container')?.remove();
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
  }
});



// 🎟️ TYPED.JS HERO TYPEWRITER
const typedElement = document.getElementById('typed-hero');
if (typedElement && NOW_SHOWING.length > 0) {
  const titlesStr = NOW_SHOWING.map(m => m.title).join(' • ');
  new Typed('#typed-hero', {
    strings: [
      `Now Showing: ${titlesStr}`,
      '⚡ Experience the Magic of Dolby Sound & Rebuilt Seating!',
      '👨‍👩‍👧 Perfect Morning & Matinee Shows for the Family!',
      '🎟️ Gola Bazar\'s Own Reborn Cinema Destination!'
    ],
    typeSpeed: 40,
    backSpeed: 20,
    backDelay: 2500,
    loop: true,
    showCursor: true,
    cursorChar: '_'
  });
}

// 🍿 Helpers for Poster Gradient Area Redesign
const getGradient = (id) => {
  if (id === 'chhaava') {
    return 'linear-gradient(160deg, #4a0000 0%, #8B0000 40%, #2d0000 100%)';
  } else if (id === 'sky-force') {
    return 'linear-gradient(160deg, #001433 0%, #002D6B 40%, #000A1A 100%)';
  } else if (id === 'sikandar') {
    return 'linear-gradient(160deg, #1a1000 0%, #3D2800 40%, #0d0800 100%)';
  }
  return 'linear-gradient(160deg, #16161A 0%, #222226 100%)';
};

const getWatermark = (id) => {
  if (id === 'chhaava') return 'छत्रपती';
  if (id === 'sky-force') return 'SKY';
  if (id === 'sikandar') return 'SIKANDAR';
  return 'MOVIE';
};

// 🍿 RENDER DYNAMIC MOVIE DATA

// 1. Marquee Scrolling text in header/under-hero
const marqueeText = document.getElementById('marquee-scroller-text');
if (marqueeText && NOW_SHOWING.length > 0) {
  // Ordered sequence requested: SKY FORCE -> SIKANDAR -> CHHAAVA
  const orderedList = ['sky-force', 'sikandar', 'chhaava'];
  const sortedMovies = [...NOW_SHOWING].sort((a, b) => orderedList.indexOf(a.id) - orderedList.indexOf(b.id));
  const textStr = sortedMovies.map(m => `🎬 ${m.title.toUpperCase()} (${m.language.toUpperCase()}) NOW SHOWING`).join(' • ') + ' • ';
  marqueeText.innerHTML = (textStr + textStr + textStr).repeat(2);
}

// 2. Today's Shows on index.html
const todayShowsGrid = document.getElementById('today-shows-grid');
if (todayShowsGrid) {
  const movies = [
    {
      title: "Chhaava",
      language: "Hindi",
      genre: "Action / Historical",
      duration: "2h 41m",
      certificate: "U/A",
      rating: "8.1",
      gradient: "linear-gradient(160deg, #4a0000 0%, #8B0000 40%, #2d0000 100%)",
      shows: ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
      bmsLink: "https://in.bookmyshow.com/explore/movies-gorakhpur"
    },
    {
      title: "Sky Force",
      language: "Hindi",
      genre: "Action / War",
      duration: "2h 25m",
      certificate: "U/A",
      rating: "7.9",
      gradient: "linear-gradient(160deg, #001433 0%, #002D6B 40%, #000A1A 100%)",
      shows: ["11:00 AM", "02:00 PM", "05:00 PM", "08:00 PM"],
      bmsLink: "https://in.bookmyshow.com/explore/movies-gorakhpur"
    },
    {
      title: "Sikandar",
      language: "Hindi",
      genre: "Action / Drama",
      duration: "2h 30m",
      certificate: "U/A",
      rating: "7.5",
      gradient: "linear-gradient(160deg, #1a1000 0%, #3D2800 40%, #0d0800 100%)",
      shows: ["12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM"],
      bmsLink: "https://in.bookmyshow.com/explore/movies-gorakhpur"
    }
  ];

  todayShowsGrid.innerHTML = movies.map(movie => `
    <div class="bg-bg-card tilt-card glow-card rounded-2xl overflow-hidden">

      <!-- Poster Area -->
      <div style="height:280px; background:${movie.gradient};
        position:relative; display:flex; align-items:center;
        justify-content:center;">
        <span style="font-family:'Bebas Neue',sans-serif; font-size:32px;
          color:rgba(255,255,255,0.15); letter-spacing:3px;">
          ${movie.title}
        </span>
        <span style="position:absolute; top:12px; left:12px;
          background:rgba(0,0,0,0.5); color:white; font-size:11px;
          font-weight:700; padding:3px 10px; border-radius:4px;
          letter-spacing:1px;">
          ${movie.language}
        </span>
        <span style="position:absolute; top:12px; right:12px;
          background:rgba(0,0,0,0.5); color:white; font-size:11px;
          font-weight:700; padding:3px 10px; border-radius:4px;">
          ${movie.certificate}
        </span>
      </div>

      <!-- Card Body -->
      <div class="p-6 flex flex-col gap-4">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-anton text-xl text-white uppercase tracking-wide">
            ${movie.title}
          </h3>
          <span class="bg-primary text-white text-[10px] font-bold px-2.5 py-1
            rounded shrink-0 tracking-wide uppercase">
            ${movie.genre}
          </span>
        </div>

        <p class="text-text-secondary text-xs font-sans">
          ${movie.language} | ${movie.duration} | Rating: ${movie.certificate}
        </p>

        <div class="flex items-center gap-1 text-accent text-sm font-bold">
          ★ <span>${movie.rating}</span>
        </div>

        <div>
          <p class="text-[11px] font-bold text-text-muted uppercase
            tracking-widest mb-2 font-sans">Show Timings</p>
          <div class="flex flex-wrap gap-2">
            ${movie.shows.map(t => `
              <span class="bg-white/[0.06] border border-white/10
                hover:border-primary hover:text-white text-text-secondary
                text-xs font-mono px-3 py-1.5 rounded-md cursor-pointer
                transition-colors">
                ${t}
              </span>
            `).join('')}
          </div>
        </div>

        <a href="${movie.bmsLink}" target="_blank" rel="noopener noreferrer"
          class="w-full bg-primary hover:bg-primary-dark text-white font-bold
          py-3.5 rounded-xl text-sm text-center transition-colors
          flex items-center justify-center gap-2 mt-2">
          🎟 Book on BookMyShow
        </a>
      </div>
    </div>
  `).join('');
}

// 3. Featured Movie Banner on index.html
const featuredSection = document.getElementById('featured-movie-section');
if (featuredSection && NOW_SHOWING.length > 0) {
  // Use first movie (Chhaava) as featured
  const fm = NOW_SHOWING[0];
  featuredSection.innerHTML = `
    <div class="w-full max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-12 items-center">
      <!-- Left side: 40% width poster -->
      <div class="w-full lg:w-[40%] shrink-0">
        <div class="relative w-full h-[480px] rounded-[20px] overflow-hidden flex items-center justify-center" style="background: ${getGradient(fm.id)}">
          <!-- Watermark -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] text-white font-bold text-7xl font-sans uppercase">
            ${getWatermark(fm.id)}
          </div>
          <!-- Faint text title -->
          <div class="text-center px-6">
            <span class="text-white font-bebas text-6xl uppercase tracking-wide">${fm.title}</span>
          </div>
          <!-- Bleed overlay on the right edge -->
          <div class="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#0F0F11]"></div>
        </div>
      </div>
      
      <!-- Right side: 60% width content -->
      <div class="w-full lg:w-[60%] text-left space-y-6">
        <div>
          <span class="text-[11px] font-bold font-sans tracking-[3px] text-primary block uppercase">
            FEATURED SCREENING
          </span>
          <h2 class="text-5xl md:text-7xl font-anton text-accent uppercase leading-none mt-2">
            ${fm.title}
          </h2>
        </div>
        
        <!-- Tags -->
        <div class="flex flex-wrap gap-2.5">
          <span class="bg-white/[0.08] border border-white/10 text-white font-sans text-xs font-semibold px-3.5 py-1.5 rounded-md">
            ${fm.language}
          </span>
          <span class="bg-white/[0.08] border border-white/10 text-white font-sans text-xs font-semibold px-3.5 py-1.5 rounded-md">
            ${fm.duration}
          </span>
          <span class="bg-white/[0.08] border border-white/10 text-white font-sans text-xs font-semibold px-3.5 py-1.5 rounded-md">
            ${fm.genre}
          </span>
        </div>
        
        <!-- Synopsis -->
        <p class="text-text-secondary text-sm md:text-base leading-[1.8]">
          ${fm.synopsis}
        </p>
        
        <!-- Buttons -->
        <div class="pt-4 flex flex-col sm:flex-row gap-4">
          <a href="${fm.bmsLink}" target="_blank" rel="noopener noreferrer" class="bg-primary hover:bg-primary-dark text-white font-sans font-bold text-sm py-4 px-8 rounded-[10px] text-center flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
            🎟️ Book on BookMyShow
          </a>
          <a href="#today-shows" class="bg-transparent hover:bg-white/[0.05] border border-white/20 hover:border-white/50 text-white font-sans font-bold text-sm py-4 px-8 rounded-[10px] text-center">
            View Showtimes
          </a>
        </div>
      </div>
    </div>
  `;
}

// 4. Movies page Grid on now-showing.html
const nowShowingPageGrid = document.getElementById('now-showing-page-grid');
if (nowShowingPageGrid) {
  // Convert nowShowingPageGrid to use the same premium cards 3-column grid structure
  nowShowingPageGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left tilt-card-container";
  
  if (NOW_SHOWING.length > 0) {
    nowShowingPageGrid.innerHTML = NOW_SHOWING.map(movie => `
      <div class="movie-card tilt-card glow-card rounded-2xl overflow-hidden flex flex-col justify-between h-full group">
        <div>
          <!-- Poster Area -->
          <div class="relative w-full h-[320px] flex items-center justify-center overflow-hidden shrink-0" style="background: ${getGradient(movie.id)}">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] text-white font-bold text-7xl font-sans uppercase">
              ${getWatermark(movie.id)}
            </div>
            <div class="absolute top-4 left-4 bg-black/60 border border-white/10 text-white font-sans font-bold text-[10px] px-2.5 py-1 rounded">
              ${movie.language.toUpperCase()}
            </div>
            <div class="absolute top-4 right-4 bg-primary text-white font-sans font-bold text-[10px] px-2.5 py-1 rounded">
              ${movie.rating.toUpperCase()}
            </div>
            <div class="relative z-10 text-center px-4">
              <h3 class="text-white font-bebas text-4xl uppercase tracking-wide drop-shadow-md">
                ${movie.title}
              </h3>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-6 flex flex-col gap-3">
            <div class="flex items-center justify-between gap-2">
              <h4 class="text-xl font-bold font-sans text-white truncate">${movie.title}</h4>
              <span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">${movie.genre}</span>
            </div>
            
            <p class="text-xs text-text-secondary font-medium">
              ${movie.language} • ${movie.duration} • ${movie.rating}
            </p>
            
            <div class="flex items-center gap-1 text-accent font-bold text-sm">
              <span>★</span>
              <span>${movie.ratingValue || '8.1'}</span>
              <span class="text-text-muted text-xs font-normal">/ 10</span>
            </div>
            
            <p class="text-sm text-text-secondary/90 leading-relaxed mt-2 line-clamp-3">${movie.synopsis}</p>
            
            <div class="border-t border-white/5 my-2"></div>
            
            <div>
              <p class="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Available Shows</p>
              <div class="flex flex-wrap gap-2">
                ${movie.shows.map(show => `<span class="text-xs font-mono px-3 py-1.5 rounded bg-white/[0.06] border border-white/10 text-text-secondary">${show.time}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 pt-0">
          <a href="${movie.bmsLink}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-[10px] transition-colors text-sm">
            🎟️ Book on BookMyShow
          </a>
        </div>
      </div>
    `).join('');
  } else {
    nowShowingPageGrid.innerHTML = `<div class="text-center py-12 text-text-secondary col-span-full">No movies showing currently. Please check back later.</div>`;
  }
}

// 5. Upcoming movies on now-showing.html
const upcomingPageGrid = document.getElementById('upcoming-page-grid');
if (upcomingPageGrid && UPCOMING_MOVIES.length > 0) {
  upcomingPageGrid.innerHTML = UPCOMING_MOVIES.map(movie => `
    <div class="bg-bg-card tilt-card glow-card rounded-2xl overflow-hidden p-4 flex flex-col group text-left">
      <div class="relative overflow-hidden rounded-xl aspect-[3/4] bg-neutral-950 mb-4">
        <img src="${movie.poster}" alt="${movie.title}" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span class="bg-accent text-neutral-950 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-widest shadow-lg">COMING SOON</span>
        </div>
      </div>
      <h4 class="text-xl font-bold font-bebas text-white tracking-wide mb-1 group-hover:text-accent transition-colors duration-300">${movie.title}</h4>
      <div class="flex justify-between items-center text-xs text-text-secondary">
        <span>${movie.language} • ${movie.genre}</span>
        <span class="text-accent font-bold">${movie.releaseDate}</span>
      </div>
    </div>
  `).join('');
}

// 6. Showtimes Table on showtimes.html
const showtimesTableBody = document.getElementById('showtimes-table-body');
if (showtimesTableBody && NOW_SHOWING.length > 0) {
  let tableHTML = '';
  NOW_SHOWING.forEach(movie => {
    movie.shows.forEach((show, index) => {
      let statusBadge = '<span class="bg-green-950/40 text-green-400 border border-green-800/40 text-xs font-bold px-3 py-1 rounded-full">Available</span>';
      if (show.status === 'Almost Full') {
        statusBadge = '<span class="bg-red-950/40 text-red-400 border border-primary/40 text-xs font-bold px-3 py-1 rounded-full">Almost Full</span>';
      } else if (show.status === 'Filling Fast') {
        statusBadge = '<span class="bg-yellow-950/40 text-yellow-400 border border-accent/40 text-xs font-bold px-3 py-1 rounded-full">Filling Fast</span>';
      }

      tableHTML += `
        <tr class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-200">
          <td class="px-6 py-4 font-bold text-white max-w-xs md:max-w-none truncate font-sans">${index === 0 ? movie.title : `<span class="opacity-20">${movie.title}</span>`}</td>
          <td class="px-6 py-4 font-semibold text-accent font-mono text-[13px]">${show.time}</td>
          <td class="px-6 py-4 text-xs font-medium text-text-secondary font-sans">${movie.language}</td>
          <td class="px-6 py-4 font-sans">${statusBadge}</td>
          <td class="px-6 py-4 text-right font-sans">
            <a href="${movie.bmsLink}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold py-2.5 px-4 rounded-md transition-all duration-300 transform hover:-translate-y-0.5 shadow-md">
              🎟️ Book
            </a>
          </td>
        </tr>
      `;
    });
  });
  showtimesTableBody.innerHTML = tableHTML;
}

// 🍿 SWIPER CAROUSEL (Testimonials)
const swiperContainer = document.querySelector('.testimonials-swiper');
if (swiperContainer) {
  new Swiper('.testimonials-swiper', {
    modules: [Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      }
    }
  });
}

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  // Open first item by default
  if (faqItems.length > 0) {
    const firstContent = faqItems[0].querySelector('.faq-accordion-content');
    const firstIcon = faqItems[0].querySelector('.faq-accordion-icon');
    const firstTrigger = faqItems[0].querySelector('.faq-accordion-trigger');
    if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    if (firstIcon) firstIcon.textContent = '−';
    if (firstTrigger) firstTrigger.classList.add('text-accent');
  }

  // Click handler for all items
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    const content = item.querySelector('.faq-accordion-content');
    const icon = item.querySelector('.faq-accordion-icon');

    trigger.addEventListener('click', () => {
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      // Close all
      faqItems.forEach((el) => {
        el.querySelector('.faq-accordion-content').style.maxHeight = '0px';
        el.querySelector('.faq-accordion-icon').textContent = '+';
        el.querySelector('.faq-accordion-trigger').classList.remove('text-accent');
        el.classList.remove('border-primary/40');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−';
        trigger.classList.add('text-accent');
        item.classList.add('border-primary/40');
      }
    });
  });
});

// 🍿 STICKY GLASS HEADER & FLOATING ARROW LOGIC
const header = document.querySelector('header');
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (header) {
    if (window.scrollY > 80) {
      header.classList.add('glass-header');
    } else {
      header.classList.remove('glass-header');
    }
  }

  if (backToTopBtn) {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 🍿 MOBILE MENU TRIGGER
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    document.body.classList.toggle('overflow-hidden');
  });

  // Close menu when clicking links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    });
  });
}

// 🍿 GSAP GENERAL SCROLLTRIGGERS
gsap.utils.toArray('.animate-on-scroll').forEach(el => {
  gsap.from(el, {
    y: 35,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none reverse'
    }
  });
});

// Stagger triggers on page elements
const screeningTrigger = document.querySelector('#now-screening');
if (screeningTrigger) {
  gsap.from(".movie-card", {
    scrollTrigger: { trigger: "#now-screening", start: "top 80%" },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.7,
    ease: "power3.out"
  });
}

const experienceTrigger = document.querySelector('#the-experience');
if (experienceTrigger) {
  gsap.from(".feature-card", {
    scrollTrigger: { trigger: "#the-experience", start: "top 80%" },
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out"
  });
}

ScrollTrigger.addEventListener('refresh', () => {
  document.querySelectorAll('.feature-card').forEach(el => {
    if (el.style.opacity === '0') {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  });
});

const statsTrigger = document.querySelector('.stats-row');
if (statsTrigger) {
  gsap.from(".stat-item", {
    scrollTrigger: { trigger: ".stats-row", start: "top 85%" },
    opacity: 0,
    y: 20,
    stagger: 0.12,
    duration: 0.5
  });
}

const faqTrigger = document.querySelector('#faq');
if (faqTrigger) {
  gsap.from(".faq-accordion-item", {
    scrollTrigger: { trigger: "#faq", start: "top 80%" },
    opacity: 0,
    x: -30,
    stagger: 0.08,
    duration: 0.5
  });
}

// 🎬 3D TILT EFFECT FOR TILT-CARDS
const init3DTilt = () => {
  document.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.tilt-card');
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((centerY - y) / centerY) * 10; // 10 degrees max rotation
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });
  
  document.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.tilt-card');
    if (!card) return;
    if (!card.contains(e.relatedTarget)) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  });
};

init3DTilt();
