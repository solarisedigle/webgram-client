import React, {useEffect} from 'react'

export default function Pagination(props) {
    let last_page = props.general_count/props.available_limits[props.limit];
    last_page = (last_page%1 === 0) ? last_page - 1 : Math.floor(last_page);
    const $ = window.$;
    useEffect(() => {
        if(props.page > last_page){
            props.setPage(last_page);
        }
    }, [props, last_page]);
    function setCurrentPage(page){
        $("html, body").animate({ scrollTop: 0 }, "slow");
        props.setPage(page);
    }
    function goToPage(e){
       setCurrentPage(+e.target.getAttribute('data-page'));
    }
    function nextPage(e){
       setCurrentPage(props.page + 1);
    }
    function prevPage(e){
       setCurrentPage(props.page - 1);
    }
    function generatePagination(){
        let page_buttons = [];
        if(props.page > 0) {
            page_buttons.push(<button className="wg-page-button" key={'prev'} onClick={prevPage}><i className="fas fa-chevron-left"></i></button>);
        }
        for (let page = 0; page <= last_page; page++) {
            if(Math.abs(page - props.page) > 2 && page !== 0 && page !== last_page){
                if(page_buttons[page_buttons.length - 1] && page_buttons[page_buttons.length - 1].type === "button") page_buttons.push(<div className="hidden_pages" key={page}>...</div>);
                else page_buttons.push(null);
            } 
            else page_buttons.push(<button className={"wg-page-button " + (page === props.page ? 'active' : '')} key={page} data-page={page} onClick={goToPage}>{page + 1}</button>);
        }
        if(props.page < last_page) {
            page_buttons.push(<button className="wg-page-button" key={'next'} onClick={nextPage}><i className="fas fa-chevron-right"></i></button>);
        }
        return page_buttons;
    }
    return (
        <div className="wg-pagination-block">
            {generatePagination()}
        </div>
    )
}
