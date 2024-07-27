import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { SMALL_IMG_BASE_URL } from '../utils/constants'
import { formatReleaseDate } from '../utils/dateFunction'
import { Trash } from 'lucide-react'
import toast from 'react-hot-toast'

const SearchHistoryPage = () => {

  function formatDate (dateString) {
    const date = new Date(dateString)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const month = monthNames[date.getMonth()]
    const day = date.getUTCDate()
    const year = date.getUTCFullYear()
    return `${month} ${day}, ${year}`
  }

  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    const getSearchHistory = async () => {
      try {
        const res = await axios.get('/api/v1/search/history')
        setSearchHistory(res.data.content)
      } catch (error) {
        console.log(error.message)
        setSearchHistory([])
      }
    }

    getSearchHistory()
  }, [])

  const handleDetelete = async (entry) => {
    try {
      await axios.delete(`/api/v1/search/history/${entry.id}`)
      setSearchHistory(searchHistory.filter((item) => item.id !== entry.id))
    } catch (error) {
      toast.error("Failed to delete search history")      
    }
  }

  if (searchHistory?.length === 0) {
    return (
      <div className='bg-black min-h-screen text-white'>
        <Navbar/>
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <h1 className='text-3xl font-bold mb-8'>Search History</h1>
          <div className='flex justify-center items-center h-96'>
            <p className='text-xl'>No search history found</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className='bg-black text-white min-h-screen'>
      <Navbar/>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Search History</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4'>
          {searchHistory?.map((entry) => (
            <div key={entry.id}
              className='p-4 bg-gray-800 rounded flex items-start'
            >
              <img src={SMALL_IMG_BASE_URL + entry.image} alt={entry.title}
                className='size-16 rounded-full object-cover mr-4'
              /> 
              <div className='flex flex-col'>
                <span className='text-lg text-white'>{entry.title}</span>
                <span className='text-sm text-gray-400'>{formatDate(entry.createdAt)}</span>
              </div>

              <span
                className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ml-auto 
                ${entry.searchType === 'movie' 
                ? 'bg-red-600' 
                : entry.searchType === 'tv'
                ? 'bg-blue-600'
                : 'bg-green-600'
                }`}
              >
              {
                entry.searchType[0].toUpperCase() + entry.searchType.slice(1)
              }
              </span>

              <Trash 
                className='size-5 ml-4 cursor-pointer hover:fill-red-600 hover:text-red-600'
                onClick={() => handleDetelete(entry)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchHistoryPage