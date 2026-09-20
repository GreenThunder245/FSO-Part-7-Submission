import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'

export const useUsers = () => {

  const result = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })
  return { 
    users: result.data,
    usersPending: result.isPending,
    usersError: result.isError,
  }
}