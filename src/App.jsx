import "./App.css";
import { useState } from "react";
import CandidateSearch from "./components/CandidateSearch";
import JobList from "./components/JobList";
import {
  applyToJob,
  getCandidateByEmail as fetchCandidateByEmail,
  getJobsList,
} from "./services/apiService";

function App() {
  const [email, setEmail] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [repoByJobId, setRepoByJobId] = useState({});
  const [applyStatusByJobId, setApplyStatusByJobId] = useState({});
  const [submittingByJobId, setSubmittingByJobId] = useState({});

  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  const getCandidateByEmail = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Ingresa un email para buscar tus datos.");
      return null;
    }

    setLoadingCandidate(true);
    setError("");
    setCandidate(null);
    setApplyStatusByJobId({});

    try {
      const data = await fetchCandidateByEmail(cleanEmail);
      setCandidate(data);

      return data;
    } catch (err) {
      setError(err.message || "Error al obtener candidato.");
      return null;
    } finally {
      setLoadingCandidate(false);
    }
  };

  const getJobs = async () => {
    setLoadingJobs(true);
    setError("");

    try {
      const data = await getJobsList();
      setJobs(data);
    } catch (err) {
      setError(err.message || "Error al obtener las posiciones.");
    } finally {
      setLoadingJobs(false);
    }
  };


  const handleLoadData = async () => {
    const candidateData = await getCandidateByEmail();

    if (candidateData) {
      await getJobs();
    }
  };


  const handleRepoChange = (jobId, value) => {
    setRepoByJobId((prev) => ({
      ...prev,
      [jobId]: value,
    }));
  };


  const handleSubmit = async (jobId) => {
    if (!candidate) {
      setError("Primero carga tus datos de candidato.");
      return;
    }

    const repoUrl = (repoByJobId[jobId] || "").trim();

    if (!repoUrl) {
      setApplyStatusByJobId((prev) => ({
        ...prev,
        [jobId]: {
          type: "error",
          message: "Ingresa la URL del repositorio.",
        },
      }));
      return;
    }

    setSubmittingByJobId((prev) => ({
      ...prev,
      [jobId]: true,
    }));

    setApplyStatusByJobId((prev) => ({
      ...prev,
      [jobId]: { type: "idle", message: "" },
    }));

    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        repoUrl,
        applicationId: candidate.applicationId,
      });

      setApplyStatusByJobId((prev) => ({
        ...prev,
        [jobId]: {
          type: "success",
          message: "Postulacion enviada.",
        },
      }));
    } catch (err) {
      setApplyStatusByJobId((prev) => ({
        ...prev,
        [jobId]: {
          type: "error",
          message:
            err.message || "Error al enviar la postulacion.",
        },
      }));
    } finally {
      setSubmittingByJobId((prev) => ({
        ...prev,
        [jobId]: false,
      }));
    }
  };

  return (
    <main className="app">
      <h1>Nimble Gravity Challenge</h1>

      <CandidateSearch
        email={email}
        setEmail={setEmail}
        onSearch={handleLoadData}
        loading={loadingCandidate || loadingJobs}
        error={error}
        candidate={candidate}
      />

      <section className="panel">
        <h2>2) Posiciones abiertas</h2>

        <JobList
          jobs={jobs}
          candidate={candidate}
          repoByJobId={repoByJobId}
          applyStatusByJobId={applyStatusByJobId}
          submittingByJobId={submittingByJobId}
          onRepoChange={handleRepoChange}
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}

export default App;
