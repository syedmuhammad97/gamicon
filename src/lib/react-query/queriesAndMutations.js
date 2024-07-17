// @ts-check
/// <reference path="../../types/index.d.ts" />

import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
    QueryClient,
  } from '@tanstack/react-query';
  import {  createBooking, createPost, createUserAccount, deleteBooking, deletePost, deleteSavePosts, getCurrentUser, getInfinitePosts, getPostID, getRecentPosts, getUserBookings, getUserById, likePosts, savePosts, searchPosts, signInAccount, signOutAccount, updateBookingAttendees, updatePost, updateUser } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

  
  /**
   * @typedef {import('@/types').INewUser} INewUser
   */
  
  /**
   * Use this hook to create a new user account.
   * @returns {import('@tanstack/react-query').UseMutationResult<void, unknown, INewUser, unknown>} Mutation result object.
   */
  export const useCreateUserAccount = () => {
    return useMutation({
      /**
       * Mutation function to create a new user account.
       * @param {INewUser} user - The user object containing account details.
       * @returns {Promise<void>} - A promise that resolves when the user account is created.
       */
      mutationFn: (user) => createUserAccount(user),
    });
  };

  /**
 * @typedef {Object} SignInUser
 * @property {string} email - The user's email.
 * @property {string} password - The user's password.
 */

/**
 * Use this hook to sign in an account.
 * @returns {import('@tanstack/react-query').UseMutationResult<void, unknown, SignInUser, unknown>} Mutation result object.
 */
export const useSignInAccount = () => {
    return useMutation({
      /**
       * Mutation function to sign in an account.
       * @param {SignInUser} user - The user object containing email and password.
       * @returns {Promise<void>} - A promise that resolves when the account is signed in.
       */
      mutationFn: (user) => signInAccount(user),
    });
  };

export const useSignOutAccount = () => {
  return useMutation({
   
    mutationFn: signOutAccount
  });
};


export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * 
     * @param {import('@/types').INewPost} post 
     * @returns 
     */
    mutationFn: (post) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
    }
  })
}

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * 
     * @param {import('@/types').INewBooking} book
     * @returns 
     */
    mutationFn: (book) => createBooking(book),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_BOOKINGS]
      })
    }
  })
}

////////////////////// FETCH BOOKINGS BY USER ID ///////////////////////////////

/**
 * Custom hook to get bookings for a specific user.
 * @param {string} userId - The user's ID.
 * @returns {object} The query object from React Query.
 */
export const useGetUserBookings = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BOOKINGS, userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId, // Only run this query if userId is not null or undefined
  });
};



////////////////////////////////////////////////////////////////////////////////

//////////////////////// UPDATE BOOKING ATTENDEES //////////////////////////////

/**
 * Custom hook to update the attendees of a booking.
 * @returns {object} The mutation object from React Query.
 */
export const useUpdateBookingAttendees = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * @param {Object} data
     * @param {string} data.bookingId - The booking ID.
     * @param {string} data.userId - The user ID to add to attendees.
     * @returns {Promise<any>} - The result of updateBookingAttendees function.
     */
    mutationFn: ({ bookingId, userId }) => updateBookingAttendees(bookingId, userId),
    onSuccess: (_, { bookingId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BOOKINGS, userId]
      });
    },
    onError: (error) => {
      console.error("Error updating booking attendees:", error);
    }
  });
};


//////////////////////////////////////////////////////////////////////////////

/**
 * @typedef {Object} LikePostParams
 * @property {string} postId - The ID of the post to like.
 * @property {string[]} likesArray - The array of likes.
 */

/**
 * useLikePost hook
 * @returns {Object} - The mutation object from useMutation.
 */

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Mutation function to like a post.
     * @param {LikePostParams} params - The parameters for liking a post.
     * @returns {Promise<any>} - The result of the likePosts function.
     */
    mutationFn: ({ postId, likesArray }) => likePosts(postId, likesArray),
    onSuccess: ()  => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }})
}

/**
 * @typedef {Object} SavePostParams
 * @property {string} postId - The ID of the post to like.
 * @property {string} userId - The ID of the user.
 */

/**
 * useLikePost hook
 * @returns {Object} - The mutation object from useMutation.
 */

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Mutation function to like a post.
     * @param {SavePostParams} params - The parameters for saving a post.
     * @returns {Promise<any>} - The result of the likePosts function.
     */
    mutationFn: ({ postId, userId }) => savePosts(postId, userId),
    onSuccess: (data)  => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }})
}


export const useDeleteSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    /**
     * Mutation function to like a post.
     * @param {string} saveRecordId - The parameters for save record ID.
     * 
     */
    mutationFn: (saveRecordId) => deleteSavePosts(saveRecordId),
    onSuccess: ()  => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER]
      })
    }})
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

/**
 * 
 * @param {string} postId 
 * @returns 
 */
export const useGetPostID = (postId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostID(postId),
    enabled: !!postId
  })
}

/**
 * @typedef {import('@/types').IUpdatePost} IUpdatePost
 */

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    /**
     * Mutation function to update a post.
     * @param {IUpdatePost} post - The post to update.
     * @returns 
     */
    mutationFn: (post) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
      })
    }
  });
}


/**
 * @typedef {Object} DeletePostParams
 * @property {string} postId - The ID of the post to delete.
 * @property {string} imageId - The ID of the image to delete.
 */

/**
 * UseDeletePost hook.
 * @returns {import('@tanstack/react-query').UseMutationResult<{ status: string }, Error, DeletePostParams>}
 */

//error may come from here
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    /**
     * Mutation function to delete a post.
     * @param {DeletePostParams} params - The parameters for deleting a post.
     * @returns {Promise<{ status: string }>}
     */
    mutationFn: ({ postId, imageId }) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

/////////////////////////////// USE DELETE BOOKING /////////////////////////

/**
 * @typedef {Object} DeleteBookingParams
 * @property {string} bookingId - The ID of the post to delete.
 */

/**
 * UseDeleteBooking hook.
 * @returns {import('@tanstack/react-query').UseMutationResult<{ status: string }, Error, DeleteBookingParams>}
 */

export const UseDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    /**
     * Mutation function to delete a booking.
     * @param {DeleteBookingParams} params - The parameters for deleting a booking.
     * @returns {Promise<{ status: string }>}
     */
    mutationFn: ({bookingId}) => deleteBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_BOOKINGS]
      })
    }
  })
}

///////////////////////////////////////////////////////////////////////////

/**
 * Hook to fetch infinite posts.
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult<any, Error>} The result of the query.
 */
export const useGetPost = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    /**
     * Function to fetch posts.
     * @param {Object} params - The parameters object.
     * @param {number} [params.pageParam=0] - The page parameter.
     * @returns {Promise<any>} The list of posts.
     */
    queryFn: ({ pageParam = 0 }) => getInfinitePosts({ pageParam }),
    /**
     * Get the next page parameter.
     * @param {any} lastPage - The last page of the query result.
     * @returns {any} The next page parameter.
     */
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.documents.length === 0) return null;
      const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
      return lastId;
    },
    initialPageParam: 0, // Set the initial page parameter
  });
};

/**
 * 
 * @param {string} searchTerm 
 */
export const useSearchPost = (searchTerm) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm
  })
}

/**
 * 
 * @param {string} userId 
 */
export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

/**
 * @typedef {import('@/types').IUpdateUser} IUpdateUser
 */

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    /**
     * @param {IUpdateUser} user
     * @returns {Promise<any>}
     */
    mutationFn: (user) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

