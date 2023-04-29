import "./styles.css";
import "./styles.css";

import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactMic } from "react-mic";

export default function App() {
  //const apiKey = "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";

  const [recording, setRecording] = useState(false);
  const [src, setSrc] = useState();
  const [text, setText] = useState();
  const [summary, setSummary] = useState();
  async function uploadToWhisper(blob) {
    const url = `https://4q8slb-3000.csb.app/upload`;

    const data = new FormData();

    const file = new File([blob.blob], "speech.mp3", { type: "audio/mp3" });

    data.append("file", file);

    console.log({ data, blob, file });

    const resp = await axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    setText(resp.data.result);
    setSummary(resp.data.summary);

    console.log({ result: resp.data });
  }

  const onStop = async (blob) => {
    setSrc(blob.blobURL);
    //console.log(await axios.get("https://39gt7y-3000.csb.app/"));
    uploadToWhisper(blob);
  };

  const onData = (blob) => {};

  useEffect(() => {
    //openAICalls(apiKey, transcript.text);
  }, []);

  return (
    <Stack>
      <Button>Config</Button>
      <audio controls={true} src={src}></audio>
      <a href={src}>Download audio </a>
      <ReactMic
        record={recording}
        onStop={onStop}
        onData={onData}
        mimeType="audio/mp3"
      />
      <Button
        onClick={() => {
          setRecording(!recording);
        }}
      >
        {recording ? "Stop" : "Start"}
      </Button>
      <h2>Transcript</h2>
      {text}
      <h2>Summary</h2>
      {summary.content}
    </Stack>
  );
}
