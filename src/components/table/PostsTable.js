import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Input, Typography } from "antd";
import { fetchPosts } from "../store/PostsSlice";
import debounce from "lodash.debounce";

const PostsTable = () => {
  const dispatch = useDispatch();

  // Данные из Redux
  const { items, status, error } = useSelector((state) => state.posts);

  const [filteredData, setFilteredData] = useState([]);

  // Загружаем данные при монтировании
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [dispatch, status]);

  // Обновляем `filteredData` при изменении `items`
  useEffect(() => {
    setFilteredData(items);
  }, [items]);

  // Дебаунс для поиска по ID
  const handleInputChange = useMemo (() => 
    debounce((value) => {
        setFilteredData(
            items.filter((post) =>
                value ? post.id === parseInt(value, 10) : true
            ));
        }, 400),[items]);

  // Обработчик фильтров для таблицы
  const handleTableChange = (_, filters) => {
    const idFilter = filters?.id;

    if (!idFilter) {
      // Если фильтры сброшены, возвращаем оригинальные данные
      setFilteredData(items);
    } else {
      // Фильтрация по диапазону
      const [min, max] = idFilter[0].split("-").map(Number);
      setFilteredData(
        items.filter((post) => post.id >= min && post.id <= max)
      );
    }
  };

  // Колонки таблицы
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      filters: [
        { text: "1-10", value: "1-10" },
        { text: "11-20", value: "11-20" },
        { text: "21-30", value: "21-30" },
      ],
    },
    {
      title: "Оглавление",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Описание",
      dataIndex: "body",
      key: "body",
      render: (text) => <Typography.Text copyable>{text}</Typography.Text>,
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
