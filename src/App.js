import { useEffect, useRef, useState } from "react";
import "../src/index.css";
import StarRating from "./ReusableComponent/StarRating";
import { useMovies } from "./CustomHooks/useMovies";
import { useLocalStorageState } from "./CustomHooks/useLocalStorageState";
import { useKey } from "./CustomHooks/useKey";
import { NavBar } from "./ReusableComponent/NavBar";
import { NumResults } from "./Components/NumResults";
import { Main } from "./Components/Main";
import { Box } from "./ReusableComponent/Box";
import { Loader } from "./ReusableComponent/Loader";
import { MovieList } from "./Components/MovieList";
import { ErrorMessage } from "./ReusableComponent/ErrorMessage";
import { MovieDetails } from "./Components/MovieDetails";
import { WatchedSummary } from "./Components/WatchedSummary";
import { WatchedMoviesList } from "./Components/WatchedMoviesList";
import { Search } from "./ReusableComponent/Search";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "a994eadb";
//Structural
export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  //setter will update the state and the localstorage.
  //watched will be set when the app mounts
  const [watched, setWatched] = useLocalStorageState([], "watched");
  // const [watched, setWatched] = useState([]);
  //initialize the state with a call back function to always get the watched
  //list from localstorage when the app rerendes
  // const [watched, setWatched] = useState(() => {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });
  // custom hook
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const tempQuery = "The fault in our stars";

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie(id) {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    //My idea to not add a rated movie already in the watched list.
    // for (let i = 0; i < watched.length; i++) {
    //   if (watched[i].imdbID === movie.imdbID) {
    //     return;
    //   }
    // }
    setWatched((watched) => [...watched, movie]);
    //The value in localstorage should be a string.
    //if we use localstorage in event handler we will use handleDelete to reset the storage.
    // localStorage.setItem("watched",JSON.stringify([...watched, movie]))
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      {/* appling composition (eleminating prop drilling)
      movies now passed from app*/}
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* Under the hood of React they are the same */}
        {/* Explicitly passing the component through element prop 
        This pattern is used in React Router Library*/}
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />{" "}
            </>
          }
        /> */}
        {/* ///////////////////////////////////////////////// */}
        {/* Implicitly passing the component inside Box
        Using children prop with composition */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

// //Stateful
// function ListBox({ children }) {
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen1((open) => !open)}
//       >
//         {isOpen1 ? "–" : "+"}
//       </button>
//       {/* render children not object of children like this {children} */}
//       {isOpen1 && children}
//     </div>
//   );
// }
// //Stateful
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);

//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
