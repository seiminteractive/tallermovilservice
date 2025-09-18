import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyCbMgYvVlDr1D1xTMdvnBkdZKRAbL07iPY'
const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJ72TQxwCrt5URvGIAPdw-eWU'

if (!GOOGLE_PLACES_API_KEY || !PLACE_ID) {
  console.error('❌ Faltan variables de entorno: GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID')
  process.exit(1)
}

async function fetchGoogleReviews() {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total&language=es&key=${GOOGLE_PLACES_API_KEY}`
  
  try {
    console.log('🔄 Obteniendo opiniones de Google Places...')
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Error de API: ${data.status}`)
    }
    
    const reviews = data.result.reviews || []
    const totalReviews = data.result.user_ratings_total || 0
    const averageRating = data.result.rating || 0
    
    console.log(`📊 API devuelve ${reviews.length} opiniones de ${totalReviews} totales`)
    
    // Ordenar todas las opiniones por calificación (mayor a menor) y luego por fecha
    const sortedReviews = reviews
      .sort((a, b) => {
        // Primero por calificación (5 estrellas primero), luego por fecha
        if (b.rating !== a.rating) {
          return b.rating - a.rating
        }
        return b.time - a.time
      })
    
    // Filtrar opiniones con 4+ estrellas
    const filteredReviews = sortedReviews.filter(review => review.rating >= 4)
    
    // Tomar las 3 mejores opiniones (priorizando 4+ estrellas)
    let topReviews = filteredReviews.slice(0, 3)
    
    // Si hay menos de 3 opiniones con 4+ estrellas, incluir algunas con 3 estrellas
    if (topReviews.length < 3) {
      const threeStarReviews = sortedReviews
        .filter(review => review.rating === 3)
        .slice(0, 3 - topReviews.length)
      topReviews = [...topReviews, ...threeStarReviews]
    }
    
    const formattedReviews = topReviews.map((review, index) => ({
      id: index + 1,
      name: review.author_name,
      role: 'Cliente', // Por defecto
      stars: review.rating,
      text: review.text,
      date: new Date(review.time * 1000).toISOString().split('T')[0],
      verified: true,
      source: 'Google',
      recent: new Date(review.time * 1000) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
    }))
    
    const reviewsData = {
      lastUpdated: new Date().toISOString(),
      totalReviews,
      averageRating,
      reviews: formattedReviews
    }
    
    // Guardar archivo
    const filePath = path.join(__dirname, '..', 'public', 'reviews.json')
    fs.writeFileSync(filePath, JSON.stringify(reviewsData, null, 2))
    
    console.log('✅ Opiniones actualizadas exitosamente')
    console.log(`📊 Total de reseñas: ${totalReviews}`)
    console.log(`⭐ Calificación promedio: ${averageRating}`)
    console.log(`📝 Reseñas con 4+ estrellas: ${filteredReviews.length}`)
    console.log(`🎯 Mostrando las 3 mejores: ${formattedReviews.length} (4+ estrellas: ${formattedReviews.filter(r => r.stars >= 4).length})`)
    
  } catch (error) {
    console.error('❌ Error al obtener opiniones:', error.message)
    process.exit(1)
  }
}

// Ejecutar
fetchGoogleReviews()
