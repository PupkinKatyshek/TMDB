import axios from "axios";
import { message } from "antd";
import "@ant-design/v5-patch-for-react-19";

export const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
export const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

export const searchMovies = async (query, page = 1, onSuccess) => {
  try {
    const response = await axios.get(`${API_URL}search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
        include_adult: true,
        page: page,
      },
    });

    if (response.data.results.length === 0 && query.length !== 0) {
      message.info({
        content: "Ничего не найдено.",
        duration: 3,
        style: {
          marginTop: "100px",
          textAlign: "center",
        },
      });
      // console.log("Хуету искал");
    }

    onSuccess({
      results: response.data.results,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    });
  } catch (error) {
    console.error("Ошибка при поиске фильмов:", error);
    message.error("Произошла ошибка при поиске.");
  }
};
