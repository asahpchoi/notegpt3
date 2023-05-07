import "./styles.css";

import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
 


import { ReactMic } from "react-mic";
import { uploadToWhisper, getSummary, init } from "./comps/API.js";
import { Summary, Transcript, LoadingPage, Header, Recording } from "./comps/UI.js";

export default function App({ analytics }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState();
  const [transcript, setTranscript] = useState("Speak or Type here");
  const [summary, setSummary] = useState();

  const [actas, setActas] = useState("act as an assistant to take note");
  const [actasList, setActasList] = useState([]);

  useEffect(() => {
    init(setActasList);
    console.log(analytics);
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
        <Header />   
         <div className="row content">
        {!loading &&  <Recording setRecording={setRecording} recording={recording}/>} 
 
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
                <ReactMic
          visualSetting="frequencyBars"
          record={recording}
          onStop={onStop}
          onData={onData}
          mimeType="audio/mp3"
        />
      </Stack>
    </>
  );
}
