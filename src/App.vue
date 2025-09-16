<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, darkTheme, type GlobalThemeOverrides, NButton, NIcon, NBackTop, NInput } from 'naive-ui'
import { useDark, useToggle } from '@vueuse/core'
import { LogoWhatsapp, MailOutline, CallOutline, TimeOutline, CardOutline, LocationOutline } from '@vicons/ionicons5'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

// Import images
import logoUrl from './assets/logo.webp'
import cortinaMotorizadaUrl from './assets/cortina-motorizada.webp'
import cortinasRoller1Url from './assets/cortinas-roller-1.jpg'
import cortinasRoller2Url from './assets/cortinas-roller-2.jpg'

gsap.registerPlugin(ScrollTrigger)

const isDark = useDark({ selector: 'html', attribute: 'class', valueDark: 'dark', valueLight: '' })
const toggleDark = useToggle(isDark)

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
const whatsappPersianas = '5493416405980'

const sections = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'testimonios', label: 'Testimonios' },
  { id: 'contacto', label: 'Contacto' }
]

const name = ref('')
const message = ref('')

function openWhatsApp(number: string, text: string) {
  const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

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
})
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <NDialogProvider>
      <NMessageProvider>
        <!-- Navigation -->
        <nav class="nav">
          <div class="container-wide">
            <div class="nav-content">
              <div class="nav-brand">
                <div class="nav-logo-container">
                  <img :src="logoUrl" alt="Taller Móvil Service" class="nav-logo" />
                </div>
                <div class="nav-brand-text">
                  <span class="nav-title">Taller Móvil Service</span>
                  <span class="nav-subtitle">Especialistas en Persianas</span>
                </div>
              </div>
              
              <div class="nav-menu">
                <a v-for="section in sections" :key="section.id" :href="'#' + section.id" class="nav-link">
                  {{ section.label }}
                </a>
              </div>
              
              <div class="nav-actions">
                <div class="nav-contact">
                  <a :href="'https://wa.me/' + whatsappMain" target="_blank" class="nav-whatsapp">
                    <NIcon><LogoWhatsapp /></NIcon>
                    <span>WhatsApp</span>
                  </a>
                  <a href="mailto:consultas@tallermovilservice.com" class="nav-email">
                    <NIcon><MailOutline /></NIcon>
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <!-- Hero Section -->
          <section id="inicio" class="hero-section">
            <div class="container-wide">
              <div class="hero-layout">
                <div class="hero-content animate-on-scroll">
                  <div class="hero-badge">
                    <span>✨ Más de 20 años de experiencia</span>
                  </div>
                  
                  <h1 class="text-display mb-6">
                    SOMOS LÍDERES EN LA <span class="text-gradient">REPARACIÓN</span> DE PERSIANAS, CORTINAS ROLLER Y MOTORIZACIÓN
                  </h1>
                  
                  <p class="text-body-lg text-secondary mb-6">
                    Somos Taller Móvil, una empresa con más de 20 años de trayectoria y especialistas en el mantenimiento de porteros eléctricos, cortinas de enrollar, además contamos con personal capacitado.
                  </p>
                  
                  <p class="text-body text-secondary mb-8">
                    Nos dirigimos a administradores de edificios, empresas y casas particulares, a quienes brindamos una atención seria, responsable y de confianza. Trabajamos en la ciudad de Rosario y sus alrededores, donde los clientes nos prefieren por nuestra experiencia.
                  </p>
                  
                  <div class="hero-highlights mb-8">
                    <div class="highlight-item">
                      <span class="highlight-icon">🏆</span>
                      <span>OFRECEMOS LA MEJOR CALIDAD</span>
                    </div>
                    <div class="highlight-item">
                      <span class="highlight-icon">⚡</span>
                      <span>EFICIENCIA Y SERVICIO PERSONALIZADO</span>
                    </div>
                  </div>
                  
                  <div class="hero-actions mb-8">
                    <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero hacer una consulta sobre sus servicios. Vengo desde la web.')" class="btn btn-primary btn-xl">
                      <NIcon><LogoWhatsapp /></NIcon>
                      ¡Esperamos su llamada!
                    </button>
                    <a href="mailto:consultas@tallermovilservice.com" class="btn btn-secondary btn-xl">
                      <NIcon><MailOutline /></NIcon>
                      consultas@tallermovilservice.com
                    </a>
                  </div>
                  
                  <div class="hero-stats">
                    <div class="stat-item">
                      <div class="stat-number">{{ Math.round(years) }}+</div>
                      <div class="stat-label">Años de experiencia</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">30+</div>
                      <div class="stat-label">Inmobiliarias colaboran</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">100%</div>
                      <div class="stat-label">Garantía de trabajo</div>
                    </div>
                  </div>
                </div>
                
                <div class="hero-image-container animate-on-scroll">
                  <div class="hero-image-showcase">
                    <div class="showcase-main">
                      <div class="showcase-card">
                        <h3>Colaboramos con más de 30 Inmobiliarias en Rosario</h3>
                        <p>Para ofrecer soluciones de reparación de persianas confiables y eficientes</p>
                      </div>
                    </div>
                    <div class="showcase-features">
                      <div class="feature-card">
                        <span class="feature-icon">🏠</span>
                        <span>Servicio a Domicilio</span>
                      </div>
                      <div class="feature-card">
                        <span class="feature-icon">🔧</span>
                        <span>Diagnóstico Gratuito</span>
                      </div>
                      <div class="feature-card">
                        <span class="feature-icon">🛡️</span>
                        <span>Garantía de Trabajo</span>
                      </div>
                      <div class="feature-card">
                        <span class="feature-icon">⚡</span>
                        <span>Atención Rápida</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Full Screen Hero Service -->
          <section class="fullscreen-section animate-on-scroll">
            <div class="fullscreen-image">
              <img :src="cortinaMotorizadaUrl" alt="Cortina motorizada profesional" />
            </div>
            <div class="fullscreen-overlay"></div>
            <div class="fullscreen-content">
              <h2 class="text-heading-1 mb-6">Especialistas en Motorización</h2>
              <p class="text-body-lg mb-8 opacity-90">
                Automatizamos tus persianas y cortinas roller con la última tecnología. Motores silenciosos, control remoto y instalación profesional garantizada.
              </p>
              <button @click="openWhatsApp(whatsappPersianas, 'Consulta por motorización de persianas')" class="btn btn-primary btn-xl">
                <NIcon><LogoWhatsapp /></NIcon>
                Consultar Motorización
              </button>
            </div>
          </section>

          <!-- Half Screen Section - Cortinas Roller -->
          <section class="alternating-section">
            <div class="halfscreen-section">
              <div class="halfscreen-image">
                <img :src="cortinasRoller1Url" alt="Reparación de cortinas roller" />
              </div>
              <div class="halfscreen-content halfscreen-content-left">
                <h3 class="text-heading-2 mb-6">Reparación de Cortinas Roller</h3>
                <p class="text-body-lg text-secondary mb-6">
                  Servicio especializado en cortinas enrollables, reparación de mecanismos, cambio de telas y mantenimiento preventivo.
                </p>
                <div class="service-features-large mb-8">
                  <div class="feature-item">
                    <span class="feature-icon">🔧</span>
                    <span>Diagnóstico gratuito</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">⚙️</span>
                    <span>Reparación de mecanismos</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <span>Cambio de telas</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🛠️</span>
                    <span>Mantenimiento preventivo</span>
                  </div>
                </div>
                <button @click="openWhatsApp(whatsappPersianas, 'Consulta por reparación de cortinas roller')" class="btn btn-primary btn-lg">
                  Consultar Servicio
                </button>
              </div>
            </div>
          </section>

          <!-- Half Screen Section - Persianas (Reversed) -->
          <section class="alternating-section">
            <div class="halfscreen-section">
              <div class="halfscreen-image">
                <img :src="cortinasRoller2Url" alt="Reparación de persianas" />
              </div>
              <div class="halfscreen-content halfscreen-content-right">
                <h3 class="text-heading-2 mb-6">Reparación de Persianas</h3>
                <p class="text-body-lg text-secondary mb-6">
                  Mantenimiento y reparación completa de persianas de aluminio, PVC y madera. Atención especializada para hogares y empresas.
                </p>
                <div class="service-features-large mb-8">
                  <div class="feature-item">
                    <span class="feature-icon">🏠</span>
                    <span>Atención a domicilio</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🔧</span>
                    <span>Reparación completa</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🛡️</span>
                    <span>Garantía de trabajo</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">⚡</span>
                    <span>Servicio rápido</span>
                  </div>
                </div>
                <button @click="openWhatsApp(whatsappPersianas, 'Consulta por reparación de persianas')" class="btn btn-primary btn-lg">
                  Consultar Servicio
                </button>
              </div>
            </div>
          </section>

          <!-- Full Screen Section - Colaboraciones -->
          <section class="fullscreen-section animate-on-scroll">
            <div class="fullscreen-image">
              <img :src="cortinaMotorizadaUrl" alt="Colaboraciones inmobiliarias" />
            </div>
            <div class="fullscreen-overlay"></div>
            <div class="fullscreen-content">
              <h2 class="text-heading-1 mb-6">Colaboramos con más de 30 Inmobiliarias</h2>
              <p class="text-body-lg mb-8 opacity-90">
                En Rosario trabajamos junto a las principales inmobiliarias para ofrecer soluciones de reparación de persianas confiables y eficientes.
              </p>
              <div class="collaboration-stats">
                <div class="stat-item">
                  <div class="stat-number">30+</div>
                  <div class="stat-label">Inmobiliarias</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">100%</div>
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
          <section id="testimonios" class="section">
            <div class="container">
              <div class="text-center mb-8 animate-on-scroll">
                <h2 class="text-heading-1 mb-4">Lo que dicen nuestros clientes</h2>
                <p class="text-body-lg text-secondary">
                  Más de 20 años brindando soluciones confiables a administradores de edificios, empresas y casas particulares.
                </p>
              </div>
              
              <div class="grid-3">
                <div v-for="testimonial in [
                  { name: 'María González', role: 'Administradora de Consorcio', stars: 5, text: 'Excelente atención y muy prolijos. Solucionaron el problema de la persiana en tiempo récord. Los recomiendo sin dudas.' },
                  { name: 'Julián Pérez', role: 'Propietario Local', stars: 5, text: 'Solucionaron rápido la persiana del local. Muy profesionales y con precios justos. El servicio a domicilio es excelente.' },
                  { name: 'Rocío López', role: 'Particular', stars: 5, text: 'Buen precio y seriedad, recomendados. El servicio a domicilio es excelente y cumplieron con los tiempos acordados.' }
                ].filter(t => t.stars >= 4)" :key="testimonial.name" class="testimonial-card animate-on-scroll">
                  <div class="testimonial-rating">
                    <span v-for="i in testimonial.stars" :key="i" class="star">★</span>
                  </div>
                  <p class="testimonial-text">{{ testimonial.text }}</p>
                  <div class="testimonial-author">
                    <div class="author-name">{{ testimonial.name }}</div>
                    <div class="author-role">{{ testimonial.role }}</div>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-8">
                <a href="https://www.google.com/search?q=Taller+M%C3%B3vil+Service+Rosario+rese%C3%B1as" target="_blank" class="btn btn-secondary">
                  Ver más testimonios en Google
                </a>
              </div>
            </div>
          </section>

          <!-- Promotions Section -->
          <section class="section-sm" style="background: var(--color-primary); color: white;">
            <div class="container text-center">
              <div class="animate-on-scroll">
                <h2 class="text-heading-2 mb-4">¡Jueves de Promociones!</h2>
                <p class="text-body-lg mb-6 opacity-90">
                  Consulta nuestras ofertas especiales para los distintos medios de pago
                </p>
                <button @click="openWhatsApp(whatsappMain, 'Hola! Quiero consultar sobre las promociones de los jueves.')" class="btn btn-lg" style="background: white; color: var(--color-primary);">
                  Consultar Promociones
                </button>
              </div>
            </div>
          </section>

          <!-- Contact Section -->
          <section id="contacto" class="section" style="background: var(--bg-secondary);">
            <div class="container-wide">
              <div class="text-center mb-8 animate-on-scroll">
                <h2 class="text-heading-1 mb-4">Estamos en Rosario</h2>
                <p class="text-body-lg text-secondary">
                  Contactanos para recibir atención personalizada y presupuesto sin compromiso
                </p>
              </div>
              
              <div class="contact-grid-elaborate">
                <div class="contact-info-elaborate animate-on-scroll">
                  <div class="contact-header">
                    <h3 class="text-heading-2 mb-4">Información de Contacto</h3>
                    <p class="text-body text-secondary mb-6">
                      Múltiples formas de contactarnos para brindarte la mejor atención
                    </p>
                  </div>
                  
                  <div class="contact-cards">
                    <div class="contact-card-primary">
                      <div class="contact-card-header">
                        <div class="contact-icon-large">
                          <NIcon><LogoWhatsapp /></NIcon>
                        </div>
                        <div class="contact-card-title">
                          <h4>WhatsApp Principal</h4>
                          <p>Consulta general y servicios</p>
                        </div>
                      </div>
                      <a :href="'https://wa.me/' + whatsappMain" target="_blank" class="contact-card-link">
                        <strong>+{{ whatsappMain }}</strong>
                        <span class="contact-card-arrow">→</span>
                      </a>
                    </div>
                    
                    <div class="contact-card-secondary">
                      <div class="contact-card-header">
                        <div class="contact-icon-large">
                          <NIcon><CallOutline /></NIcon>
                        </div>
                        <div class="contact-card-title">
                          <h4>WhatsApp Porteros</h4>
                          <p>Especializado en porteros eléctricos</p>
                        </div>
                      </div>
                      <a :href="'https://wa.me/' + whatsappPorteros" target="_blank" class="contact-card-link">
                        <strong>+{{ whatsappPorteros }}</strong>
                        <span class="contact-card-arrow">→</span>
                      </a>
                    </div>
                    
                    <div class="contact-card-tertiary">
                      <div class="contact-card-header">
                        <div class="contact-icon-large">
                          <NIcon><MailOutline /></NIcon>
                        </div>
                        <div class="contact-card-title">
                          <h4>Email</h4>
                          <p>Consultas detalladas y presupuestos</p>
                        </div>
                      </div>
                      <a href="mailto:consultas@tallermovilservice.com" class="contact-card-link">
                        <strong>consultas@tallermovilservice.com</strong>
                        <span class="contact-card-arrow">→</span>
                      </a>
                    </div>
                  </div>
                  
                  <div class="contact-details-grid">
                    <div class="detail-item">
                      <div class="detail-icon">
                        <NIcon><TimeOutline /></NIcon>
                      </div>
                      <div class="detail-content">
                        <h5>Horarios de Atención</h5>
                        <p>Lun-Vie: 09:00-17:00 hs<br>Sáb: 09:00-13:00 hs<br><small>(Feriados cerrado)</small></p>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-icon">
                        <NIcon><CardOutline /></NIcon>
                      </div>
                      <div class="detail-content">
                        <h5>Medios de Pago</h5>
                        <p>Efectivo y tarjetas</p>
                      </div>
                    </div>
                    
                    <div class="detail-item">
                      <div class="detail-icon">
                        <NIcon><LocationOutline /></NIcon>
                      </div>
                      <div class="detail-content">
                        <h5>Ubicación</h5>
                        <p><strong>Pasco 504 5to B - Rosario</strong><br><small>(CP 2000) Santa Fe</small></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="contact-form-elaborate animate-on-scroll">
                  <div class="form-header">
                    <h3 class="text-heading-2 mb-4">Envíanos tu consulta</h3>
                    <p class="text-body text-secondary mb-6">
                      Completa el formulario y te contactaremos por WhatsApp en menos de 2 horas
                    </p>
                  </div>
                  
                  <form @submit.prevent="openWhatsApp(whatsappMain, `Hola, soy ${name}. ${message}`)" class="elaborate-form">
                    <div class="form-group-elaborate">
                      <label class="form-label-elaborate">Nombre completo</label>
                      <NInput v-model:value="name" placeholder="Tu nombre completo" size="large" required />
                    </div>
                    
                    <div class="form-group-elaborate">
                      <label class="form-label-elaborate">Mensaje</label>
                      <textarea 
                        v-model="message" 
                        placeholder="Contanos tu necesidad específica..." 
                        rows="5" 
                        required
                        class="form-textarea-elaborate"
                      ></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-xl w-full">
                      <NIcon><LogoWhatsapp /></NIcon>
                      Enviar consulta por WhatsApp
                    </button>
                    
                    <div class="form-footer">
                      <div class="form-guarantee">
                        <span class="guarantee-icon">⚡</span>
                        <span>Respuesta garantizada en menos de 2 horas</span>
                      </div>
                      <div class="form-alternative">
                        <span>¿Prefieres llamar?</span>
                        <a :href="'https://wa.me/' + whatsappMain" target="_blank" class="alternative-link">
                          <strong>+{{ whatsappMain }}</strong>
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <!-- Interactive Map Section -->
              <div class="map-section animate-on-scroll">
                <div class="container-wide">
                  <div class="text-center mb-8">
                    <h3 class="text-heading-2 mb-4">Nuestra Ubicación</h3>
                    <p class="text-body-lg text-secondary">
                      Encontranos en el corazón de Rosario, fácil acceso y estacionamiento disponible
                    </p>
                  </div>
                  
                  <div class="map-container">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.1234567890!2d-60.6396!3d-32.9442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab1234567890%3A0x1234567890abcdef!2sPasco%20504%2C%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
                      width="100%" 
                      height="400" 
                      style="border:0; border-radius: var(--radius-xl);" 
                      allowfullscreen="true" 
                      loading="lazy" 
                      referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                  </div>
                  
                  <div class="map-info">
                    <div class="map-details">
                      <h4 class="text-heading-3 mb-4">Información de Acceso</h4>
                      <div class="access-info">
                        <div class="access-item">
                          <span class="access-icon">🚗</span>
                          <div>
                            <strong>Estacionamiento</strong>
                            <p>Disponible en la zona</p>
                          </div>
                        </div>
                        <div class="access-item">
                          <span class="access-icon">🚌</span>
                          <div>
                            <strong>Transporte Público</strong>
                            <p>Múltiples líneas de colectivo</p>
                          </div>
                        </div>
                        <div class="access-item">
                          <span class="access-icon">🚶</span>
                          <div>
                            <strong>Caminando</strong>
                            <p>Acceso peatonal desde el centro</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

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
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-light);
}

.dark .nav {
  background: rgba(15, 23, 42, 0.95);
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
  display: flex;
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