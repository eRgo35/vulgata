import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  CssBaseline,
  IconButton,
  styled,
  SwipeableDrawer,
} from "@mui/material";
import { Global } from "@emotion/react";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Scripture from "./components/Scripture";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import vulgata from "./assets/vul.tsv?raw";
import { ParsedVulgata } from "./types/ParsedVulgata";
import DrawerContent from "./components/DrawerContent";
import { FirstPage, LastPage } from "@mui/icons-material";

const Root = styled("div")(({ theme }) => ({
  height: "100vh",
  backgroundColor: grey[100],
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.default,
  }),
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[800],
  }),
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
  ...theme.applyStyles("dark", {
    backgroundColor: grey[900],
  }),
}));

const parseTsvData = () => {
  const parsedVulgata: ParsedVulgata = vulgata
    .split("\r\n")
    .reduce((acc: ParsedVulgata, line: string) => {
      const [book, _abbreviation, _bookNo, chapter, verse, text] =
        line.split("\t");

      if (!acc[book]) {
        acc[book] = {};
      }

      if (!acc[book][chapter]) {
        acc[book][chapter] = {};
      }

      acc[book][chapter][verse] = text;

      return acc;
    }, {});

  return parsedVulgata;
};

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

function App() {
  const [open, setOpen] = useState(false);
  const [vulgate, setVulgate] = useState<ParsedVulgata>({});
  const [loading, setLoading] = useState(true);

  const [book, setBook] = useState("Genesis");
  const [chapter, setChapter] = useState(1);

  useEffect(() => {
    setVulgate(parseTsvData());
    setLoading(false);
  }, []);

  const drawerBleeding = 56;

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const nextChapter = () => {
    if (chapter === Object.keys(vulgate[book]).length) {
      setBook((prevBook) => {
        const books = Object.keys(vulgate);
        const bookIndex = books.indexOf(prevBook);

        if (bookIndex === books.length - 1) {
          return prevBook;
        }

        const newBook = books[bookIndex + 1];
        setChapter(0);

        return newBook;
      });
    }

    setChapter((prevChapter) => prevChapter + 1);
  };

  const previousChapter = () => {
    if (chapter === 1) {
      setBook((prevBook) => {
        const books = Object.keys(vulgate);
        const bookIndex = books.indexOf(prevBook);

        if (bookIndex === 0) {
          return prevBook;
        }

        const newBook = books[bookIndex - 1];
        setChapter(Object.keys(vulgate[newBook]).length + 1);

        return newBook;
      });
    }

    setChapter((prevChapter) => prevChapter - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <CssBaseline />
        {loading ? (
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Global
              styles={{
                ".MuiDrawer-root > .MuiPaper-root": {
                  height: `calc(50% - ${drawerBleeding}px)`,
                  overflow: "visible",
                },
              }}
            />
            <Box sx={{ textAlign: "center" }}>
              <Scripture
                vulgate={vulgate}
                selectedBook={book}
                selectedChapter={chapter}
              />
            </Box>
            <SwipeableDrawer
              anchor="bottom"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
              swipeAreaWidth={drawerBleeding}
              allowSwipeInChildren={(e) => {
                const target = e.target as HTMLElement;
                return target.closest(".MuiIconButton-root") === null;
              }}
            >
              <StyledBox
                sx={{
                  position: "absolute",
                  top: -drawerBleeding,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  visibility: "visible",
                  right: 0,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  pointerEvents: "all",
                }}
              >
                <Puller />
                <Button
                  onClick={toggleDrawer(!open)}
                  sx={{ p: 2, color: "text.secondary" }}
                >
                  {book} {chapter}
                </Button>
                <ButtonGroup>
                  <IconButton
                    size="large"
                    onClick={previousChapter}
                    disabled={book === "Genesis" && chapter === 1}
                  >
                    {chapter === 1 ? <FirstPage /> : <ChevronLeftIcon />}
                  </IconButton>
                  <IconButton
                    size="large"
                    onClick={nextChapter}
                    disabled={book === "Revelation" && chapter === 22}
                  >
                    {chapter === Object.keys(vulgate[book]).length ? (
                      <LastPage />
                    ) : (
                      <ChevronRightIcon />
                    )}
                  </IconButton>
                </ButtonGroup>
              </StyledBox>
              <StyledBox
                sx={{ px: 2, pb: 2, height: "100%", overflow: "auto" }}
              >
                <DrawerContent
                  vulgate={vulgate}
                  book={book}
                  chapter={chapter}
                  setBook={setBook}
                  setChapter={setChapter}
                  toggleDrawer={setOpen}
                />
              </StyledBox>
            </SwipeableDrawer>
          </>
        )}
      </Root>
    </ThemeProvider>
  );
}

export default App;
