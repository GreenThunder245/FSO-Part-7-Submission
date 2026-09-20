import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'

export const useBlogs = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()
  const navigate = useNavigate()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onError: () => {
      dispatch({
        type: 'set',
        text: 'Expired Login',
        severity: 'error',
      })
      setTimeout(() => {
        dispatch({
          type: 'clear',
        })
      }, 5000)
    },
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      dispatch({
        type: 'set',
        text: `a new blog ${newBlog.title}, by ${newBlog.author}`,
        severity: 'success',
      })
      setTimeout(() => {
        dispatch({
          type: 'clear',
        })
      }, 5000)
      navigate('/')
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: (blog) => {
      const blogObject = {
        user: blog.user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url,
      }
      return blogService.update(blogObject, blog.id)
    },
    onError: () => {
      dispatch({
        type: 'set',
        text: 'Expired Login',
        severity: 'error',
      })
      setTimeout(() => {
        dispatch({
          type: 'clear',
        })
      }, 5000)
    },
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
      )
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onError: () => {
      dispatch({
        type: 'set',
        text: 'Expired Login',
        severity: 'error',
      })
      setTimeout(() => {
        dispatch({
          type: 'clear',
        })
      }, 5000)
    },
    onSuccess: (data, id) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.filter((blog) => blog.id !== id),
      )
      navigate('/')
    },
  })

  const commentBlogMutation = useMutation({
    mutationFn: ({ id, comment }) => {
      return blogService.comment(id,comment)
    },
    // onError: () => {
    //   dispatch({
    //     type: 'set',
    //     text: 'Expired Login',
    //     severity: 'error',
    //   })
    //   setTimeout(() => {
    //     dispatch({
    //       type: 'clear',
    //     })
    //   }, 5000)
    // }
    onSuccess: (updatedBlog) => {
      console.log(updatedBlog)
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
      )
    }
  })

  return {
    blogs: result.data,
    blogsPending: result.isPending,
    blogsError: result.isError,
    addBlog: (content) => newBlogMutation.mutate(content),
    likeBlog: (blog) => updateBlogMutation.mutate(blog),
    removeBlog: (id) => deleteBlogMutation.mutate(id),
    commentBlog: ({id, comment}) => commentBlogMutation.mutate({id, comment})
  }
}
