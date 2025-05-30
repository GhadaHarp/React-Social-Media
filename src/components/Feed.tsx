import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "./PostCard";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import {
  fetchPaginatedPosts,
  fetchUserBookmarks,
  fetchUserLikes,
  fetchUserPosts,
  fetchUserShares,
  resetPosts,
} from "../features/posts/posts.slice";
import PostCardSkeleton from "./PostCardSkeleton";
import { HourglassEmpty } from "@mui/icons-material";
import ServerError from "../pages/ServerError";

export const Feed: React.FC = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const dispatch = useAppDispatch();
  const {
    posts = [],
    feedView,
    loading,
    error,
    hasMore,
    page,
  } = useAppSelector((state) => state.posts);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading.fetchingPosts || !hasMore || feedView !== "home") return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsIntersecting(true);
          }
        },
        { rootMargin: "300px" }
      );

      if (node) observer.current.observe(node);
    },
    [loading.fetchingPosts, hasMore, feedView]
  );

  useEffect(() => {
    if (isIntersecting) {
      dispatch(fetchPaginatedPosts(page));
      setIsIntersecting(false);
    }
  }, [isIntersecting, dispatch, page]);

  useEffect(() => {
    dispatch(resetPosts());

    switch (feedView) {
      case "home":
        dispatch(fetchPaginatedPosts(1));
        break;
      case "posts":
        dispatch(fetchUserPosts());
        break;
      case "likes":
        dispatch(fetchUserLikes());
        break;
      case "shares":
        dispatch(fetchUserShares());
        break;
      case "bookmarks":
        dispatch(fetchUserBookmarks());
        break;
      default:
        dispatch(fetchPaginatedPosts(1));
    }
  }, [dispatch, feedView]);

  const getFeedTitle = () => {
    switch (feedView) {
      case "posts":
        return "My Posts";
      case "likes":
        return "Liked Posts";
      case "shares":
        return "Shared Posts";
      case "bookmarks":
        return "Bookmarked Posts";
      default:
        return "All Posts";
    }
  };

  return (
    <Box p={2}>
      {!error && (
        <Typography
          variant="h5"
          fontWeight={600}
          color="primary.dark"
          sx={{
            textTransform: "uppercase",
            letterSpacing: 1,
            textAlign: "center",
            mb: 3,
          }}
        >
          {getFeedTitle()}
        </Typography>
      )}

      {loading.fetchingPosts && posts.length === 0 ? (
        Array.from({ length: 3 }).map((_, index) => (
          <PostCardSkeleton key={index} />
        ))
      ) : error ? (
        <ServerError />
      ) : posts.length === 0 ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={1}
          sx={{ minHeight: "200px", opacity: 0.7 }}
        >
          <HourglassEmpty fontSize="large" color="disabled" />
          <Typography variant="body1" color="text.secondary">
            No posts to show.
          </Typography>
        </Stack>
      ) : (
        posts.map((post, index) =>
          index === posts.length - 1 && feedView === "home" ? (
            <div ref={lastPostRef} key={post._id}>
              <PostCard post={post} />
            </div>
          ) : (
            <PostCard key={post._id} post={post} />
          )
        )
      )}

      {loading.fetchingPosts && posts.length > 0 && (
        <Stack alignItems="center" justifyContent="center" mt={3}>
          <CircularProgress size={28} />
        </Stack>
      )}

      {!hasMore && posts.length > 0 && (
        <Typography
          align="center"
          mt={4}
          fontWeight={500}
          color="text.secondary"
        >
          You’ve reached the end 🎉
        </Typography>
      )}
    </Box>
  );
};
