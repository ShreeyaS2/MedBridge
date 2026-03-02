import { supabase } from './supabase'

export async function signUp(email: string, password: string, profile: {
  fname: string, age: string, diagnosis: string, doctorName: string, doctorNum: string
}) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  await supabase.from('profiles').insert({
    id: data.user!.id,
    fname: profile.fname,
    age: parseInt(profile.age) || null,
    diagnosis: profile.diagnosis,
    doctor_name: profile.doctorName,
    doctor_whatsapp: profile.doctorNum
  })
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return data
}