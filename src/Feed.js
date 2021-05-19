import React, { Fragment } from 'react'
import Header from './Header.js'
import Posts from './Posts.js'
export default function Feed() {
    return (
        <Fragment>
            <Header />
            <div className="container">
                <Posts />
            </div>
        </Fragment>
    )
}
