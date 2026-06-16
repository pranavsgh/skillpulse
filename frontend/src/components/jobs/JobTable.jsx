export default function JobTable({ jobs = [] }) {
  // Todo Pranav: sortable/searchable table of jobs
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">Title</th>
          <th>Company</th>
          <th>Location</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map((job) => (
          <tr key={job.id} className="border-b">
            <td className="py-2">
              <a href={job.url} className="text-pulse-600 hover:underline">{job.title}</a>
            </td>
            <td>{job.company}</td>
            <td>{job.location}</td>
            <td>{job.job_type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
