import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const uploadAudio = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(
    "http://localhost:8080/api/upload-audio",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


export const processTranscript = (transcript, model) => {
  return axios.post("http://localhost:8080/api/process-transcript", {
    transcript,
    model,
  });
};

