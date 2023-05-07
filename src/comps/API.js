import axios from "axios";

async function uploadToWhisper(blob) {
  const url = `https://4q8slb-3000.csb.app/upload`;

  const data = new FormData();

  const file = new File([blob.blob], "speech.mp3", { type: "audio/mp3" });

  data.append("file", file);

  const resp = await axios.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return resp.data.result;
}

async function getSummary(transcript, actas) {
  const result = await axios.post(
    `https://4q8slb-3000.csb.app/getSummary`,
    {
      transcript,
      actas,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result.data.summary.content;
}

const init = async (setActasList) => {
  const msglist = await axios.get("https://4q8slb-3000.csb.app/getMessageList");
  setActasList(msglist.data);
};
export { uploadToWhisper, getSummary, init };
