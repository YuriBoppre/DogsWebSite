import React from 'react';
import { COMMENT_POST } from '../../api';
import { ReactComponent as Enviar } from '../../Assets/enviar.svg';
import useFetch from '../../Hooks/useFetch';
import Error from '../Helper/Error';


const PhotoCommentsForm = ({ id, setComments }) => {
    const [comment, setComment] = React.useState(''),
        { request, error } = useFetch();

    async function handleSubmit(event) {
        event.preventDefault();

        const token = window.localStorage.getItem("token"),
            { url, options } = COMMENT_POST(id, { comment }, token),
            { response, json } = await request(url, options);

        if (response.ok) {
            setComment('');
            setComments((comments) => [...comments, json]);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                id="comment"
                name="comment"
                placeholder="Comente..."
                value={comment}
                onChange={({ target }) => setComment(target.value)}
            />
            <button>
                <Enviar />
            </button>
            <Error error={error} />
        </form>
    );
}

export default PhotoCommentsForm