'use server'

export async function verifyAdminPassword(password: string) {
  const adminPass = process.env.ADMIN_PASSWORD || 'naija_admin_2024'
  return password === adminPass
}
