import { useEffect, useState } from "react";

const KEY = "a994eadb";
// Named export
export function useMovies(query, callBack) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  async function fetchMovies(controller) {
    try {
      setIsLoading(true);
      //AlWAYS reset error befaure fetching
      setError("");
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Something went wrong with fetching data!");
      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not Found!");
      setMovies(data.Search);
      setError("");
    } catch (err) {
      //to ignore Abort error as fetch sees canceled as error
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
    if (!query.length) {
      setMovies([]);
      setError("");
      return;
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    callBack?.();
    fetchMovies(controller);
    return () => {
      controller.abort();
    };
  }, [query]);
  return { movies, isLoading, error };
}
