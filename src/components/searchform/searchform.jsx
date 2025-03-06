import React from "react";
import { Form, Input } from "antd";

const SearchForm = ({ onFinish }) => {
  return (
    <Form className="searchform" onFinish={onFinish}>
      <Form.Item name="search">
        <Input placeholder="Enter search term" />
      </Form.Item>
    </Form>
  );
};

export default SearchForm;
