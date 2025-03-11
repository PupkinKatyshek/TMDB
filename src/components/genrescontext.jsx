import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

export const GenresContext = createContext();

export const GenresProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}genre/movie/list?api_key=${API_KEY}`)
      .then((response) => {
        setGenres(response.data.genres);
      })
      .catch((error) => {
        console.error("Ошибка при запросе жанров:", error);
      });
  }, []);

  const getMovieGenres = (genreIds) => {
    if (genres.length > 0 && genreIds && genreIds.length > 0) {
      const filteredGenres = genres.filter((genre) =>
        genreIds.includes(genre.id)
      );
      return filteredGenres.slice(0, 2).map((genre) => genre.name);
    }
    return ["No genre found"];
  };

  return (
    <GenresContext.Provider value={{ genres, getMovieGenres }}>
      {children}
    </GenresContext.Provider>
  );
};
