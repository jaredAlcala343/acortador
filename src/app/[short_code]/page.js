import { supabase } from '../../../supabaseClient'
import { redirect } from 'next/navigation'

export default async function RedirectPage({ params }) {
  const { short_code } = params

  const { data, error } = await supabase
    .from('urls')
    .select('original_url')
    .eq('short_code', short_code)
    .single()

  if (data?.original_url) {
    redirect(data.original_url)
  }

  return (
    <div>
      <h1>URL no encontrada</h1>
    </div>
  )
}