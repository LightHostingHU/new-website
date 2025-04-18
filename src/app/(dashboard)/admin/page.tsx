import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/sign-in');
  }
  
  const userId = session.user.id as string;
  async function createNews(formData: FormData) {
    'use server'
    
    if (!session?.user?.email) {
      throw new Error('Not authorized')
    }

    const title = formData.get('title') as string
    const description = formData.get('content') as string

    await db.news.create ({
      data: {
        title,
        description,
        admin_id: Number(userId),
      },
    })
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Hír Létrehozás</h1>
        <form action={createNews} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2">Cím</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full p-2 border rounded "
            />
          </div>
          <div>
            <label htmlFor="content" className="block mb-2">Tartalom</label>
            <textarea
              id="content"
              name="content"
              required
              rows={5}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Hír Létrehozás
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default AdminPage