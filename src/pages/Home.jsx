import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { getDayMonthYear } from '../libs/getDayMonthYear';
import {
  fetchPostsByDate,
  fetchPostsByPopularity,
  fetchPostsWithTagByDate,
  fetchTags,
} from '../redux/slices/post';
import { fetchLastComments } from '../redux/slices/comment';

export const Home = () => {
  const [activeTab, setActiveTab] = useState(null);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const lastComments = useSelector((state) => state.comments);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  const { pathname } = useLocation();

  const { tagname } = useParams();

  useEffect(() => {
    switch (pathname) {
      case '/popular-posts':
        dispatch(fetchPostsByPopularity());
        setActiveTab(1);
        break;
      default:
        dispatch(fetchPostsByDate());
        setActiveTab(0);
        break;
    }

    if (tagname) {
      dispatch(fetchPostsWithTagByDate(tagname));
    }

    dispatch(fetchTags());
    dispatch(fetchLastComments());
  }, [dispatch, pathname, tagname]);

  return (
    <>
      <Tabs value={activeTab} style={{ marginBottom: 15 }} aria-label="basic tabs example">
        <Link to="/">
          <Tab label="New" onClick={() => setActiveTab(0)} />
        </Link>
        <Link to="/popular-posts" onClick={() => setActiveTab(1)}>
          <Tab label="Popular" />
        </Link>
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `${process.env.REACT_APP_SERVER_URL}${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={getDayMonthYear(obj.createdAt)}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock items={lastComments.comments.items} isLoading={false} />
        </Grid>
      </Grid>
    </>
  );
};
