import JobCard from "./JobCard";

function JobList({
  jobs,
  candidate,
  repoByJobId,
  applyStatusByJobId,
  submittingByJobId,
  onRepoChange,
  onSubmit
}) {
  if (!jobs.length) {
    return <p>No hay posiciones cargadas todavía.</p>;
  }

  return (
    <ul className="job-list">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          candidate={candidate}
          repoUrl={repoByJobId[job.id] || ""}
          status={applyStatusByJobId[job.id]}
          isSubmitting={Boolean(submittingByJobId[job.id])}
          onRepoChange={onRepoChange}
          onSubmit={onSubmit}
        />
      ))}
    </ul>
  );
}

export default JobList;