import { useMutation, useQuery } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api/api";
import { useState } from "react";

export const PostList = () => {
  const [page, setPage] = useState(1);

  const {
    data: postsData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: tagsData,
    isLoading: isTagsLoading,
    error: tagsError,
    isError: isTagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  });

  const { mutate: updatePost } = useMutation({
    mutationFn: addPost,
  });

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );
    console.log(tags, title);
    updatePost({ title, tags, id: postsData.length + 1 });
  }

  return (
    <div className="container">
      <h3 className="title">My posts</h3>
      <form className="addPostForm" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Enter post title"
          className="inputTitle"
        />
        <div className="inputTags">
          {isTagsLoading && <p>Tags loading...</p>}
          {tagsData &&
            tagsData.length &&
            tagsData.map((tag) => {
              return (
                <div key={tag} className="inputTag">
                  <input type="checkbox" name={tag} id={tag} />
                  <label htmlFor={tag}>{tag}</label>
                </div>
              );
            })}
          {isTagsError && <p>{tagsError?.message}</p>}
        </div>
        <button className="addPostButton">Add post</button>
      </form>
      <div className="pagination">
        <button onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 1))}>
          prev
        </button>
        <span>Page: {page}</span>
        <button onClick={() => setPage((oldPage) => oldPage + 1)}>Next</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {postsData &&
        postsData.length > 0 &&
        postsData.map((post) => {
          return (
            <div key={post.id} className="post">
              {post.title}
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}&nbsp;
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      {isError && <div>{error?.message}</div>}
    </div>
  );
};
