import axios from "axios";

const API_BASE = "https://ai-meeting-minutes-generator-0v6g.onrender.com";

export const uploadAudio = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(
    `${API_BASE}/api/upload-audio`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const processTranscript = (transcript, model) => {
  return axios.post(`${API_BASE}/api/process-transcript`, {
    transcript,
    model,
  });
};
