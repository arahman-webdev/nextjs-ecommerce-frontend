import React from 'react'

export default function PageLoading({message}:{message:string}) {
    return (
        <div>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                        style={{ borderColor: '#83B734' }}></div>
                    <p className="mt-4 text-gray-600">Loading {message}.....</p>
                </div>
            </div>
        </div>
    )
}
