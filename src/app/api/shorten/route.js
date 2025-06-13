import { supabase } from '../../../../supabaseClient'

export async function POST(request) {
  const { originalUrl, customCode } = await request.json()

  try {
    new URL(originalUrl)
  } catch {
    return Response.json({ error: 'URL inválida' }, { status: 400 })
  }

  const shortCode = (customCode || Math.random().toString(36).substring(2, 100)).slice(0, 100)

  const { data: exists, error: existsError } = await supabase
    .from('urls')
    .select('id')
    .eq('short_code', shortCode)
    .maybeSingle()

  if (existsError) {
    return Response.json({ error: existsError.message }, { status: 500 })
  }

  if (exists) {
    return Response.json({ error: 'El código ya está en uso' }, { status: 400 })
  }

  const { error } = await supabase
    .from('urls')
    .insert([{ short_code: shortCode, original_url: originalUrl }])

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  return Response.json({ shortUrl: `${shortCode}` })
}

// Opcional: rechaza otros métodos
export async function GET() {
  return Response.json({ error: 'Método no permitido' }, { status: 405 })
}