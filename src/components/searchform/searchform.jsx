import React, { useState, useCallback } from "react";
import { Input, Spin } from "antd";
import { debounce } from "lodash";
import { searchMovies } from "../query";

const SearchForm = ({ onSearchComplete }) => {
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    debounce((query) => {
      console.log(query);
      searchMovies(query, 1, (data) => {
        onSearchComplete(
          query,
          data.results,
          data.totalPages,
          data.totalResults
        );
        setLoading(false);
      });
    }, 2500),
    [onSearchComplete]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    // console.log(query);
    setLoading(true);
    debouncedSearch(query);
  };

  return (
    <div>
      <Input
        className="searchform"
        placeholder="Введите название фильма"
        onChange={handleSearchChange}
        allowClear="true"
      />
      {loading && (
        <Spin
          delay="3000"
          fullscreen="true"
          size="large"
          // style={{
          //   marginTop: 0,
          //   marginLeft: 520,
          //   position: "absolute",
          // }}
        />
      )}
    </div>
  );
};

export default SearchForm;
