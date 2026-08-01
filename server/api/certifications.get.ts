import type { Tables } from '~/types/database'
import { createInternalServerError } from '../utils/apiErrors'

type PublicCertification = Pick<
  Tables<'certifications'>,
  'id' | 'name' | 'issuer' | 'issued_date' | 'credential_url' | 'sort_order'
>

export default defineEventHandler(async (): Promise<PublicCertification[]> => {
  const supabase = useSupabasePublic()
  const { data, error } = await supabase
    .from('certifications')
    .select('id,name,issuer,issued_date,credential_url,sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw createInternalServerError()
  }

  return (data ?? []).map((certification): PublicCertification => ({
    id: certification.id,
    name: certification.name,
    issuer: certification.issuer,
    issued_date: certification.issued_date,
    credential_url: certification.credential_url,
    sort_order: certification.sort_order,
  }))
})
