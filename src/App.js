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

export default function App() {
  //const apiKey = "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";

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState();
  const [transcript, setTranscript] = useState("Speak or Type here");
  const [summary, setSummary] = useState();
  const [age, setAge] = useState(10);

  const [actas, setActas] = useState("act as an assistant to take note");
  const [actasList, setActasList] = useState([]);
  const [goal, setGoal] = useState("assistant");
  const [restriction, setRestriction] = useState("assistant");
  const [answer, setAnswer] = useState("assistant");

  useEffect(async () => {
    const msglist = await axios.get(
      "https://4q8slb-3000.csb.app/getMessageList"
    );
    setActasList(msglist.data);
  }, []);

  const [lookup, setLookup] = useState({
    roles: [
      "journalist",
      "assisstant",
      "expert copy writer",
      "full stack developer",
    ],
    goals: [
      "write an eassay",
      "code a web page",
      "analysis the follow text",
      "explain to a 3 years old children",
      "summarize this text",
    ],
    restrictions: ["adopt a formal tone", "write using basic English"],
    answers: [
      "answer with a number list",
      "answer with code",
      "answer with bullet points",
    ],
  });

  async function getSummary(transcript, actas) {
    setLoading(true);
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
      <ReactMic
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

      {!loading && transcript && <>{showTranscript(transcript)}</>}
      {!loading && summary && <>{showSummary(summary)}</>}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
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
            {lookup.map((l) => {
              return <MenuItem value={l}>{l}</MenuItem>;
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
          maxRows={4}
          variant="filled"
          value={transcript}
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
              {actasList.map((l) => {
                return <MenuItem value={l}>{l}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="outlined"
          onClick={() => {
            getSummary(transcript, actas);
          }}
        >
          <SummarizeIcon />
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
