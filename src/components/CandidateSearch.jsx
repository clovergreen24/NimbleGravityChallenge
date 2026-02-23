function CandidateSearch({
  email,
  setEmail,
  onSearch,
  loading,
  error,
  candidate
}) {
  return (
    <section className="panel">
      <h2>1) Cargar datos</h2>

      <div className="controls">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu-email@ejemplo.com"
        />

        <button type="button" onClick={onSearch} disabled={loading}>
          {loading ? "Cargando..." : "Buscar"}
        </button>
      </div>

      {error && <p className="message error">{error}</p>}

      {candidate && (
        <p className="candidate">
          Candidato: {candidate.firstName} {candidate.lastName}
        </p>
      )}
    </section>
  );
}

export default CandidateSearch;