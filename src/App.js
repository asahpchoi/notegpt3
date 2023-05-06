import "./styles.css";
import "./styles.css";

import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import { ReactMic } from "react-mic";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MicIcon from "@mui/icons-material/Mic";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ShareIcon from "@mui/icons-material/Share";
import Skeleton from "@mui/material/Skeleton";
import Service from "./Service.js";

import { ButtonGroup } from "@mui/material";

export default function App() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState();
  const [transcript, setTranscript] = useState("Speak or Type here");
  const [summary, setSummary] = useState();

  const [actas, setActas] = useState("act as an assistant to take note");
  const [actasList, setActasList] = useState([]);

  useEffect(() => {
    const init = async () => {
      const msglist = await axios.get(
        "https://4q8slb-3000.csb.app/getMessageList"
      );
      setActasList(msglist.data);
    };
    init();
  }, []);
  const [lookup, setLookup] = useState({});

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
    setSummary(result.data.summary.content);
  }

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
    setTranscript(resp.data.result);
  }

  const onStop = async (blob) => {
    setSrc(blob.blobURL);
    setLoading(true);
    await uploadToWhisper(blob);
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
        echoCancellation={false} // defaults -> false
        autoGainControl={false} // defaults -> false
        noiseSuppression={false} // defaults -> false
        channelCount={1}
        style={{ height: "10px" }}
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
          {!loading && transcript && <>{showTranscript(transcript)}</>}
          {!loading && summary && <>{showSummary(summary)}</>}
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
            console.log(event.target.value);
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
              await getSummary(transcript, actas);
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
  function showSummary(summary) {
    return (
      <>
        <TextField
          id="filled-multiline-flexible"
          label="Summary"
          multiline
          variant="filled"
          value={summary}
          className="multiline"
          rows={4}
        />
        <Button
          variant="outlined"
          onClick={() => {
            navigator.share({ title: "Happy Share", text: summary });
          }}
        >
          <ShareIcon />
          Share
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
