import "./styles.css";
import "./styles.css";

import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactMic } from "react-mic";
import TextField from "@mui/material/TextField";

export default function App() {
  //const apiKey = "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";

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const [src, setSrc] = useState();
  const [transcript, setTranscript] = useState();
  const [summary, setSummary] = useState();

  async function getSummary(transcript) {
    setLoading(true);
    const result = await axios.post(
      `https://4q8slb-3000.csb.app/getSummary`,
      {
        transcript,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //setSummary(result.data.summary);
    // /console.log();
    setLoading(false);
    setSummary(result.data.summary.content);
  }

  async function uploadToWhisper(blob) {
    setLoading(true);
    const url = `https://4q8slb-3000.csb.app/upload`;

    const data = new FormData();

    const file = new File([blob.blob], "speech.mp3", { type: "audio/mp3" });

    data.append("file", file);

    console.log({ data, blob, file });

    const resp = await axios.post(url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setTranscript(resp.data.result);
    //setSummary(resp.data.summary);
    setLoading(false);
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
      {!loading && (
        <Button
          onClick={() => {
            setRecording(!recording);
          }}
        >
          {recording ? "Stop" : "Start"}
        </Button>
      )}
      {loading ? "Loading" : ""}
      <ReactMic
        record={recording}
        onStop={onStop}
        onData={onData}
        mimeType="audio/mp3"
      />
      {!loading && transcript && <>{showTranscript(transcript)}</>}
      {!loading && summary && <>{showSummary(summary)}</>}
    </Stack>
  );
  function showTranscript(transcript) {
    return (
      <>
        <TextField
          id="filled-multiline-flexible"
          label="transcript"
          multiline
          maxRows={4}
          variant="filled"
          value={transcript}
          onChange={(event) => {
            console.log(event.target.value);
            setTranscript(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            getSummary(transcript);
          }}
        >
          Get Summary
        </Button>
      </>
    );
  }
  function showSummary(summary) {
    return (
      <>
        <TextField
          id="filled-multiline-flexible"
          label="Summary"
          multiline
          maxRows={4}
          variant="filled"
          value={summary}
        />
        <Button
          onClick={() => {
            navigator.share({ title: "Happy Share", text: summary });
          }}
        >
          Send Email
        </Button>
      </>
    );
  }
}

function audioUI() {
  return (
    <>
      <audio controls={true} src={src}></audio>
      <a href={src}>Download audio </a>
    </>
  );
}
