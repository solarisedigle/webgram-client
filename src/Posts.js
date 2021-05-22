import React, { Fragment, useEffect, useState } from 'react'
import Post from './parts/Post.js'
import Pagination from './parts/Pagination.js'
import './css/Post.css'

const available_limits = [1, 5, 10, 20];
const $ = window.$;

export default function Posts(props) {
    const [posts, setPosts] = useState([]);
    const [limit, setLimit] = useState(1);
    const [page, setPage] = useState(0);
    const [order_type, setOrderType] = useState('created_at');
    const [order_direction, setOrderDirection] = useState('DESC');
    const [general_count, setGeneralCount] = useState(0);
    useEffect(() => {
        $.ajax({
            url: window.vars.host + 'api/v1/posts',
            method: 'GET',
            async: false,
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            data: {
                user: props.user,
                category: props.filter ? props.filter.category : null,
                text: props.filter ? props.filter.text : null,
                tag: props.filter ? props.filter.tag : null,
                users: props.filter ? props.filter.only_subscriptions : null,
                order: order_type + ' ' + order_direction,
                limit: available_limits[limit],
                offset: page*available_limits[limit],
            },
            complete: function(data){
                if (data.status === 200) {
                    let response = JSON.parse(data.responseText);
                    setPosts(response.posts);
                    setGeneralCount(response.general);
                }
            }
        });
    }, [props, limit, page, order_type, order_direction, setPosts, setGeneralCount]);
    function changeLimit(e){
        setLimit(+e.target.getAttribute('data-limit'));
    }
    function changeOrder(e){
        if(order_type === e.target.getAttribute('order-type')){
            setOrderDirection(e.target.getAttribute('order-direction'));
        }
        else{
            setOrderDirection("DESC");
            setOrderType(e.target.getAttribute('order-type'));
        }
    }
    return (
        <Fragment>
            <div className="wg-pagination-block wg-perpage">
                <div className="hidden_pages"><span>{general_count} found</span> • <span>Per page:</span></div>
                {
                    available_limits.map((av_limit, index) => {
                        return <button className={"wg-page-button wg-limit-button " + (index === limit ? 'active' : '')} data-limit={index} key={index} onClick={changeLimit}>{av_limit}</button>
                    })
                }
                <div className="hidden_pages"> • </div>
                <button 
                    className={"wg-page-button wg-limit-button " + (order_type === "created_at" ? 'active' : null)} 
                    onClick={changeOrder} 
                    order-type="created_at"
                    order-direction={(order_type === "count_of_likes" || order_direction === 'ASC') ? 'DESC' : 'ASC'}
                    >
                        <i className="fas fa-history"></i> Recent {
                            order_type === "created_at"
                            ? <i class={"fas fa-sort-amount-" + (order_direction === 'DESC' ? 'down' : 'up')}></i>
                            : null
                        }
                </button>
                <button 
                    className={"wg-page-button wg-limit-button " + (order_type === "count_of_likes" ? 'active' : null)}
                    onClick={changeOrder} 
                    order-type="count_of_likes"
                    order-direction={(order_type === "created_at" || order_direction === 'ASC') ? 'DESC' : 'ASC'}
                    >
                        <i className="fas fa-heart"></i> Popular {
                            order_type === "count_of_likes"
                            ? <i class={"fas fa-sort-amount-" + (order_direction === 'DESC' ? 'down' : 'up')}></i>
                            : null
                        }
                </button>
            </div>
            {posts.map((post) => {
                return (<Post post={post} key={post.post.id}/>)
            })}
            {
                general_count === 0
                ? <h5 className="text-hover">No posts :/</h5>
                : null
            }
            {
                (general_count > (available_limits[limit]))
                ? <Pagination 
                        page={page}
                        available_limits={available_limits}
                        limit={limit}
                        general_count={general_count}
                        setPage={setPage}
                    />
                : null
            }
        </Fragment>
    )
}
