import React from "react";
import { Pagination } from "antd";

const CustomPagination = ({ currentPage, totalPages, onChange }) => {
  return (
    <Pagination
      current={currentPage}
      total={totalPages}
      onChange={onChange}
      showSizeChanger={false}
      pageSize={1}
    />
  );
};

export default CustomPagination;
