export interface Comment {
  _id: string;
  post: string;
  text: string;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  post: string;
  text: string;
}

export interface UpdateCommentPayload {
  commentId: string;
  text: string;
}

export interface CommentsState {
  comments: {
    [post: string]: Comment[];
  };
  loading: {
    fetchingComments: boolean;
    creatingComment: boolean;
    deletingComment: boolean;
    updatingComment: boolean;
  };
  error: string | null;
}
