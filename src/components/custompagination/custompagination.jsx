import React from "react";
import { Pagination } from "antd";

const CustomPagination = ({ currentPage, onChange, totalResults }) => {
  // console.log(totalResults);
  return (
    <Pagination
      current={currentPage}
      total={totalResults > 10000 ? 10000 : totalResults}
      onChange={onChange}
      showSizeChanger={false}
      pageSize={20}
    />
  );
};

export default CustomPagination;
