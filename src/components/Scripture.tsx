import { Container, styled, Typography } from "@mui/material";
import { ParsedVulgata } from "../types/ParsedVulgata";
import { FC, useState } from "react";
import { blue, grey } from "@mui/material/colors";

type Props = {
  vulgate: ParsedVulgata;
  selectedBook: string;
  selectedChapter: number;
};

interface HighlightableTextProps {
  isActive: boolean;
}

const HighlightableText = styled("span")<HighlightableTextProps>(
  ({ theme, isActive }) => ({
    backgroundColor: isActive ? blue[200] : "transparent",
    ...theme.applyStyles("dark", {
      backgroundColor: isActive ? blue[900] : "transparent",
    }),
  }),
);

const Scripture: FC<Props> = ({ vulgate, selectedBook, selectedChapter }) => {
  const book = vulgate[selectedBook];
  const chapter = book ? book[selectedChapter] : null;

  const [selectedVerses, setSelectedVerses] = useState<Set<string>>(new Set());

  const selectVerse = (verse: string) => {
    const newSelectedVerses = new Set(selectedVerses);
    if (newSelectedVerses.has(verse)) {
      newSelectedVerses.delete(verse);
    } else {
      newSelectedVerses.add(verse);
    }
    setSelectedVerses(newSelectedVerses);
  };

  return chapter ? (
    <Container
      sx={{ paddingBottom: "56px", textAlign: "justify", hyphens: "auto" }}
    >
      <p>
        {Object.entries(chapter).map(([verse, text]) => (
          <span onClick={() => selectVerse(verse)} key={verse}>
            <strong> {verse} </strong>
            <HighlightableText isActive={selectedVerses.has(verse)}>
              {text}
            </HighlightableText>
          </span>
        ))}
      </p>
    </Container>
  ) : (
    <Container
      sx={{
        paddingBottom: "56px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6">Oops...</Typography>
      <Typography variant="body1" sx={{ color: grey[500] }}>
        This chapter does not exist
      </Typography>
    </Container>
  );
};

export default Scripture;
