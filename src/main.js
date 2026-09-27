import { supabase } from './supabase.js'

const fileInput = document.getElementById('fileInput')
const uploadButton = document.getElementById('uploadButton')
const message = document.getElementById('message')

uploadButton.addEventListener('click', async () => {
  const file = fileInput.files[0]

  if (!file) {
    message.textContent = 'Please choose a file first.'
    return
  }

  message.textContent = 'Uploading...'

  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('media')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    message.textContent = `Upload failed: ${error.message}`
    return
  }

  message.textContent = '✅ File uploaded successfully!'
})