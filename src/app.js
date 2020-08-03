import { http } from "./http";
import { ui } from "./ui";

document.addEventListener("DOMContentLoaded", getPosts);

// Listen for add post
document.querySelector(".post-submit").addEventListener("click", submitPost);

// Listen for delete
document.querySelector("#posts").addEventListener("click", deletePost);

// Listen for edit state
document.querySelector("#posts").addEventListener("click", enableEdit);

// Listen for cancel
document.querySelector(".card-form").addEventListener("click", cancelEdit);

// get posts
function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then((data) => ui.showPosts(data))
    .catch((err) => console.log(err));
}

// submit posts
function submitPost() {
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const id = document.querySelector("#id").value;

  const data = {
    title,
    body,
  };

  if (title === "" || body === "") {
    ui.showAlert("Please fill in all fields", "alert alert-danger");
  } else {
    // check for ID
    if (id === "") {
      // create post
      http
        .post("http://localhost:3000/posts", data)
        .then((data) => {
          ui.showAlert("Post added", "alert alert-success");
          ui.clearFields();
          getPosts();
        })
        .catch((err) => console.log(err));
    } else {
      // Update post
      http
        .put(`http://localhost:3000/posts/${id}`, data)
        .then((data) => {
          ui.showAlert("Post updated", "alert alert-success");
          ui.changeFormState("add");
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
}

function deletePost(e) {
  e.preventDefault();

  if (e.target.parentElement.classList.contains("delete")) {
    const id = e.target.parentElement.getAttribute("data-id");

    console.log(id);

    if (confirm("Are you sure?")) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then((data) => {
          ui.showAlert("Post removed", "alert alert-success");
          getPosts();
        })
        .catch((err) => console.log(err));
    }
  }
}

// enable edit state
function enableEdit(e) {
  e.preventDefault();

  if (e.target.parentElement.classList.contains("edit")) {
    const id = e.target.parentElement.getAttribute("data-id");
    const title =
      e.target.parentElement.previousElementSibling.previousElementSibling
        .textContent;
    const body = e.target.parentElement.previousElementSibling.textContent;

    const data = {
      id,
      title,
      body,
    };

    // fill form with current post
    ui.fillForm(data);
  }
}

function cancelEdit(e) {
  e.preventDefault();

  if (e.target.classList.contains("post-cancel")) {
    ui.changeFormState("add");
  }
}
