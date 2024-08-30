import { FC, useState } from "react";
import { ParsedVulgata } from "../types/ParsedVulgata";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  MobileStepper,
  styled,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

interface DrawerContentProps {
  vulgate: ParsedVulgata;
  book: string;
  chapter: number;
  setBook: (book: string) => void;
  setChapter: (chapter: number) => void;
  toggleDrawer: (open: boolean) => void;
}

// const steps = ["Select Book", "Select Chapter"];

interface ChapterButtonProps {
  selected: boolean;
}

const ChapterButton = styled(IconButton)<ChapterButtonProps>(
  ({ theme, selected }) => ({
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    borderWidth: "1px",
    borderColor: theme.palette.primary.main,
    borderStyle: "solid",
    color: selected
      ? theme.palette.primary.contrastText
      : theme.palette.primary.main,
    backgroundColor: selected
      ? `${theme.palette.primary.main} !important`
      : "transparent",
  }),
);

const DrawerContent: FC<DrawerContentProps> = ({
  vulgate,
  book,
  chapter,
  setBook,
  setChapter,
  toggleDrawer,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleStep = (step: number) => () => {
  //   setActiveStep(step);
  // };

  const handleBookSelect = (book: string) => {
    setBook(book);
    setChapter(1);
    handleNext();
  };

  const handleChapterSelect = (chapter: string) => {
    setChapter(parseInt(chapter));
    toggleDrawer(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <MobileStepper
        variant="dots"
        steps={2}
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: 400, flexGrow: 1, backgroundColor: "transparent" }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 1}>
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            <KeyboardArrowLeft />
          </Button>
        }
      />
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        {activeStep === 0 && (
          <>
            <List component="nav">
              {Object.keys(vulgate).map((book_) => (
                <ListItemButton
                  key={book_}
                  selected={book === book_}
                  onClick={() => handleBookSelect(book_)}
                >
                  {book_}
                </ListItemButton>
              ))}
            </List>
          </>
        )}
        {activeStep === 1 && book && (
          <>
            {/* <List component="nav">
              {Object.keys(vulgate[book]).map((chapter_) => (
                <ListItemButton
                  key={chapter_}
                  selected={chapter === parseInt(chapter_)}
                  onClick={() => handleChapterSelect(chapter_)}
                >
                  {chapter_}
                </ListItemButton>
              ))}
            </List> */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              {Object.keys(vulgate[book]).map((chapter_) => (
                <ChapterButton
                  key={chapter_}
                  onClick={() => handleChapterSelect(chapter_)}
                  selected={chapter === parseInt(chapter_)}
                >
                  {chapter_}
                </ChapterButton>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DrawerContent;
