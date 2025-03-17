import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Tabs } from "antd";
import MovieCard from "./components/moviecard/moviecard";
import SearchForm from "./components/searchform/searchform";
import CustomPagination from "./components/custompagination/custompagination";
import { API_URL, API_KEY } from "./components/query.jsx";
import { GenresProvider } from "./components/genrescontext.jsx";
import defaultImage from "/TMDB/src/assets/noimage.png";
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
  const [ratedCurrentPage, setRatedCurrentPage] = useState(1);
  const [ratedTotalPages, setRatedTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [guestSessionId, setGuestSessionId] = useState(null);

  useEffect(() => {
    const fetchGuestSession = async () => {
      try {
        const response = await axios.get(
          `${API_URL}authentication/guest_session/new`,
          {
            params: {
              api_key: API_KEY,
            },
          }
        );
        setGuestSessionId(response.data.guest_session_id);
        localStorage.setItem(
          "tmdb_guest_session_id",
          response.data.guest_session_id
        );
      } catch (error) {
        console.error("Ошибка при создании гостевой сессии:", error);
      }
    };

    const savedGuestSessionId = localStorage.getItem("tmdb_guest_session_id");
    if (savedGuestSessionId) {
      setGuestSessionId(savedGuestSessionId);
    } else {
      fetchGuestSession();
    }
  }, []);

  useEffect(() => {
    if (guestSessionId) {
      fetchRatedMovies(ratedCurrentPage);
    }
  }, [guestSessionId, ratedCurrentPage]);

  const fetchRatedMovies = async (page = 1) => {
    if (!guestSessionId) {
      console.error("Гостевая сессия не создана.");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}guest_session/${guestSessionId}/rated/movies`,
        {
          params: {
            api_key: API_KEY,
            page: page,
          },
        }
      );

      const ratedMovies = response.data.results.map((movie) => ({
        ...movie,
        rating: movie.rating,
      }));

      setRatedMovies(ratedMovies);
      setRatedTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Ошибка при запросе оцененных фильмов:", error);
    }
  };

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

  const handleRatingChange = async (movieId, value) => {
    if (!guestSessionId) {
      console.error("Гостевая сессия не создана.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}movie/${movieId}/rating`,
        {
          value: value,
        },
        {
          params: {
            api_key: API_KEY,
            guest_session_id: guestSessionId,
          },
        }
      );

      if (response.data.success) {
        console.log("Фильм успешно оценен!", value);
        fetchRatedMovies(ratedCurrentPage);
      }
    } catch (error) {
      console.error("Ошибка при оценке фильма:", error);
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
    if (text.length == 0) {
      return "Описание фильма отсутствует, посмотри и напиши сам.";
    }

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
          {isSearchMode && <SearchForm onSearchComplete={onSearchComplete} />}
          <div className="card-container">
            {(isSearchMode ? movies : ratedMovies).map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                rating={movie.vote_average}
                releaseDate={movie.release_date}
                genreIds={movie.genre_ids}
                description={truncateText(movie.overview)}
                imageUrl={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : defaultImage
                }
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
              totalPages={totalPages > 500 ? 500 : totalPages}
              totalResults={totalResults}
              onChange={handlePageChange}
            />
          </Footer>
        )}
        {!isSearchMode && (
          <Footer className="app-footer">
            <CustomPagination
              currentPage={ratedCurrentPage}
              totalPages={ratedTotalPages > 500 ? 500 : ratedTotalPages}
              totalResults={ratedMovies.length}
              onChange={(page) => {
                setRatedCurrentPage(page);
                fetchRatedMovies(page);
              }}
            />
          </Footer>
        )}
      </Layout>
    </GenresProvider>
  );
};

export default App;
