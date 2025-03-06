import React, { useState } from "react";
import { Layout, Tabs, Form, Input, Pagination } from "antd";
import SearchForm from "./components/searchform/searchform";
import MovieCard from "./components/moviecard/moviecard";
import "./styles.css";

const { Header, Content, Footer } = Layout;

const styles = {
  layout: { minHeight: "1147px" },
  content: { padding: "24px", flex: 1 },
  form: { marginBottom: "24px" },
};

const App = () => {
  const [setIsSearchMode] = useState(true);

  const handleTabChange = (key) => {
    setIsSearchMode(key === "search");
  };

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const truncateText = (text) => {
    if (text.length <= 210) {
      return text;
    }

    const truncated = text.substring(0, 210);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex === -1) {
      return truncated + "...";
    }

    return truncated.substring(0, lastSpaceIndex) + "...";
  };

  const descText =
    "Lorem ipsum dolor sit amet,m dolor sit amet, consectetur adipiscing elit. Sed quis neque non nunc auctor ultricies.Lorem ipsum dolor sit amet,m dolor sit amet, consectetur adipiscing elit. Sed quis neque non nunc auDonec vel ipsum euismod, lobortis justo consectetur adipiscing elit. Sed quis neque non nunc auctor ultricies. Donec vel ipsum euismod, lobortis justo vel, consectetur turpis. Donec sed eros vel lectus fermentum viverra vel at nunc. Curabitur vel condimentum enim, non commodo neque. Sed non enim auctor, molestie neque vel, malesuada dui. Donec sagittis, velit vel posuere pulvinar, velit ex viv";

  const movies = [
    {
      title: "Название фильма 1 Lorem ipsum dolor sit amet.",
      rating: 5.5,
      releaseDate: "2025-03-04",
      genre: ["Драма", "Комедия"],
      description: truncateText(descText),
      imageUrl: "https://via.placeholder.com/183",
    },
    {
      title: "Название фильма 2",
      rating: 7.8,
      releaseDate: "2025-03-05",
      genre: ["Боевик", "Триллер"],
      description: truncateText(descText),
      imageUrl: "https://via.placeholder.com/183",
    },
  ];

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
          {movies.map((movie, index) => (
            <MovieCard
              key={index}
              title={movie.title}
              rating={movie.rating}
              releaseDate={movie.releaseDate}
              genre={movie.genre}
              description={movie.description}
              imageUrl={movie.imageUrl}
            />
          ))}
        </div>
      </Content>
      <Footer className="app-footer">
        <Pagination defaultCurrent={1} total={50} />
      </Footer>
    </Layout>
  );
};

export default App;
