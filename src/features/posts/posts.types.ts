export type FeedView =
  | "home"
  | "posts"
  | "likes"
  | "shares"
  | "bookmarks"
  | "profile";
export interface Post {
  _id?: string;
  title: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    avatar: string;
  };
  likes?: string[];
  sharedFrom?: string;
  likeCount: number;
  shareCount: number;
  sharedBy?: string;
  bookmarks: string[];
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface PostsState {
  posts: Post[];
  loading: {
    fetchingPosts: boolean;
    likingPost: boolean;
    sharingPost: boolean;
    bookmarkingPost: boolean;
  };
  error: string | null;
  feedView: FeedView;
  page: number;
  hasMore: boolean;
}
export interface CreatePostPayload {
  title?: string;
  content: string;
  image?: File;
  author: string;
}
export interface EditPost {
  id: string;
  title: string;
  content: string;
  image?: string;
}
