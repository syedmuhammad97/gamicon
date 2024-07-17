import { Loader } from 'lucide-react'
import React from 'react'
import GridPostList from './GridPostList'

/**
 * @typedef {Object} SearchResultProps
 * @property {import('appwrite').Models.Document[]} searchPosts - The array of searchPosts documents.
 * @property {boolean} isSearchFetching
 */

/**
 * SearchResultProps component
 * @param {SearchResultProps} props - The props for the component.
 * @returns {JSX.Element}
 */

const SearchResults = ({isSearchFetching, searchPosts}) => {
  if(isSearchFetching) return <Loader className='item-center w-full' />

  if(searchPosts && searchPosts.documents.length > 0) {
    return(
      <GridPostList post={searchPosts.documents}/>
    )
  }

  return (
    <p className='text-white w-full mt-10 text-center'>No posts found</p>
  )
}

export default SearchResults