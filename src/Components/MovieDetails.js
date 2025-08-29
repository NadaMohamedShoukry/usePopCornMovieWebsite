import { useEffect, useRef, useState } from "react";
import { useKey } from "../CustomHooks/useKey";
import { ErrorMessage } from "../ReusableComponent/ErrorMessage";
import { Loader } from "../ReusableComponent/Loader";
import StarRating from "../ReusableComponent/StarRating";
const KEY = "a994eadb";
export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);
  //we are not allowed to mutate refs in render logic so use useEffect
  useEffect(() => {
    if (userRating) {
      countRef.current = countRef.current + 1;
    }
  }, [userRating]);
  //check the selected id in the array of ids derived from watched movie array
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // optional chaining to ensure that userRating is taken from the book that exsists in the watched list
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);

    onCloseMovie();
  }
  useKey(onCloseMovie, "Escape");
  // useEffect(() => {
  //   function callBack(e) {
  //     if (e.code === "Escape") {
  //       onCloseMovie();
  //       console.log("Closing");
  //     }
  //   }
  //   document.addEventListener("keydown", callBack);
  //   return () => document.removeEventListener("keydown", callBack);
  // }, [onCloseMovie]);
  async function getMoieDetails() {
    try {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      if (!res.ok) throw new Error("Something went wrong with fetching data!");
      const data = await res.json();
      // if (data.Response === "False") throw new Error("Movie not Found!");
      setMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getMoieDetails();
  }, [selectedId]);

  //to change the title of the web when we click on the movie
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
      console.log(`clean up ${title}`);
      //will  output the previous title not usePopcorn
      //this happens because of closure
      //when the function in the effect was created it has a title and when the return happens it remembers this title .
    };
  }, [title]);
  return (
    <div className="details">
      {error && <ErrorMessage message={error} />}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              {/* Left arrow */}
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDP Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {/* display the button if the user added rating */}
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You already rated it {watchedUserRating}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Actors: {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
