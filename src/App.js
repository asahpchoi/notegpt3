import "./styles.css";

import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactMic } from "react-mic";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MicIcon from "@mui/icons-material/Mic";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ShareIcon from "@mui/icons-material/Share";
import Skeleton from "@mui/material/Skeleton";

import { ButtonGroup } from "@mui/material";
import { uploadToWhisper, getSummary, init } from "./API.js";
import { Summary, Transcript } from "./UI.js";

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
      <ReactMic
        visualSetting="frequencyBars"
        record={recording}
        onStop={onStop}
        onData={onData}
        mimeType="audio/mp3"
      />

      <Stack className="box">
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <Box sx={{ width: 300 }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        </Backdrop>
      </Stack>
    </>
  );

  function showOptions(label, value, setValue, lookup) {
    return (
      <Box className="input">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={value}
            label={label}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          >
            {lookup.map((l, i) => {
              return (
                <MenuItem key={i} value={l}>
                  {l}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    );
  }
  function showTranscript(transcript) {
    return (
      <>
        <TextField
          id="filled-multiline-flexible"
          label="Transcript or URL"
          multiline
          rows={4}
          variant="filled"
          value={transcript}
          className="multiline"
          onChange={(event) => {
            setTranscript(event.target.value);
          }}
        />
        <Box className="input">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Act as</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={actas}
              label="Act as"
              onChange={(event) => {
                setActas(event.target.value);
              }}
            >
              {actasList.map((l, i) => {
                return (
                  <MenuItem key={i} value={l}>
                    {l}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <ButtonGroup>
          <Button
            variant="outlined"
            onClick={async () => {
              setLoading(true);
              setSummary(await getSummary(transcript, actas));
              setLoading(false);
            }}
          >
            <SummarizeIcon />
            Get Summary
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              navigator.share({ title: "Happy Share", text: transcript });
            }}
          >
            <ShareIcon />
            Share
          </Button>
        </ButtonGroup>
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
