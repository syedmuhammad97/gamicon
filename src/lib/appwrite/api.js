// @ts-check
/// <reference path="../../types/index.d.ts" />

import { AppwriteException, ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { OK } from "zod";

/**
 * Create a new user account.
 * @param {import('../../types').INewUser} user - The user object containing account details.
 * @returns {Promise<void>} - A promise that resolves when the user account is created.
 */

export async function createUserAccount(user) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      userId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageURL: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * @typedef {Object} User
 * @property {string} userId - The user's account ID.
 * @property {string} email - The user's email.
 * @property {string} name - The user's name.
 * @property {URL} imageURL - The user's image URL.
 * @property {string} [username] - The user's username (optional).
 */

/**
 * Saves a user to the database.
 * @param {User} user - The user object containing account details.
 * @returns {Promise<Object>} The newly created user document.
 */

export async function saveUserToDB(user) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

/**
 * @typedef {Object} SignInUser
 * @property {string} email - The user's email.
 * @property {string} password - The user's password.
 */

/**
 * Sign in a user account.
 * @param {SignInUser} user - The user object containing email and password.
 * @returns {Promise<Object>} - A promise that resolves to the user session.
 */
export async function signInAccount(user) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {import('../../types').INewPost} post 
 */

export async function createPost(post){
  try {
    //upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if(!uploadedFile) throw Error;

    //else get fileURL
    const fileURL = await getFilePreview(uploadedFile.$id)

    if(!fileURL) {
      deleteFile(uploadedFile.$id)
      throw Error;
    };

    //convert tags to array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //save post to the database
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        content: post.content,
        imageURL: fileURL,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags
      }
    )

    if(!newPost){
      await deleteFile(uploadedFile.$id)
      throw Error;
    }
    
    return newPost

  } catch (error) {
    console.log(error);
    console.log(post)
  }
}

/**
 * 
 * @param {import('../../types').INewBooking} book 
 */
export async function createBooking(book){
  try {
    const newBooking = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      ID.unique(),
      {
        creator: book.userId,
        dateAndTime: book.dateAndTime,
        userLimit: book.userLimit,
        attendees: book.attendees,
      }   
    )

    return newBooking;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to create booking');
  }
}

/**
 * Fetch bookings for a user.
 * @param {string} userId - The user's ID.
 * @returns {Promise<Object[]>} - A promise that resolves to an array of bookings with user details.
 */
export async function getUserBookings(userId) {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      [Query.equal("creator", userId)]
    );

    const bookings = result.documents;

    // Fetch related user data for each booking, ensuring valid document IDs
    const bookingsWithUser = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const user = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, booking.creator);
          return { ...booking, user };
        } catch (userFetchError) {
          console.error(`Error fetching user data for booking ID ${booking.$id}:`, userFetchError);
          return booking; // Return the booking without user data if fetching fails
        }
      })
    );

    console.log("Fetched bookings with user data:", bookingsWithUser); // Log fetched data for debugging

    return bookingsWithUser;
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error("Failed to fetch user bookings");
  }
}

/////////////////// UPDATE USER BOOKING ATTENDEES //////////////////////////////////

/**
 * Function to update the attendees of a booking.
 * @param {string} bookingId - The booking ID.
 * @param {string} userName - The user's name to add to attendees.
 * @returns {Promise<Object>} - The updated booking document.
 */
export async function updateBookingAttendees(bookingId, userName) {
  try {
    // Fetch the current booking document
    const booking = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.bookingsCollectionId, bookingId);

    // Validate userName
    if (!userName || typeof userName !== 'string' || userName.trim() === '') {
      throw new Error('Invalid userName');
    }

    // Check if the user is already in the attendees list
    if (!booking.attendees.includes(userName)) {
      // Add the user's name to the attendees list
      booking.attendees.push(userName);

      // Update the booking document with the new attendees list
      const updatedBooking = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bookingsCollectionId,
        bookingId,
        { attendees: booking.attendees } // Ensure you pass only the updated attendees array
      );

      return updatedBooking;
    } else {
      // If user is already in attendees list, return the current booking
      return booking;
    }
  } catch (error) {
    console.error('Error updating booking attendees:', error);
    throw new Error('Failed to update booking attendees');
  }
}

///////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {File} file 
 */

export async function uploadFile(file){
try {
  const uploadedFile = await storage.createFile(
    appwriteConfig.storageId,
    ID.unique(),
    file
  )
  return uploadedFile
} catch (error) {
  console.log(error)
}
}

/**
 * 
 * @param {string} fileId 
 */

export async function getFilePreview(fileId){
try {
  const fileUrl = storage.getFilePreview(
    appwriteConfig.storageId,
    fileId,
    2000,
    2000,
    ImageGravity.Top,
    100,
  )
  return fileUrl;
} catch (error) {
  console.log(error);
}
}

/**
 * 
 * @param {string} fileId 
 */

export async function deleteFile(fileId){
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return {status: "ok"}
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts(){
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )

  if(!posts) throw Error;

  return posts;
}

/**
 * 
 * @param {string} postId 
 * @param {string[]} likesArray 
 */
export async function likePosts(postId, likesArray){
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if(!updatedPost) throw Error;

    return updatedPost;

  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {string} postId 
 * @param {string} userId
 */
export async function savePosts(postId, userId){
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if(!updatedPost) throw Error;

    return updatedPost;
    
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {string} saveRecordId
 * 
 */
export async function deleteSavePosts(saveRecordId){
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      saveRecordId,
    )

    if(!statusCode) throw Error;

    return {status: 'ok'};
    
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {string} postId 
 */
export async function getPostID(postId){
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    return post;
  } catch (error) {
    console.log(error)
  }
}

/**
 * 
 * @param {import('../../types').IUpdatePost} post 
 */

export async function updatePost(post){
  const hasFileUpdate = post.file.length > 0;

  try {
    let image = {
      imageURL: post.imageURL,
      imageId: post.imageId
    }

    if(hasFileUpdate) {
      //upload image to storage
      const uploadedFile = await uploadFile(post.file[0]);
      if(!uploadedFile) throw Error;

      //else get fileUrl
      const fileUrl = await getFilePreview(uploadedFile.$id)

      if(!fileUrl) {
        deleteFile(uploadedFile.$id)
        throw Error;
      }
      image = {...image, imageURL: fileUrl, imageId: uploadedFile.$id}
    }

    //convert tags to array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //save post to the database
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        content: post.content,
        imageURL: image.imageURL,
        imageId: image.imageId,
        location: post.location,
        tags: tags
      }
    )

    if(!updatedPost){
      await deleteFile(post.imageId)
      throw Error;
    }
    
    return updatedPost

  } catch (error) {
    console.log(error);
    console.log(post)
  }
}

/**
 * 
 * @param {string} postId 
 * @param {string} imageId 
 */
export async function deletePost(postId, imageId){
  if(!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    )
    return {status: 'ok'}
  } catch (error) {
    console.log(error)
  }
}

///////////////////// DELETE BOOKINGS ////////////////////////////////////

/**
 * Deletes a booking by its ID.
 * @param {string} bookingId - The ID of the booking to delete.
 * @returns {Promise<{ status: string }>} - Status object indicating success or failure.
 */
export async function deleteBooking(bookingId) {
  if (!bookingId) throw new Error("Booking ID is required");

  try {
    // Replace this with your actual deletion logic
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingsCollectionId,
      bookingId
    );

    return { status: 'ok' };
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }
}

//////////////////////////////////////////////////////////////////////////

/**
 * Get infinite posts.
 * @param {Object} params - The parameters object.
 * @param {number} params.pageParam - The page parameter.
 * @returns {Promise<any>} The list of posts.
 */
export async function getInfinitePosts({pageParam}) {
  try {
    /** @type {any[]} */
    const queries = [Query.orderDesc('$updatedAt'), Query.limit(15)];
    
    if(pageParam){
      queries.push(Query.cursorAfter(pageParam.toString()));
    }

    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        queries
      )

      if(!posts) throw Error;
      return posts;

    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get search posts.
 * @param {string} searchTerm - The page searchterm.
 */
export async function searchPosts(searchTerm) {

    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.search('content', searchTerm)]
      )

      if(!posts) throw Error;
      return posts;
      
    } catch (error) {
      console.log(error);
    }
}

/**
 * 
 * @param {string} userId 
 * @returns 
 */
export async function getUserById(userId) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {import("../../types").IUpdateUser} user 
 * @returns 
 */
export async function updateUser(user) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageURL: user.imageURL,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = await getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageURL: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        imageURL: image.imageURL,
        imageId: image.imageId,
        roleType: user.roleType,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Updates user points.
 * @param {string} userId - The user's ID.
 * @param {number} points - The number of points to add.
 * @returns {Promise<void>}
 */
export async function updateUserPoints(userId, points) {
  try {
    // Get the current user document
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Calculate the new points
    const updatedPoints = (user.points || 0) + points;

    // Update the user document with the new points
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { points: updatedPoints }
    );
  } catch (error) {
    console.error('Error updating user points:', error);
    throw new Error('Could not update user points');
  }
}

/**
 * Updates user points.
 * @param {string} userId - The user's ID.
 * @param {number} stars - The number of stars to add.
 * @returns {Promise<void>}
 */
export async function updateUserStars(userId, stars) {
  try {
    // Get the current user document
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    // Calculate the new points
    const updatedStars = (user.stars || 0) + stars;

    // Update the user document with the new points
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { stars: updatedStars }
    );
  } catch (error) {
    console.error('Error updating user points:', error);
    throw new Error('Could not update user points');
  }
}

/**
 * Updates user points and stars after redeeming a reward.
 * @param {string} userId - The ID of the user.
 * @param {number} newPoints - The updated points of the user.
 * @param {number} newStars - The updated stars of the user.
 * @returns {Promise<void>}
 */
export async function updateUserPointsAndStarsAfterRedeem(userId, newPoints, newStars) {
  try {
    // Update user document with new points and stars
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId,
      { points: newPoints, stars: newStars }
    );
  } catch (error) {
    console.error("Error updating user points and stars:", error);
    throw new Error("Failed to update user points and stars");
  }
}

/**
 * 
 * @param {string} userId 
 * @returns 
 */
export const getUserProfile = async (userId) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.userCollectionId, 
      userId);
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};