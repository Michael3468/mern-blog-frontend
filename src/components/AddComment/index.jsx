import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import axios from '../../axios';
import { fetchCommentsByPostId } from '../../redux/slices/comment';

import styles from './AddComment.module.scss';

import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export const AddComment = ({ id }) => {
  const userData = useSelector((state) => state.auth.data);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      const fields = {
        postId: id,
        user: userData._id,
        text: comment.trim(),
      };

      await axios.post('/comment-create', fields);

      setComment('');
      dispatch(fetchCommentsByPostId(id));
    } catch (err) {
      console.warn(err);
      alert('An error occurred when creating comment');
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData?.avatarUrl} />
        <div className={styles.form}>
          <TextField
            label="Write comment"
            value={comment}
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
            onChange={(e) => setComment(e.target.value)}
          />
          <Button disabled={!(comment.length > 0)} onClick={handleClick} variant="contained">
            Add comment
          </Button>
        </div>
      </div>
    </>
  );
};
