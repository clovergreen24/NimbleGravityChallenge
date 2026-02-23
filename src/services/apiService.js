const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

const parseJsonResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return response.json();
};

export const getCandidateByEmail = async (email) => {
  const response = await fetch(
    `${BASE_URL}/api/candidate/get-by-email?email=${encodeURIComponent(email)}`
  );

  return parseJsonResponse(response, "No se pudo obtener el candidato.");
};

export const getJobsList = async () => {
  const response = await fetch(`${BASE_URL}/api/jobs/get-list`);
  const data = await parseJsonResponse(
    response,
    "No se pudo obtener la lista de posiciones."
  );

  return Array.isArray(data) ? data : [];
};

export const applyToJob = async ({ uuid, candidateId, jobId, repoUrl }) => {
  const response = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uuid,
      candidateId,
      jobId,
      repoUrl,
    }),
  });

  const data = await parseJsonResponse(response, "No se pudo enviar la postulacion.");

  if (!data?.ok) {
    throw new Error("La API respondio sin confirmar la postulacion.");
  }

  return data;
};
