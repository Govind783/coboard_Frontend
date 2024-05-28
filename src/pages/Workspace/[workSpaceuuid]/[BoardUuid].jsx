import SpecificBoardIndexConmponent from '@/components/SpecificBoardComponents/SpecificBoardIndexConmponent'
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'
import React from 'react'

const DyanmicRouteForSpecificBoard = () => {
  return (
    <div className='w-full h-full'>
        <SpecificBoardIndexConmponent />
    </div>
  )
}

export default withPageAuthRequired(DyanmicRouteForSpecificBoard)