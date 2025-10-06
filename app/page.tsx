import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  // Check if Supabase is configured
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              HMS Setup Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please configure your Supabase environment variables to continue.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <h3 className="font-semibold mb-2">Steps to configure:</h3>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
                <li>2. Create a new project or select existing one</li>
                <li>3. Go to Settings → API</li>
                <li>4. Copy your Project URL and anon key</li>
                <li>5. Update the .env.local file with these values</li>
                <li>6. Restart the development server</li>
              </ol>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <p>File: <code className="bg-gray-200 px-1 rounded">.env.local</code></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      redirect("/dashboard")
    } else {
      redirect("/auth/login")
    }
  } catch (error) {
    // If there's an error with Supabase, redirect to login
    redirect("/auth/login")
  }
}
