import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center w-[450px]">

        <h1 className="text-4xl font-bold mb-3">
          Bug Tracking Portal
        </h1>

        <p className="text-gray-600 mb-8">
          Track, Assign and Resolve Bugs Efficiently
        </p>

        <div className="space-y-4">

          <Link href="/register">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              register
            </button>
          </Link>

          <Link href="/login">
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
              login
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}