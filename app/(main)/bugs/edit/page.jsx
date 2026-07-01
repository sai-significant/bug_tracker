export default function EditBug() {
  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Edit Bug</h1>

      <div className="space-y-4">
        <input
          className="border p-3 rounded w-full"
          defaultValue="Login Error"
        />

        <textarea
          className="border p-3 rounded w-full"
          rows="5"
          defaultValue="User cannot login."
        />

        <select className="border p-3 rounded w-full">
          <option>Open</option>
          <option>Resolved</option>
        </select>

        <button className="bg-blue-600 text-white px-5 py-2 rounded">
          Update Bug
        </button>
      </div>
    </div>
  );
}