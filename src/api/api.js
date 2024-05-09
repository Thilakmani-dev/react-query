async function fetchPosts(page) {
  let response = await fetch(`http://localhost:3000/posts?_sort=-id
  &${page ? `_page=${page}&_per_page=5` : ""}
  `);
  let result = await response.json();
  return result;
}

const fetchTags = async () => {
  let response = await fetch("http://localhost:3000/tags");
  let result = await response.json();
  return result;
};

const addPost = async (data) => {
  let response = await fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let result = await response.json();
  return result;
};

export { fetchPosts, fetchTags, addPost };
