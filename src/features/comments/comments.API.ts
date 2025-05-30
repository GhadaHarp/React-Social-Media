import axiosInstance from "../../services/axios";
import type {
  CreateCommentPayload,
  UpdateCommentPayload,
} from "./comments.types";

const token = localStorage.getItem("token");

export const getCommentsRequest = async (postId: string) => {
  const res = await axiosInstance.get(`/posts/${postId}/comments`);
  return res.data;
};

export const createCommentRequest = async ({
  post,
  text,
}: CreateCommentPayload) => {
  const res = await axiosInstance.post(
    `/posts/${post}/comments`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const updateCommentRequest = async ({
  commentId,
  text,
}: UpdateCommentPayload) => {
  const res = await axiosInstance.patch(
    `/comments/${commentId}`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteCommentRequest = async (commentId: string) => {
  const res = await axiosInstance.delete(`/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
