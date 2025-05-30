import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
} from "@mui/material";

const PostCardSkeleton = () => {
  return (
    <Card sx={{ margin: 5 }}>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton width="60%" />}
        subheader={<Skeleton width="40%" />}
      />
      <Skeleton variant="rectangular" height={400} />
      <CardContent>
        <Skeleton width="80%" />
        <Skeleton width="95%" />
      </CardContent>
      <CardActions>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </CardActions>
    </Card>
  );
};

export default PostCardSkeleton;
