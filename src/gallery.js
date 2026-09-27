import { supabase } from './supabase.js'

const gallery = document.getElementById('gallery')

async function loadGallery() {
    const { data, error } = await supabase.storage
        .from('media')
        .list('', {
            sortBy: { column: 'created_at', order: 'desc' }
        })

    if (error) {
        console.error(error)
        gallery.innerHTML = '<p>Failed to load media.</p>'
        return
    }

    gallery.innerHTML = ''

    data.forEach(file => {
        const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(file.name)

        const img = document.createElement('img')
        img.src = urlData.publicUrl
        img.alt = file.name
        img.style.width = '200px'
        img.style.margin = '10px'
        img.style.borderRadius = '10px'

        gallery.appendChild(img)
    })
}

loadGallery()