export default function BugDetails() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bug Details</h1>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <p><strong>Title:</strong> Login Error</p>

        <p>
          <strong>Description:</strong>
          User cannot login after entering valid credentials.
        </p>

        <p>
          <strong>Priority:</strong> High
        </p>

        <p>
          <strong>Status:</strong> Open
        </p>

        <div className="space-x-4">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded">
            Edit
          </button>

          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}