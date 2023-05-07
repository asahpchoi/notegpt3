import "./styles.css";

import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MicIcon from "@mui/icons-material/Mic";

import { ReactMic } from "react-mic";
import { uploadToWhisper, getSummary, init } from "./API.js";
import { Summary, Transcript, LoadingPage } from "./UI.js";

export default function App() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState();
  const [transcript, setTranscript] = useState("Speak or Type here");
  const [summary, setSummary] = useState();

  const [actas, setActas] = useState("act as an assistant to take note");
  const [actasList, setActasList] = useState([]);

  useEffect(() => {
    init(setActasList);
  }, []);

  const onStop = async (blob) => {
    setSrc(blob.blobURL);
    setLoading(true);
    setTranscript(await uploadToWhisper(blob));
    setLoading(false);
  };

  const onData = (blob) => {};

  return (
    <>
      <Stack className="box">
        <ReactMic
          visualSetting="frequencyBars"
          record={recording}
          onStop={onStop}
          onData={onData}
          mimeType="audio/mp3"
        />
        {!loading && (
          <Button
            variant="outlined"
            onClick={() => {
              setRecording(!recording);
            }}
          >
            <MicIcon />
            {recording ? "Stop recording" : "Start Recording"}
          </Button>
        )}
        <div className="row content">
          {!loading && transcript && (
            <Transcript
              transcript={transcript}
              setTranscript={setTranscript}
              actas={actas}
              setActas={setActas}
              setSummary={setSummary}
              getSummary={getSummary}
              setLoading={setLoading}
              actasList={actasList}
            />
          )}
          {!loading && summary && <Summary summary={summary} />}
        </div>
        <LoadingPage loading={loading} />
      </Stack>
    </>
  );
}
