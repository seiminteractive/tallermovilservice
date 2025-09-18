<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, type GlobalThemeOverrides, NIcon, NBackTop, NCarousel, NCard } from 'naive-ui'
import { LogoWhatsapp, MailOutline, LocationOutline, LogoInstagram, LogoFacebook } from '@vicons/ionicons5'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Import images
import logoUrl from './assets/logo.webp'
import heroImageUrl from './assets/Lucid_Realism_A_hyperrealistic_wideangle_photograph_of_a_spaci_3.jpg'
import cortinaRoller3Url from './assets/cortina-roller-3.jpg'
import cortinasRoller1Url from './assets/cortinas-roller-1.png'
import cortinasRoller2Url from './assets/cortinas-roller-2.jpg'
import persianasMaderaUrl from './assets/persianas-de-madera.png'
import logoSeimUrl from './assets/logo-seim-interactive.png'

gsap.registerPlugin(ScrollTrigger)

// Modo de color fijo (no depender del sistema)

const isScrolled = ref(false)
const activeSection = ref('inicio')

function handleScroll() {
  isScrolled.value = window.scrollY > 50
  
  // Detectar sección activa
  const sections = ['inicio', 'servicios', 'testimonios', 'contacto']
  const scrollPosition = window.scrollY + 100
  
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY
      const elementBottom = elementTop + rect.height
      
      if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
        activeSection.value = sectionId
        break
      }
    }
  }
}

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#F4AC22',
    primaryColorHover: '#E0991A',
    primaryColorPressed: '#CE8D16',
    infoColor: '#2F80ED',
    successColor: '#27AE60',
    errorColor: '#E63946'
  }
}

const whatsappMain = '5493416405980'
const whatsappPorteros = '5493416298496'

// Opiniones dinámicas cargadas desde archivo JSON
type Review = {
  id: number
  name: string
  role: string
  stars: number
  text: string
  date: string
  verified: boolean
  source: string
  recent: boolean
}

const googleReviews = ref<Review[]>([])
const reviewsData = ref<{ lastUpdated: string; totalReviews: number; averageRating: number }>({
  lastUpdated: '',
  totalReviews: 0,
  averageRating: 0
})

// Variables para sliders
const currentServiceSlide = ref(0)
const currentTestimonialSlide = ref(0)

// Variables para animaciones de números
type StatsKeys = 'inmobiliarias' | 'confianza' | 'disponibilidad' | 'reviews' | 'rating' | 'años'
const animatedNumbers = ref<Record<StatsKeys, number>>({
  inmobiliarias: 0,
  confianza: 0,
  disponibilidad: 0,
  reviews: 0,
  rating: 0,
  años: 0
})

// Variables para menú hamburguesa
const isMobileMenuOpen = ref(false)

// Función para animar múltiples números
const animateNumbers = (targets: Partial<Record<StatsKeys, number>>): void => {
  for (const key in targets) {
    const k = key as StatsKeys
    const target = (targets[k] ?? 0) as number
    const duration = 2000
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = target * easeOut

      if (k === 'rating') {
        animatedNumbers.value[k] = Number(current.toFixed(1))
      } else {
        animatedNumbers.value[k] = Math.floor(current)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }
}

// Opiniones de fallback (por si falla la carga)
const fallbackReviews: Review[] = [
  {
    id: 1,
    name: 'María González',
    role: 'Administradora de Consorcio',
    stars: 5,
    text: 'Excelente atención y muy prolijos. Solucionaron el problema de la persiana en tiempo récord. Los recomiendo sin dudas.',
    date: '2025-01-15',
    verified: true,
    source: 'Google',
    recent: true
  },
  {
    id: 2,
    name: 'Julián Pérez',
    role: 'Propietario Local',
    stars: 5,
    text: 'Solucionaron rápido la persiana del local. Muy profesionales y con precios justos. El servicio a domicilio es excelente.',
    date: '2025-01-12',
    verified: true,
    source: 'Google',
    recent: true
  },
  {
    id: 3,
    name: 'Rocío López',
    role: 'Particular',
    stars: 5,
    text: 'Buen precio y seriedad, recomendados. El servicio a domicilio es excelente y cumplieron con los tiempos acordados.',
    date: '2025-01-10',
    verified: true,
    source: 'Google',
    recent: true
  }
]

// Enlace directo a Google My Business
const googleMyBusinessUrl = 'https://www.google.com/search?q=Taller+Movil+Service+Rosario+reseñas'

const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'contacto', label: 'Contacto' }
]

// const name = ref('')
// const message = ref('')

function openWhatsApp(number: string, text: string) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Función para cargar opiniones desde archivo JSON
async function loadReviews() {
  try {
    const response = await fetch('/reviews.json')
    const data = await response.json()
    
    googleReviews.value = data.reviews || []
    reviewsData.value = {
      lastUpdated: data.lastUpdated,
      totalReviews: data.totalReviews,
      averageRating: data.averageRating
    }
    
    console.log('✅ Opiniones cargadas desde archivo JSON')
    console.log(`📊 Total: ${data.totalReviews}, Promedio: ${data.averageRating}`)
  } catch (error) {
    console.error('❌ Error al cargar opiniones:', error)
    // Usar opiniones de fallback
    googleReviews.value = fallbackReviews
    reviewsData.value = {
      lastUpdated: new Date().toISOString(),
      totalReviews: fallbackReviews.length,
      averageRating: 5.0
    }
    console.log('🔄 Usando opiniones de fallback')
  }
}

// (formatLastUpdated) removido por no utilizarse

// Computed para las opiniones a mostrar (ya vienen filtradas del backend)
const displayedReviews = computed<Review[]>(() => {
  // Las opiniones ya vienen filtradas por 4+ estrellas y limitadas a 3 desde el script
  return googleReviews.value.slice(0, 3)
})

// (fetchRealGoogleReviews / updateReviews) removidos por no utilizarse

const years = ref(0)

onMounted(() => {
  // GSAP Animations
  gsap.utils.toArray<HTMLElement>('.animate-on-scroll').forEach((el, index) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power2.out',
      delay: index * 0.1,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    })
  })

  // Counter animation
  gsap.fromTo(years, { value: 0 }, {
    value: 20,
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: '#stats', start: 'top 80%' },
    onUpdate: () => { years.value = Number((years.value as unknown as number)) }
  })

  // Animar números de colaboraciones
  ScrollTrigger.create({
    trigger: '.collaboration-stats',
    start: 'top 80%',
    onEnter: () => {
      animateNumbers({
        inmobiliarias: 30,
        confianza: 100
      })
    }
  })
  
        // Animar números de testimonios
        ScrollTrigger.create({
          trigger: '.testimonials-stats',
          start: 'top 80%',
          onEnter: () => {
            animateNumbers({
              reviews: 342,
              rating: 4.8,
              años: 20
            })
          }
        })
        
        // Animar servicios desde los costados
        ScrollTrigger.batch('.service-animate-left', {
          onEnter: (elements) => {
            elements.forEach((element) => {
              element.classList.add('animate-in')
            })
          },
          start: 'top 85%',
          end: 'bottom 15%'
        })
        
        ScrollTrigger.batch('.service-animate-right', {
          onEnter: (elements) => {
            elements.forEach((element) => {
              element.classList.add('animate-in')
            })
          },
          start: 'top 85%',
          end: 'bottom 15%'
        })

  // Parallax effect for hero image
  gsap.to('.hero-image', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })

  window.addEventListener('scroll', handleScroll)
  handleScroll()
  
  // Cargar opiniones desde archivo JSON
  loadReviews()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <NConfigProvider :theme="null" :theme-overrides="themeOverrides">
    <NDialogProvider>
      <NMessageProvider>
        <!-- Navigation -->
        <nav class="nav" :class="{ 'nav--scrolled': isScrolled }">
          <div class="container-wide">
            <div class="nav-content">
              <div class="nav-brand">
                <div class="nav-logo-container logo-pill">
                  <img :src="logoUrl" alt="Taller Móvil Service" class="nav-logo" />
                </div>
                <div class="nav-brand-text">
                  <span class="nav-title">Taller Móvil Service</span>
                  <span class="nav-subtitle">Especialistas en Persianas</span>
                </div>
              </div>
              
                     <div class="nav-menu">
                       <a v-for="section in sections" :key="section.id" :href="'#' + section.id" 
                          :class="['nav-link', { 'nav-link--active': activeSection === section.id }]">
                         {{ section.label }}
                       </a>
                     </div>
              
              <div class="nav-actions">
                <!-- Botón de contacto para desktop -->
                <a href="#contacto" class="nav-contact-btn nav-contact-btn-desktop">
                  <NIcon><LogoWhatsapp /></NIcon>
                  <span>Contacto</span>
                </a>
                
                <!-- Menú hamburguesa para mobile -->
                <button @click="toggleMobileMenu" class="nav-hamburger-btn">
                  <div class="hamburger-icon" :class="{ 'active': isMobileMenuOpen }">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <!-- Menú móvil - Solo visible en mobile -->
        <div class="mobile-menu" :class="{ 'mobile-menu--open': isMobileMenuOpen }">
          <div class="mobile-menu-overlay" @click="closeMobileMenu"></div>
          <div class="mobile-menu-content">
            <div class="mobile-menu-header">
              <h3>Menú</h3>
              <button @click="closeMobileMenu" class="mobile-menu-close">×</button>
            </div>
            <nav class="mobile-menu-nav">
              <a v-for="section in sections" :key="section.id" :href="'#' + section.id" 
                 @click="closeMobileMenu"
                 class="mobile-menu-link">
                {{ section.label }}
              </a>
              <a :href="'https://wa.me/' + whatsappMain" target="_blank" @click="closeMobileMenu" class="mobile-menu-whatsapp">
                <NIcon><LogoWhatsapp /></NIcon>
                <span>Contacto WhatsApp</span>
              </a>
            </nav>
          </div>
        </div>

        <main>
          <!-- Hero Fullscreen -->
          <section id="inicio" class="fullscreen-section hero-fullscreen">
            <div class="fullscreen-image">
              <img :src="heroImageUrl" alt="Servicios profesionales de persianas y cortinas" />
            </div>
            <div class="fullscreen-overlay"></div>
            <div class="fullscreen-content">
              <h1 class="text-display mb-6">Líderes en <span class="text-gradient">Reparación</span> y <span class="text-gradient">Motorización</span></h1>
              <p class="text-body-lg mb-8 opacity-90">Servicio profesional para persianas y cortinas roller en Rosario y alrededores.</p>
              <div class="hero-actions text-center">
                <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero hacer una consulta sobre sus servicios. Vengo desde la web.')" class="btn btn-primary btn-xl">
                  <NIcon><LogoWhatsapp /></NIcon>
                  Pedir asesoramiento
                </button>
              </div>
            </div>
          </section>

          <!-- Intro Text Section (solo texto debajo del hero) -->
          <section id="servicios" class="section">
            <div class="container">
              <div class="text-center animate-on-scroll">
                <h2 class="text-heading-1 mb-4">Soluciones <span class="text-gradient">integrales</span> para <span class="text-gradient">persianas</span> y <span class="text-gradient">roller</span></h2>
                <p class="text-body-lg text-secondary mb-6">Instalación, reparación y motorización con atención rápida, garantía y trato profesional.</p>
              </div>
            </div>
          </section>

          <!-- Slider elegante de servicios para mobile -->
          <div class="services-mobile-container">
            <NCarousel 
              :current-slide="currentServiceSlide"
              @update:current-slide="currentServiceSlide = $event"
              :show-dots="true"
              :dot-type="'line'"
              :dot-placement="'bottom'"
              :autoplay="true"
              :autoplay-speed="2500"
              :slides-per-view="1"
              :space-between="0"
              :centered-slides="false"
              :loop="true"
              :effect="'slide'"
              :speed="500"
              class="services-carousel"
            >
              <!-- Slide 1: Cortinas Roller -->
              <div class="service-carousel-slide">
                <div class="service-slide-image">
                  <img :src="cortinasRoller1Url" alt="Servicio de reparación de cortinas roller" />
                </div>
                <div class="service-slide-content">
                    <div class="service-content-redesign">
                      <div class="service-header">
                        <h3 class="service-title">Reparación de Cortinas Roller</h3>
                        <div class="service-subtitle">Especialistas en soluciones integrales</div>
                      </div>
                    <div class="service-description">
                      <p class="description-text">Ajuste de mecanismos, cambio de telas y mantenimiento profesional para extender la vida útil de tus cortinas roller. Soluciones técnicas con garantía completa y atención personalizada.</p>
                    </div>
                    <div class="service-cta">
                      <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero reparar mis cortinas roller.')" class="btn btn-primary btn-lg btn-service">
                        <span class="btn-text">Solicitar Reparación</span>
                        <span class="btn-icon">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Slide 2: Persianas -->
              <div class="service-carousel-slide">
                <div class="service-slide-image">
                  <img :src="cortinasRoller2Url" alt="Servicio de reparación de persianas" />
                </div>
                <div class="service-slide-content">
                    <div class="service-content-redesign">
                      <div class="service-header">
                        <h3 class="service-title">Reparación de Persianas</h3>
                        <div class="service-subtitle">Soluciones técnicas especializadas</div>
                      </div>
                    <div class="service-description">
                      <p class="description-text">Reparación especializada de persianas de aluminio, madera y PVC. Ajuste de cintas, cambio de lamas y mantenimiento completo para mantener la funcionalidad óptima.</p>
                    </div>
                    <div class="service-cta">
                      <button @click="openWhatsApp(whatsappMain, 'Hola! Necesito reparar mis persianas.')" class="btn btn-primary btn-lg btn-service">
                        <span class="btn-text">Solicitar Reparación</span>
                        <span class="btn-icon">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Slide 3: Persianas de Madera -->
              <div class="service-carousel-slide">
                <div class="service-slide-image">
                  <img :src="persianasMaderaUrl" alt="Servicio de reparación de persianas de madera" />
                </div>
                <div class="service-slide-content">
                    <div class="service-content-redesign">
                      <div class="service-header">
                        <h3 class="service-title">Reparación de Persianas de Madera</h3>
                        <div class="service-subtitle">Arte y técnica tradicional</div>
                      </div>
                    <div class="service-description">
                      <p class="description-text">Restauración y reparación de persianas de madera con técnicas tradicionales. Pulido, barnizado y ajuste de mecanismos para conservar la belleza y funcionalidad de tus persianas.</p>
                    </div>
                    <div class="service-cta">
                      <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero reparar mis persianas de madera.')" class="btn btn-primary btn-lg btn-service">
                        <span class="btn-text">Solicitar Reparación</span>
                        <span class="btn-icon">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Slide 4: Motorización -->
              <div class="service-carousel-slide">
                <div class="service-slide-image">
                  <img :src="cortinaRoller3Url" alt="Servicio de motorización de persianas y cortinas roller" />
                </div>
                <div class="service-slide-content">
                    <div class="service-content-redesign">
                      <div class="service-header">
                        <h3 class="service-title">Motorización de Persianas y Cortinas Roller</h3>
                        <div class="service-subtitle">Automatización inteligente</div>
                      </div>
                    <div class="service-description">
                      <p class="description-text">Instalación de motores para automatizar persianas y cortinas roller. Control remoto, programación horaria y integración con sistemas inteligentes para mayor comodidad.</p>
                    </div>
                    <div class="service-cta">
                      <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero motorizar mis persianas/cortinas.')" class="btn btn-primary btn-lg btn-service">
                        <span class="btn-text">Solicitar Motorización</span>
                        <span class="btn-icon">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </NCarousel>
          </div>

          <!-- Sección alternada 1: Texto izquierda / Imagen derecha -->
          <section class="alternating-section">
            <div class="halfscreen-section service-animate-left">
              <div class="halfscreen-content halfscreen-content-left">
                <div class="service-content-redesign">
                  <!-- Header Section -->
                  <div class="service-header">
                    <div class="service-category">
                      <span class="category-icon">🏠</span>
                      <span class="category-text">Servicio a Domicilio</span>
                    </div>
                    <h3 class="service-title">Reparación de Cortinas Roller</h3>
                    <div class="service-subtitle">Especialistas en soluciones integrales</div>
                  </div>

                  <!-- Description Section -->
                  <div class="service-description">
                    <p class="description-text">Ajuste de mecanismos, cambio de telas y mantenimiento profesional para extender la vida útil de tus cortinas roller. Soluciones técnicas con garantía completa y atención personalizada.</p>
                  </div>

                  <!-- Features Grid -->
                  <div class="service-features-grid">
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🔧</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Motor y Cadena</h4>
                        <p class="feature-desc">Reparación completa</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🧼</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Limpieza</h4>
                        <p class="feature-desc">Y calibración</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🎨</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Cambio de Telas</h4>
                        <p class="feature-desc">Amplia variedad</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">⚡</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Mantenimiento</h4>
                        <p class="feature-desc">Preventivo</p>
                      </div>
                    </div>
                  </div>

                  <!-- Benefits Section -->
                  <div class="service-benefits-section">
                    <div class="benefit-highlight">
                      <div class="benefit-item">
                        <div class="benefit-icon">🛡️</div>
                        <span>Garantía de 6 meses</span>
                      </div>
                      <div class="benefit-item">
                        <div class="benefit-icon">⭐</div>
                        <span>Materiales originales</span>
                      </div>
                    </div>
                  </div>

                  <!-- CTA Section -->
                  <div class="service-cta">
                    <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero reparar mis cortinas roller.')" class="btn btn-primary btn-lg btn-service">
                      <span class="btn-text">Solicitar Reparación</span>
                      <span class="btn-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="halfscreen-image">
                <img :src="cortinasRoller1Url" alt="Servicio de reparación de cortinas roller" />
              </div>
            </div>
          </section>

          <!-- Sección alternada 2: Imagen izquierda / Texto derecha (usar mismo orden y dejar que el CSS invierta) -->
          <section class="alternating-section">
            <div class="halfscreen-section service-animate-right">
              <div class="halfscreen-content halfscreen-content-right">
                <div class="service-content-redesign">
                  <!-- Header Section -->
                  <div class="service-header">
                    <div class="service-category service-category-left">
                      <span class="category-icon">⚡</span>
                      <span class="category-text">Atención Rápida</span>
                    </div>
                    <h3 class="service-title">Reparación de Persianas</h3>
                    <div class="service-subtitle">Soluciones técnicas especializadas</div>
                  </div>

                  <!-- Description Section -->
                  <div class="service-description">
                    <p class="description-text">Cambio de flejes, cintas y ejes con atención especializada. Soluciones rápidas para persianas trabadas o que hacen ruido. Diagnóstico gratuito y presupuesto sin compromiso.</p>
                  </div>

                  <!-- Features Grid -->
                  <div class="service-features-grid">
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">⚙️</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Componentes</h4>
                        <p class="feature-desc">Reemplazo completo</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">⏱️</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Atención</h4>
                        <p class="feature-desc">En el día</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🔧</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Flejes y Cintas</h4>
                        <p class="feature-desc">Especializados</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🏠</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">A Domicilio</h4>
                        <p class="feature-desc">Servicio completo</p>
                      </div>
                    </div>
                  </div>

                  <!-- Benefits Section -->
                  <div class="service-benefits-section">
                    <div class="benefit-highlight">
                      <div class="benefit-item">
                        <div class="benefit-icon">🔍</div>
                        <span>Diagnóstico gratuito</span>
                      </div>
                      <div class="benefit-item">
                        <div class="benefit-icon">📋</div>
                        <span>Presupuesto sin compromiso</span>
                      </div>
                    </div>
                  </div>

                  <!-- CTA Section -->
                  <div class="service-cta">
                    <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero reparar mis persianas.')" class="btn btn-primary btn-lg btn-service">
                      <span class="btn-text">Pedir Turno</span>
                      <span class="btn-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="halfscreen-image">
                <img :src="cortinasRoller2Url" alt="Servicio de reparación de persianas" />
              </div>
            </div>
          </section>

          <!-- Sección alternada 3: Texto izquierda / Imagen derecha - Persianas de Madera -->
          <section class="alternating-section">
            <div class="halfscreen-section service-animate-left">
              <div class="halfscreen-content halfscreen-content-left">
                <div class="service-content-redesign">
                  <!-- Header Section -->
                  <div class="service-header">
                    <div class="service-category">
                      <span class="category-icon">🌳</span>
                      <span class="category-text">Especialistas en Madera</span>
                    </div>
                    <h3 class="service-title">Reparación de Persianas de Madera</h3>
                    <div class="service-subtitle">Arte y técnica tradicional</div>
                  </div>

                  <!-- Description Section -->
                  <div class="service-description">
                    <p class="description-text">Especialistas en restauración y reparación de persianas de madera. Mantenemos la elegancia y funcionalidad de tus persianas clásicas combinando técnicas tradicionales con tecnología moderna.</p>
                  </div>

                  <!-- Features Grid -->
                  <div class="service-features-grid">
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🌳</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Restauración</h4>
                        <p class="feature-desc">De madera</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🎨</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Lijado</h4>
                        <p class="feature-desc">Y barnizado</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🔨</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Reparación</h4>
                        <p class="feature-desc">De lamas</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">💎</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Mantenimiento</h4>
                        <p class="feature-desc">Especializado</p>
                      </div>
                    </div>
                  </div>

                  <!-- Benefits Section -->
                  <div class="service-benefits-section">
                    <div class="benefit-highlight">
                      <div class="benefit-item">
                        <div class="benefit-icon">🏛️</div>
                        <span>Técnicas tradicionales</span>
                      </div>
                      <div class="benefit-item">
                        <div class="benefit-icon">✨</div>
                        <span>Materiales de calidad</span>
                      </div>
                    </div>
                  </div>

                  <!-- CTA Section -->
                  <div class="service-cta">
                    <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero reparar mis persianas de madera.')" class="btn btn-primary btn-lg btn-service">
                      <span class="btn-text">Consultar Servicio</span>
                      <span class="btn-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="halfscreen-image">
                <img :src="persianasMaderaUrl" alt="Servicio de reparación de persianas de madera" />
              </div>
            </div>
          </section>

          <!-- Sección alternada 4: Imagen izquierda / Texto derecha - Motorización -->
          <section class="alternating-section">
            <div class="halfscreen-section service-animate-right">
              <div class="halfscreen-content halfscreen-content-right">
                <div class="service-content-redesign">
                  <!-- Header Section -->
                  <div class="service-header">
                    <div class="service-category service-category-left">
                      <span class="category-icon">🤖</span>
                      <span class="category-text">Tecnología Avanzada</span>
                    </div>
                    <h3 class="service-title">Motorización de Persianas y Cortinas Roller</h3>
                    <div class="service-subtitle">Automatización inteligente</div>
                  </div>

                  <!-- Description Section -->
                  <div class="service-description">
                    <p class="description-text">Transforma tus persianas y cortinas en sistemas automáticos de última generación. Control remoto, programación horaria y máxima comodidad en tu hogar u oficina con tecnología inteligente.</p>
                  </div>

                  <!-- Features Grid -->
                  <div class="service-features-grid">
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">📱</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Control Remoto</h4>
                        <p class="feature-desc">Incluido</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">⏰</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Programación</h4>
                        <p class="feature-desc">Automática</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🔋</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Motores</h4>
                        <p class="feature-desc">Silenciosos</p>
                      </div>
                    </div>
                    <div class="feature-card">
                      <div class="feature-icon-wrapper">
                        <span class="feature-icon">🏠</span>
                      </div>
                      <div class="feature-content">
                        <h4 class="feature-title">Instalación</h4>
                        <p class="feature-desc">Profesional</p>
                      </div>
                    </div>
                  </div>

                  <!-- Benefits Section -->
                  <div class="service-benefits-section">
                    <div class="benefit-highlight">
                      <div class="benefit-item">
                        <div class="benefit-icon">🔧</div>
                        <span>Instalación incluida</span>
                      </div>
                      <div class="benefit-item">
                        <div class="benefit-icon">🛡️</div>
                        <span>Garantía extendida</span>
                      </div>
                    </div>
                  </div>

                  <!-- CTA Section -->
                  <div class="service-cta">
                    <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero motorizar mis persianas/cortinas.')" class="btn btn-primary btn-lg btn-service">
                      <span class="btn-text">Consultar Motorización</span>
                      <span class="btn-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
              <div class="halfscreen-image">
                <img :src="cortinaRoller3Url" alt="Servicio de motorización de persianas y cortinas roller" />
              </div>
            </div>
          </section>

          <!-- Separador para mobile -->
          <div class="mobile-separator"></div>

          <!-- Full Screen Section - Colaboraciones -->
          <section class="fullscreen-section animate-on-scroll">
            <div class="fullscreen-image">
              <img :src="cortinaRoller3Url" alt="Colaboraciones inmobiliarias" />
            </div>
            <div class="fullscreen-overlay"></div>
            <div class="fullscreen-content">
              <h2 class="text-heading-1 mb-6">Colaboramos con más de 30 Inmobiliarias</h2>
              <p class="text-body-lg mb-8 opacity-90">
                En Rosario trabajamos junto a las principales inmobiliarias para ofrecer soluciones de reparación de persianas confiables y eficientes.
              </p>
              <div class="collaboration-stats">
                <div class="stat-item">
                  <div class="stat-number">{{ animatedNumbers.inmobiliarias }}+</div>
                  <div class="stat-label">Inmobiliarias</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ animatedNumbers.confianza }}%</div>
                  <div class="stat-label">Confianza</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">24/7</div>
                  <div class="stat-label">Disponibilidad</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Testimonials Section -->
          <section id="testimonios" class="section testimonials-section-elaborate">
            <div class="container">
              <div class="text-center mb-12 animate-on-scroll">
                <div class="testimonials-header">
                  <h2 class="text-heading-1 mb-4">Lo que dicen nuestros clientes</h2>
                  <p class="text-body-lg text-secondary max-w-3xl mx-auto">
                    Más de 20 años brindando soluciones confiables a administradores de edificios, empresas y casas particulares. 
                    Cada opinión representa nuestra dedicación al servicio de calidad.
                  </p>
                  <div class="testimonials-stats">
                    <div class="stat-item">
                      <div class="stat-number">{{ animatedNumbers.reviews }}+</div>
                      <div class="stat-label">Reseñas</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">{{ animatedNumbers.rating }}</div>
                      <div class="stat-label">Calificación</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">{{ animatedNumbers.años }}+</div>
                      <div class="stat-label">Años</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Grid normal para desktop -->
              <div class="grid-3">
                <div v-for="testimonial in displayedReviews" :key="testimonial.id" class="testimonial-card animate-on-scroll">
                  <div class="testimonial-header">
                    <div class="testimonial-rating">
                      <span v-for="i in testimonial.stars" :key="i" class="star">★</span>
                    </div>
                    <div class="testimonial-source">
                      <span class="source-badge">{{ testimonial.source }}</span>
                      <span v-if="testimonial.verified" class="verified-badge">✓ Verificada</span>
                      <span v-if="testimonial.recent" class="recent-badge">🆕 Reciente</span>
                    </div>
                  </div>
                  <p class="testimonial-text">{{ testimonial.text }}</p>
                  <div class="testimonial-author">
                    <div class="author-name">{{ testimonial.name }}</div>
                    <div class="author-role">{{ testimonial.role }}</div>
                    <div class="testimonial-date">{{ formatDate(testimonial.date) }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Slider elegante para mobile -->
              <NCarousel 
                :current-slide="currentTestimonialSlide"
                @update:current-slide="currentTestimonialSlide = $event"
                :show-dots="true"
                :dot-type="'dot'"
                :dot-placement="'bottom'"
                :autoplay="true"
                :autoplay-speed="2500"
                :slides-per-view="1"
                :space-between="0"
                :centered-slides="false"
                :loop="true"
                :effect="'slide'"
                :speed="500"
                class="testimonials-carousel"
              >
                <NCard v-for="testimonial in displayedReviews" :key="testimonial.id" class="testimonial-carousel-card">
                  <div class="testimonial-header">
                    <div class="testimonial-rating">
                      <span v-for="i in testimonial.stars" :key="i" class="star">★</span>
                    </div>
                    <div class="testimonial-source">
                      <span class="source-badge">{{ testimonial.source }}</span>
                      <span v-if="testimonial.verified" class="verified-badge">✓ Verificada</span>
                      <span v-if="testimonial.recent" class="recent-badge">🆕 Reciente</span>
                    </div>
                  </div>
                  <p class="testimonial-text">{{ testimonial.text }}</p>
                  <div class="testimonial-author">
                    <div class="author-name">{{ testimonial.name }}</div>
                    <div class="author-role">{{ testimonial.role }}</div>
                    <div class="testimonial-date">{{ formatDate(testimonial.date) }}</div>
                  </div>
                </NCard>
              </NCarousel>
              
              <div class="text-center mt-8">
                <a :href="googleMyBusinessUrl" target="_blank" class="btn btn-secondary">
                  Ver todas las opiniones en Google
                </a>
              </div>
            </div>
          </section>

          <!-- Promotions Section (elaborada con imagen de fondo) -->
          <section class="promotions-section-elaborate">
            <div class="promotions-bg-image">
              <img :src="cortinaRoller3Url" alt="Promociones especiales" />
            </div>
            <div class="promotions-overlay"></div>
            <div class="container">
              <div class="promotions-content animate-on-scroll">
                <div class="promotions-badge">
                  <span class="badge-icon">🎯</span>
                  <span>Oferta Especial</span>
                </div>
                <h2 class="text-heading-1 mb-4 text-white">Jueves de Promociones</h2>
                <p class="text-body-lg mb-6 text-white opacity-90">Beneficios exclusivos por tiempo limitado. Soluciones profesionales con descuentos especiales.</p>
                <div class="promotions-cta">
                  <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero consultar las promociones de los jueves.')" class="btn btn-primary btn-xl">
                    <NIcon><LogoWhatsapp /></NIcon>
                    Consultar Promociones
                  </button>
                </div>
                
                <!-- Info adicional con diseño elegante -->
                <div class="promotions-info-grid">
                  <!-- Fila única: Medios de pago, Horarios, Ubicación -->
                  <div class="info-cards-row-three">
                    <div class="info-card info-card-equal-height info-card-payment">
                      <div class="info-card-icon">💳</div>
                      <div class="info-card-content">
                        <h4>Medios de Pago</h4>
                        <div class="payment-methods">
                          <div class="payment-item">
                            <span class="payment-icon">💵</span>
                            <span class="payment-text">Efectivo</span>
                          </div>
                          <div class="payment-item">
                            <span class="payment-icon">💳</span>
                            <span class="payment-text">Tarjetas</span>
                          </div>
                          <div class="payment-item">
                            <span class="payment-icon">📱</span>
                            <span class="payment-text">Transferencia</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="info-card info-card-equal-height info-card-schedule-middle">
                      <div class="info-card-icon">🕒</div>
                      <div class="info-card-content">
                        <h4>Horarios de Atención</h4>
                        <div class="schedule-vertical">
                          <div class="schedule-item-vertical">
                            <span class="schedule-label">Administrativo:</span>
                            <span class="schedule-time">09:00 - 17:00</span>
                          </div>
                          <div class="schedule-item-vertical">
                            <span class="schedule-label">Operativo:</span>
                            <span class="schedule-time">09:00 - 19:00</span>
                          </div>
                          <div class="schedule-item-vertical">
                            <span class="schedule-label">Sábados:</span>
                            <span class="schedule-time">09:00 - 13:00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="info-card info-card-equal-height info-card-location">
                      <div class="info-card-icon">📍</div>
                      <div class="info-card-content">
                        <h4>Ubicación</h4>
                        <div class="location-details">
                          <div class="location-item">
                            <span class="location-icon">🏢</span>
                            <div class="location-text">
                              <div class="location-address">Pasco 504 5to B</div>
                              <div class="location-city">Rosario, Santa Fe</div>
                            </div>
                          </div>
                          <div class="location-item">
                            <span class="location-icon">🚗</span>
                            <span class="location-text">Servicio a domicilio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


          <!-- Location and Contact Section -->
          <section id="contacto" class="section map-contact-split">
            <div class="container-full">
              <div class="split-header text-center animate-on-scroll">
                <h2 class="split-heading">Visítanos o <span class="split-highlight">escribinos</span></h2>
                <p class="split-lead">Atención inmediata, soluciones reales y soporte experto.</p>
                <p class="split-description">Estamos en Rosario y respondemos rápido por WhatsApp. Elegí el canal que prefieras y te ayudamos al instante.</p>
              </div>
              <div class="split-grid animate-on-scroll">
                <!-- Lado izquierdo: mapa inmersivo -->
                <div class="split-map">
                  <div class="split-encapsulate split-map-frame">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.1234567890!2d-60.6336425!3d-32.960875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x65793edc3d0062bc!2sTaller%20Movil%20-%20Service!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                      width="100%" 
                      height="100%" 
                      style="border:0;" 
                      allowfullscreen="true" 
                      loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                </div>

                <!-- Lado derecho: panel de contacto con imagen -->
                <div class="split-panel split-encapsulate">
                  <div class="split-panel-bg">
                    <img :src="cortinasRoller1Url" alt="Contacto Taller Móvil Service" />
                  </div>
                  <div class="split-panel-overlay"></div>
                  <div class="split-panel-content">
                    <h2 class="split-title">Contactanos</h2>
                    <p class="split-subtitle">Atención inmediata y profesional en Rosario.</p>
                    <div class="split-badges">
                      <span class="split-badge">Respuesta en minutos</span>
                      <span class="split-badge">Atención 24/7</span>
                      <span class="split-badge">Garantía de servicio</span>
                    </div>
                    <div class="split-actions">
                      <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero hacer una consulta general.')" class="btn btn-primary btn-large">
                        <NIcon><LogoWhatsapp /></NIcon>
                        <span>WhatsApp General</span>
                      </button>
                      <button @click="openWhatsApp(whatsappPorteros, 'Hola! Necesito servicio de porteros eléctricos.')" class="btn btn-primary btn-outline btn-large">
                        <NIcon><LogoWhatsapp /></NIcon>
                        <span>Porteros Eléctricos</span>
                      </button>
                      <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero enviar un email con detalles de mi consulta.')" class="btn btn-secondary btn-large split-action-wide">
                        <NIcon><MailOutline /></NIcon>
                        <span>Enviar Email</span>
                      </button>
                    </div>
                    <div class="split-meta">
                      <div class="meta-item">
                        <NIcon><LocationOutline /></NIcon>
                        <span>Pasco 504, 5to B • Rosario</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <!-- Footer Profesional Elaborado -->
        <footer class="footer-professional-elaborate">
          <div class="container-wide">
            <div class="footer-content">
              <div class="footer-brand">
                <div class="footer-logo">
                  <img :src="logoUrl" alt="Taller Móvil Service" />
                </div>
                <h3>Taller Móvil Service</h3>
                <p>Especialistas en reparación y motorización de persianas y cortinas roller en Rosario. Más de 20 años brindando soluciones confiables y profesionales.</p>
                <div class="footer-social">
                  <a :href="'https://wa.me/' + whatsappMain" target="_blank" class="social-link" title="WhatsApp">
                    <NIcon><LogoWhatsapp /></NIcon>
                  </a>
                  <a href="https://www.instagram.com/tallermovilservice/" target="_blank" class="social-link" title="Instagram">
                    <NIcon><LogoInstagram /></NIcon>
                  </a>
                  <a href="https://www.facebook.com/TallerMovilService/" target="_blank" class="social-link" title="Facebook">
                    <NIcon><LogoFacebook /></NIcon>
                  </a>
                  <a href="mailto:consultas@tallermovilservice.com" class="social-link" title="Email">
                    <NIcon><MailOutline /></NIcon>
                  </a>
                </div>
              </div>
              
              <div class="footer-links">
                <div class="footer-column">
                  <h4>Servicios</h4>
                  <ul>
                    <li><a href="#servicios">Reparación de Persianas</a></li>
                    <li><a href="#servicios">Cortinas Roller</a></li>
                    <li><a href="#servicios">Persianas de Madera</a></li>
                    <li><a href="#servicios">Motorización</a></li>
                    <li><a href="#servicios">Mantenimiento</a></li>
                  </ul>
                </div>
                
                <div class="footer-column">
                  <h4>Empresa</h4>
                  <ul>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#testimonios">Testimonios</a></li>
                    <li><a href="#contacto">Contacto</a></li>
                    <li><a href="#contacto">Ubicación</a></li>
                    <li><a href="#servicios">Nuestros Servicios</a></li>
                  </ul>
                </div>
                
                <div class="footer-column">
                  <h4>Contacto</h4>
                  <div class="contact-info">
                    <div class="contact-item">
                      <NIcon><LogoWhatsapp /></NIcon>
                      <span>+{{ whatsappMain }}</span>
                    </div>
                    <div class="contact-item">
                      <NIcon><MailOutline /></NIcon>
                      <span>consultas@tallermovilservice.com</span>
                    </div>
                    <div class="contact-item">
                      <NIcon><LocationOutline /></NIcon>
                      <a href="https://www.google.com/maps/place/Taller+Movil+-+Service/@-32.960875,-60.6336425,15z/data=!4m2!3m1!1s0x0:0x65793edc3d0062bc?sa=X&ved=1t:2428&hl=es&ictx=111" target="_blank" class="location-link">
                        Pasco 504 5to B, Rosario
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="footer-bottom">
              <div class="footer-copyright">
                <p>&copy; 2025 Taller Móvil Service. Todos los derechos reservados.</p>
              </div>
              <div class="footer-legal">
                <a href="#">Política de Privacidad</a>
                <a href="#">Términos y Condiciones</a>
              </div>
            </div>
            
            <!-- Crédito de desarrollo -->
            <div class="footer-development">
              <div class="development-credit">
                <p>Web desarrollada por</p>
                <a href="https://seiminteractive.io" target="_blank" class="development-link">
                  <img :src="logoSeimUrl" alt="Seim Interactive" class="development-logo" />
                  <span>Seim Interactive</span>
                </a>
              </div>
            </div>
          </div>
        </footer>

        <!-- Floating WhatsApp Button -->
        <div class="float-whatsapp">
          <a :href="'https://wa.me/' + whatsappMain + '?text=' + encodeURIComponent('Hola! Quiero hacer una consulta. Vengo desde la web.')" target="_blank">
            <button class="btn btn-primary">
              <NIcon><LogoWhatsapp /></NIcon>
            </button>
    </a>
  </div>

        <NBackTop :right="24" :bottom="90" />
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<style scoped>
/* Navigation */
.nav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
}

.dark .nav {
  background: transparent;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-logo {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
}

.nav-title {
  font-weight: 600;
  font-size: 1.125rem;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background: var(--bg-secondary);
}

/* Hero Section */
.hero-section {
  padding: clamp(6rem, 12vw, 10rem) 0;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--bg-accent);
  border: 1px solid var(--color-primary-light);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary-dark);
  margin-bottom: 2rem;
}

.text-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-actions {
  display: block;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-xl {
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.hero-image-container {
  position: relative;
}

.hero-image-overlay {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
}

.overlay-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.overlay-content p {
  margin: 0;
  opacity: 0.9;
}

/* Service Cards */
.service-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.service-image {
  height: 200px;
  overflow: hidden;
}

.service-image-large {
  height: 300px;
  overflow: hidden;
}

.service-image img,
.service-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.service-card:hover .service-image img,
.service-card:hover .service-image-large img {
  transform: scale(1.1);
}

.service-content {
  padding: 2rem;
}

.service-content-large {
  padding: 2.5rem;
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.service-features li {
  padding: 0.25rem 0;
  color: var(--text-secondary);
}

.service-features-large {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature-icon {
  font-size: 1.25rem;
}

/* Testimonial Cards */
.testimonial-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.testimonial-rating {
  margin-bottom: 1rem;
}

.star {
  color: #fbbf24;
  font-size: 1.25rem;
}

.testimonial-text {
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.testimonial-author {
  border-top: 1px solid var(--border-light);
  padding-top: 1rem;
}

.author-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Contact Section */
.contact-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-details {
  flex: 1;
}

.contact-label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.contact-value {
  color: var(--text-secondary);
  text-decoration: none;
}

.contact-value:hover {
  color: var(--color-primary);
}

.contact-link {
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: var(--color-primary);
}

/* Map Section */
.map-section {
  margin-top: 4rem;
  padding: 4rem 0;
  background: var(--bg-primary);
}

.map-container {
  margin-bottom: 3rem;
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.map-info {
  max-width: 800px;
  margin: 0 auto;
}

.map-details {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.access-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.access-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.access-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: 50%;
}

.access-item div strong {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.access-item div p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(244, 172, 34, 0.1);
}

.form-textarea::placeholder {
  color: var(--text-muted);
}

.w-full {
  width: 100%;
}

/* Collaboration Stats */
.collaboration-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.collaboration-stats .stat-item {
  text-align: center;
}

.collaboration-stats .stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.collaboration-stats .stat-label {
  font-size: 1rem;
  color: white;
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 1024px) {
  .halfscreen-section {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  
  .halfscreen-image {
    height: 50vh;
  }
  
  .halfscreen-content {
    padding: 3rem 2rem;
  }
  
  .alternating-section:nth-child(even) .halfscreen-section {
    direction: ltr;
  }
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .nav-brand-text {
    display: none;
  }
  
  .nav-contact {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nav-whatsapp,
  .nav-email {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .hero-highlights {
    gap: 0.75rem;
  }
  
  .highlight-item {
    padding: 0.75rem 1rem;
  }
  
  .showcase-features {
    grid-template-columns: 1fr;
  }
  
  .contact-grid-elaborate {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-cards {
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .contact-details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .contact-form-elaborate {
    padding: 1.5rem;
  }
  
  .service-features-large {
    grid-template-columns: 1fr;
  }
  
  .access-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .fullscreen-content {
    padding: 0 1rem;
  }
  
  .fullscreen-content h2 {
    font-size: clamp(2rem, 8vw, 3rem);
  }
  
  .collaboration-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .halfscreen-content {
    padding: 2rem 1rem;
  }
}

/* Animation delays */
.animate-on-scroll:nth-child(1) { animation-delay: 0.1s; }
.animate-on-scroll:nth-child(2) { animation-delay: 0.2s; }
.animate-on-scroll:nth-child(3) { animation-delay: 0.3s; }
.animate-on-scroll:nth-child(4) { animation-delay: 0.4s; }
</style>