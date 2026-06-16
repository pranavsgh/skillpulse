export default function JobCard({ job }) {
  // Todo Pranav: mobile card view of a single job
  return (
    <div className="border rounded p-4 mb-2">
      <a href={job.url} className="font-medium text-pulse-600 hover:underline">{job.title}</a>
      <p className="text-sm text-gray-500">{job.company} â {job.location}</p>
    </div>
  );
}
