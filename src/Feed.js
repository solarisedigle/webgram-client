import React, { Fragment, useState, useEffect } from 'react'
import Header from './Header.js'
import Posts from './Posts.js'
import AutocompleteTags from './parts/functional/AutocompleteTags.js'
const $ = window.$;

export default function Feed(props) {
    let url = new URLSearchParams(props.location.search);
    let params = {
        tag: url.get('tag'),
        category: +url.get('category'),
        only_subscriptions: url.get('only_subscriptions')
    }
    const [filter, setFilter] = useState(params);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        $.ajax({
            url: window.vars.host + 'api/v1/getCategories',
            method: 'GET',
            complete: function(data){
                if (data.status === 200) setCategories(JSON.parse(data.responseText));
            }
        });
    }, []);
    function applyFilter(){
        let new_filter = {
            tag: $('#post-tag').val().trim(),
            category: +$('#search-post-category').val() !== '' ? $('#search-post-category').val() : null,
            only_subscriptions: $('#search-all').val(),
            text: $('#search-text').val().trim()
        };
        setFilter(new_filter);
    }
    function tagInputHandler(e){
        let current_tagname = $('#post-tag').val();
        let entered_ch = current_tagname.slice(-1);
        if((!(/^[A-Za-z0-9]*$/.test(entered_ch)) && entered_ch !== "-") || (current_tagname.length === 1 && entered_ch === "-")){
            $('#post-tag').val(current_tagname.substring(0, current_tagname.length - 1));
        }
        else{
            $('#post-tag').val(current_tagname.toLowerCase());
        }
        AutocompleteTags([]);
    }
    return (
        <Fragment>
            <Header />
            <div className="container">
                <div className="wg-block row search-block">
                    <div className="col-md-4 pr-2">
                        <h5>Category:</h5>
                        <select className="wg-input" id="search-post-category">
                            <option value="" key="all">All</option>
                            {categories.map((category, index) => {
                                return <option 
                                value={category.id} 
                                selected={+filter.category === +category.id ? true : false} 
                                key={index}>{category.name}</option>
                            })}
                        </select>
                    </div>
                    <div className="col-md-4 pr-2">
                        <h5>Tag:</h5>
                        <input id="post-tag" maxLength="50" autoComplete="off" onBlur={() => $('#post-tag').popover('hide')} onFocus={() => AutocompleteTags([])} onInput={tagInputHandler} type="text" className="wg-input col-md-12" defaultValue={filter.tag ? filter.tag : ''} placeholder="hello-world"/>
                    </div>
                    <button onClick={applyFilter} className="wg-button col-md-4">Search</button>
                    <div className="col-md-7 mt-2 pr-2">
                        <input id="search-text" type="text" className="wg-input" placeholder="Text"/>
                    </div>
                    <select className="wg-input col-md-5" id="search-all">
                        <option value="all">All</option>
                        <option
                            selected={filter.only_subscriptions === "only_subscriptions" ? true : false}
                            value="only_subscriptions">My subscriptions</option>
                    </select>
                </div>
                <Posts filter={filter}/>
            </div>
        </Fragment>
    )
}
