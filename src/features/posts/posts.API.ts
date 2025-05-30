import axiosInstance from "../../services/axios";
import type { CreatePostPayload } from "./posts.types";
const token = localStorage.getItem("token");
export const getPostsRequest = async (page: number = 1) => {
  const query = `/posts?page=${page}&limit=10`;
  const res = await axiosInstance.get(query);
  return res.data;
};

export const getPostByIdRequest = async (id: string) => {
  const res = await axiosInstance.get(`/posts/${id}`);
  return res.data;
};

export const createPostRequest = async (data: CreatePostPayload) => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  formData.append("content", data.content);
  if (data.image) formData.append("image", data.image);

  try {
    const response = await axiosInstance.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
};

export const updatePostRequest = async (id: string, data: FormData) => {
  console.log(22222222, data);
  try {
    const res = await axiosInstance.patch(`/posts/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to update post:", error);
    throw error;
  }
};

export const deletePostRequest = async (id: string) => {
  const res = await axiosInstance.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLikePostRequest = async (id: string) => {
  const res = await axiosInstance.patch(
    `/posts/like/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
export const toggleBookmarkPostRequest = async (id: string) => {
  const res = await axiosInstance.patch(
    `/posts/bookmark/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const sharePostRequest = async (id: string) => {
  const res = await axiosInstance.post(
    `/posts/share/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
export const fetchUserPostsRequest = async () => {
  const res = await axiosInstance.get(
    `/posts/mine`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const fetchUserLikesRequest = async () => {
  const res = await axiosInstance.get(
    `/posts/likes`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const fetchUserBookmarksRequest = async () => {
  const res = await axiosInstance.get(
    `/posts/bookmarks`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const fetchUsersharesRequest = async () => {
  const res = await axiosInstance.get(
    `/posts/shares`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
