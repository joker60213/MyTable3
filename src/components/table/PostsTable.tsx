import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Input, Typography, TableProps } from "antd";
import { fetchPosts } from "../store/PostsSlice";
import debounce from "lodash.debounce";
import { Post } from "../../types/Post";
import { RootState, AppDispatch } from "../store/Store";

const PostsTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { items, status, error } = useSelector((state: RootState) => state.posts);

  const [filteredData, setFilteredData] = useState<Post[]>([]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  useEffect(() => {
    setFilteredData(items);
  }, [items]);

  const handleInputChange = useMemo(
    () =>
      debounce((value: string) => {
        setFilteredData(
          items.filter((post) =>
            value ? post.id === parseInt(value, 10) : true
          )
        );
      }, 400),
    [items]
  );

  const handleTableChange: TableProps<Post>["onChange"] = (_, filters) => {
    const idFilter = filters?.id as string[];

    if (!idFilter) {
      setFilteredData(items);
    } else {
      const [min, max] = idFilter[0].split("-").map(Number);
      setFilteredData(
        items.filter((post) => post.id >= min && post.id <= max)
      );
    }
  };

  const columns: TableProps<Post>["columns"] = [
    { title: "№", dataIndex: "id", key: "id" },
    {
      title: "Оглавление",
      dataIndex: "title",
      key: "title",
      sorter: (a: Post, b: Post) => a.title.localeCompare(b.title),
    },
    {
      title: "Описание",
      dataIndex: "body",
      key: "body",
      render: (text: string) => <Typography.Text copyable>{text}</Typography.Text>,
    },
  ];

  if (status === "loading") {
    return <div>Загрузка...</div>;
  }

  if (status === "failed") {
    return <div>Ошибка: {error}</div>;
  }

  return (
    <div>
      <Input
        placeholder="Поиск по №"
        style={{ width: 200, marginBottom: "15px" }}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        onChange={handleTableChange}
      />
    </div>
  );
};

export default PostsTable;
