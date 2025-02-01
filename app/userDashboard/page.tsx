import { auth, signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import React from 'react'

async function Page() {
  const session = await auth()
  const user = session?.user

  if (!user) {
    redirect('/auth')
  }
  return (
   <div className="flex flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <form action={
          async () => {
            "use server"
            await signOut()
            revalidatePath("/userDashboard")
          }
        }>
          <Button type='submit'>signOut</Button>
        </form>
      <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
      <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
      <div className="aspect-video animate-pulse rounded-xl bg-gray-100" />
      </div>
      <div className="min-h-[100vh] animate-pulse flex-1 rounded-xl bg-gray-100" />
   </div>
  )
}

export default Page
