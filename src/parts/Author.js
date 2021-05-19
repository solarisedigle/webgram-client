import React, { Fragment } from 'react'
import ReactTimeAgo from 'react-time-ago'
export default function Author(props) {
    return (
        <Fragment>
            <div className={props.class}>
                <a href={'/' + props.username} className="hover-text">{props.username}</a>
                {props.time_ago? (<span> • <i className="far fa-clock"></i> <ReactTimeAgo date={props.time_ago} locale="en-US"/></span>) : null}
            </div>
        </Fragment>
    )
}
