import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ButtonGroup } from "@mui/material";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MenuItem from "@mui/material/MenuItem";

const Summary = ({ summary }) => {
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
};

const Transcript = ({
  transcript,
  setTranscript,
  actas,
  setActas,
  setSummary,
  getSummary,
  setLoading,
  actasList,
}) => {
  return (
    <>
      <TextField
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
};

export { Summary, Transcript };
