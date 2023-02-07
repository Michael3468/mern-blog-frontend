import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { Post } from '../components/Post';
import { AddComment } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import axios from '../axios';

import { getDayMonthYear } from '../libs/getDayMonthYear';
import { selectIsAuth } from '../redux/slices/auth';
import { fetchCommentsByPostId } from '../redux/slices/comment';

export const FullPost = () => {
  const userData = useSelector((state) => state.auth.data);
  const postComments = useSelector((state) => state.comments);
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert('An error occurred when getting an article');
      });

    dispatch(fetchCommentsByPostId(id));
  }, [id, dispatch]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `${process.env.REACT_APP_SERVER_URL}${data.imageUrl}` : ''}
        user={data.user}
        createdAt={getDayMonthYear(data.createdAt)}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isEditable={userData?._id === data.user._id}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      {/* TODO add '@username,' to AddComment input when click on username */}
      <CommentsBlock items={postComments.comments.items} isLoading={false}>
        {isAuth && <AddComment id={data._id} />}
      </CommentsBlock>
    </>
  );
};
