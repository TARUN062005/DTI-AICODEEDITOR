// /app/dashboard/profile/page.tsx
"use client"

import { useUser } from "@clerk/nextjs"

export default function ProfilePage() {
  const { user } = useUser()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {user?.fullName}
            </h2>
            <p className="text-gray-400">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Account Information</h3>
            <div className="bg-gray-800 p-4 rounded">
              {/* Add your custom profile fields here */}
              <p>Member since: {user?.createdAt?.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}