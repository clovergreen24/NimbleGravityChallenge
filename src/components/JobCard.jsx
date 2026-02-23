function JobCard({
  job,
  candidate,
  repoUrl,
  status,
  isSubmitting,
  onRepoChange,
  onSubmit
}) {
  return (
    <li className="job-card">
      <h3>{job.title}</h3>
      <p className="job-id">ID: {job.id}</p>

      <input
        type="url"
        placeholder="https://github.com/tu-usuario/tu-repo"
        value={repoUrl}
        onChange={(e) => onRepoChange(job.id, e.target.value)}
      />

      <button
        type="button"
        disabled={isSubmitting || !candidate}
        onClick={() => onSubmit(job.id)}
      >
        {isSubmitting ? "Enviando..." : "Submit"}
      </button>

      {status?.message && (
        <p className={`message ${status.type}`}>
          {status.message}
        </p>
      )}
    </li>
  );
}

export default JobCard;