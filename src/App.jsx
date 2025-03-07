import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Tabs } from "antd";
import MovieCard from "./components/moviecard/moviecard";
import SearchForm from "./components/searchform/searchform";
import CustomPagination from "./components/custompagination/custompagination";
import "./styles.css";

const { Header, Content, Footer } = Layout;

const styles = {
  layout: { minHeight: "1147px" },
  content: { padding: "24px", flex: 1 },
  form: { marginBottom: "24px" },
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [ratedMovies, setRatedMovies] = useState([]);

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

  useEffect(() => {
    axios
      .get(`${API_URL}movie/popular?api_key=${API_KEY}&page=${currentPage}`)
      .then((response) => {
        const allMovies = response.data.results;
        setMovies(allMovies);
        setTotalPages(100);
      })
      .catch((error) => {
        console.error("Ошибка при запросе фильмов:", error);
      });

    axios
      .get(`${API_URL}genre/movie/list?api_key=${API_KEY}`)
      .then((response) => {
        setGenres(response.data.genres);
      })
      .catch((error) => {
        console.error("Ошибка при запросе жанров:", error);
      });
  }, [API_URL, API_KEY, currentPage]);

  const handleRatingChange = (movieId, value) => {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return;

    const ratedMovie = { ...movie, rating: value };

    const isAlreadyRated = ratedMovies.some((m) => m.id === movieId);

    if (isAlreadyRated) {
      setRatedMovies((prev) =>
        prev.map((m) => (m.id === movieId ? ratedMovie : m))
      );
    } else {
      setRatedMovies((prev) => [...prev, ratedMovie]);
    }
  };

  const handleTabChange = (key) => {
    setIsSearchMode(key === "search");
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const getMovieGenres = (genreIds) => {
    if (genres.length > 0 && genreIds) {
      const filteredGenres = genres.filter((genre) =>
        genreIds.includes(genre.id)
      );
      return filteredGenres
        .slice(0, 2)
        .map((genre) => genre.name)
        .join(", ");
    }
    return "";
  };

  const truncateText = (text) => {
    if (text.length <= 190) {
      return text;
    }

    const truncated = text.substring(0, 190);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex === -1) {
      return truncated + "...";
    }

    return truncated.substring(0, lastSpaceIndex) + "...";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Layout style={styles.layout}>
      <Header className="app-header">
        <Tabs
          defaultActiveKey="search"
          onChange={handleTabChange}
          items={[
            {
              key: "search",
              label: "Search",
            },
            {
              key: "rated",
              label: "Rated",
            },
          ]}
        />
      </Header>
      <Content style={styles.content}>
        <SearchForm onFinish={onFinish} />
        <div className="card-container">
          {(isSearchMode ? movies : ratedMovies).map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              rating={movie.vote_average}
              releaseDate={movie.release_date}
              genre={getMovieGenres(movie.genre_ids)}
              description={truncateText(movie.overview)}
              imageUrl={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              onRatingChange={(value) => handleRatingChange(movie.id, value)}
              userRating={ratedMovies.find((m) => m.id === movie.id)?.rating}
            />
          ))}
        </div>
      </Content>
      {isSearchMode && (
        <Footer className="app-footer">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </Footer>
      )}
    </Layout>
  );
};

export default App;
