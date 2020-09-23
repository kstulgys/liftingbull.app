import { useDocument } from '@nandorojo/swr-firestore'
import { useRouter } from 'next/dist/client/router'
import { useAuth } from './useAuth'

export function useSettings() {
  const { user } = useAuth((store) => store)
  const { data, update, error } = useDocument(`settings/${user?.uid}`, {
    listen: true,
  })
  const router = useRouter()

  if (user?.uid) router.push('/signup')

  return data
}
