import React, { useEffect, useState } from 'react'
import './css/Like.css'

export default function Like(props) {
    const [like, setLike] = useState(false);
    const $ = window.$;
    useEffect(() => {
        $.ajax({
            url: window.vars.host + 'api/v1/post/' + props.post.post.id + '/like',
            method: 'GET',
            async: false,
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            complete: function(data){
                if (data.status === 200) setLike(JSON.parse(data.responseText));
            }
        });
    }, [props, setLike, $]);
    function likePost(){
        $.ajax({
            url: window.vars.host + 'api/v1/post/' + props.post.post.id + '/like',
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            complete: function(data){
                if (data.status === 401 || data.status === 403) window.location.href="/login";
                else setLike(JSON.parse(data.responseText));            }
        });
    }
    function dislikePost(){
        $.ajax({
            url: window.vars.host + 'api/v1/post/' + props.post.post.id + '/like',
            method: 'DELETE',
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            complete: function(data){
                if (data.status === 401 || data.status === 403) window.location.href="/login";
                else setLike(JSON.parse(data.responseText));            }
        });
    }
    return (
        <div className="like-block">
            {
                like.isset
                ? (<i onClick={dislikePost} className="fas fa-heart like liked transition"></i>)
                : (<i onClick={likePost} className="far fa-heart like unliked transition"></i>)
            }
            <span>{like.summ ? like.summ : 0}</span>
        </div>
    )
}
