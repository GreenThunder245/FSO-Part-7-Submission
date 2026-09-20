import {
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
} from '@mui/material'
import { useUsers } from '../hooks/useUsers'
import { Link } from 'react-router-dom'

const UserList = () => {
  const { users } = useUsers()
  return (
    <>
      <h1>Users</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Name </TableCell>
              <TableCell> Username </TableCell>
              <TableCell> Blogs created </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow>
                <TableCell>
                  <Link to={`/users/${user.id}`}> {user.name} </Link>
                </TableCell>
                <TableCell> {user.username} </TableCell>
                <TableCell> {user.blogs.length} </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default UserList
