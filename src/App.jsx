import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Tabs } from "antd";
import MovieCard from "./components/moviecard/moviecard";
import SearchForm from "./components/searchform/searchform";
import CustomPagination from "./components/custompagination/custompagination";
import { API_URL, API_KEY } from "./components/query.jsx";
import { GenresProvider } from "./components/GenresContext.jsx";
import "./styles.css";
import "@ant-design/v5-patch-for-react-19";

const { Header, Content, Footer } = Layout;

const styles = {
  layout: { minHeight: "1147px" },
  content: { padding: "0px 24px 24px 24px", flex: 1 },
  form: { marginBottom: "24px" },
};

const App = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMovies = async (page = 1) => {
    try {
      const response = await axios.get(`${API_URL}movie/popular`, {
        params: {
          api_key: API_KEY,
          page: page,
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setTotalResults(response.data.total_results);
    } catch (error) {
      console.error("Ошибка при запросе фильмов:", error);
    }
  };

  const searchMoviesWithPagination = async (query, page = 1) => {
    try {
      const response = await axios.get(`${API_URL}search/movie`, {
        params: {
          api_key: API_KEY,
          query: query,
          include_adult: true,
          page: page,
        },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setTotalResults(response.data.total_results);
    } catch (error) {
      console.error("Ошибка при поиске фильмов:", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      searchMoviesWithPagination(searchQuery, currentPage);
    } else {
      fetchMovies(currentPage);
    }
  }, [currentPage, searchQuery]);

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

  const onSearchComplete = (query, results, totalPages, totalResults) => {
    setSearchQuery(query);
    setMovies(results);
    setTotalPages(totalPages);
    setTotalResults(totalResults);
    setCurrentPage(1);
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
    <GenresProvider>
      <Layout style={styles.layout}>
        <Header className="app-header">
          <Tabs
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
          <SearchForm onSearchComplete={onSearchComplete} />
          <div className="card-container">
            {(isSearchMode ? movies : ratedMovies).map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                rating={movie.vote_average}
                releaseDate={movie.release_date}
                genreIds={movie.genre_ids}
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
              totalResults={totalResults}
              onChange={handlePageChange}
            />
          </Footer>
        )}
      </Layout>
    </GenresProvider>
  );
};

export default App;
