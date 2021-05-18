import React, { Fragment, useState, useEffect } from 'react'
import './css/PostForm.css'
export default function PostForm() {
    const $ = window.$;
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const $ = window.$;
        $.ajax({
            url: window.vars.host + 'api/v1/getCategories',
            method: 'GET',
            complete: function(data){
                if (data.status === 200) setCategories(JSON.parse(data.responseText));
            }
        });
    }, []);
    function autocompleteTags(){
        $.ajax({
            url: window.vars.host + 'api/v1/tagsAutocomplete/' + $('#post-tag').val(),
            method: 'GET',
            data: {except: tags},
            complete: function(data){
                if (data.status === 200) {
                    let tags = JSON.parse(data.responseText).tags;
                    let content = '';
                    for (let i = 0; i < tags.length; i++) {
                        content += '<div class="wg-pop-item tag-autocomplete-item">' + tags[i].name + '</div>'
                    }
                    $('#post-tag').popover('dispose');
                    if(content === '') return;
                    $('#post-tag').popover({
                        html: true,
                        title: 'Recommended tags',
                        placement: 'auto',
                        content: content
                    });
                    $('#post-tag').popover('show');
                }
            }
        });
    }
    function add_tag(tagname){
        if(tags.indexOf(tagname) === -1){
            tags.push(tagname);
            setTags(tags.slice());
        }
        $('#post-tag').val('');
    }
    function tagInputHandler(e){
        let current_tagname = $('#post-tag').val();
        let entered_ch = current_tagname.slice(-1);
        if(entered_ch === " "){
            if(tags.length < 5){
                add_tag(current_tagname.trim());
            }
            else{
                $('#max-tags-error').show();
            }
        }
        else if((!(/^[A-Za-z0-9]*$/.test(entered_ch)) && entered_ch !== "-") || (current_tagname.length === 1 && entered_ch === "-")){
            $('#post-tag').val(current_tagname.substring(0, current_tagname.length - 1));
        }
        else{
            $('#post-tag').val(current_tagname.toLowerCase());
        }
        autocompleteTags();
    }
    function handleKeypress(e){
        if (e.charCode === 13) {
            add_tag($('#post-tag').val().trim());
        }
    }
    function imageUpload(){
        let image = $.trim($("#post-file").val());
        if (image && image !== '') {      
            $('#add-file').html('<i class="fa fa-check-circle"></i>');
            $('#add-file').addClass('bg-success');
        }
    }
    function removeTag(e){
        $('#max-tags-error').hide();
        tags.splice($(e.target).attr('data-key'), 1);
        setTags(tags.slice());
    }
    function handlePublish(){
        let formData = new FormData();
        formData.append("title", $('#post-title').val());
        formData.append("body", $('#post-body').val());
        formData.append("tags", tags);
        formData.append("category", +$('#post-category').val());
        let image = $.trim($("#post-file").val());
        if (image && image !== '') formData.append("image", $("#post-file").get(0).files[0]); 
        $.ajax({
            url: window.vars.host + 'api/v1/post',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            headers: {
                "Authorization": localStorage.getItem('jwt')
            },
            beforeSend: function(){
                $('#post-publish .spinner-border').css('display', 'inline-block');
                $('button, input').prop('disabled', true);
            },
            complete: function(data){
                if (data.status === 200) window.location.reload();
                else if (data.status === 401 || data.status === 403) window.location.href="/login";
                else if(data.status === 422){
                    let errors = JSON.parse(data.responseText).errors;
                    let errors_text = '';
                    for (let error in errors) {
                        errors_text += '<br>' + error + ': ' + errors[error];
                    }
                    $('#publish-errors').html(errors_text).show();
                }
                else $('#publish-errors').html('Server error. Please try again later.').show();
                $('.spinner-border').hide();
                $('button, input').prop('disabled', false);
            }
        });
    }
    return (
        <Fragment>
            <button className="wg-button" data-toggle="collapse" data-target="#post-form"><i className="far fa-plus-square"></i> New post</button>
            <div className="wg-block row collapse" id="post-form">
                <div className="col-md-2">
                    <button onClick={() => window.$('#post-file').click()} className="wg-button" id="add-file"><i className="fa fa-images"></i></button>
                </div>
                <div className="col-md-10">
                    <input type="text" maxLength="200" placeholder="Title" className="wg-input" id="post-title"/>
                </div>
                <input onChange={imageUpload} type="file" style={{"display": "none"}} id="post-file" accept="image/png, image/jpeg"/>
                <div className="col-md-7">
                    <textarea type="text" maxLength="2000" placeholder="Text" className="wg-input" id="post-body" rows="5"/>
                    <p className="wg-errors-p" id="publish-errors"></p>
                </div>
                <div className="col-md-5">
                    <input type="text" onBlur={() => $('#post-tag').popover('hide')} onFocus={autocompleteTags} onInput={tagInputHandler} onKeyPress={handleKeypress} placeholder="Tag (eco, hi-world)" className="wg-input" id="post-tag"/>
                    <p className="wg-errors-p" id="max-tags-error">Maximum 5 tags allowed.</p>
                    <div id="tags_selected">
                        {tags.map((tag, index) => {
                            return <span className="tag-item" onClick={removeTag} data-key={index} key={index}><i className="far fa-times"></i> {tag}</span>
                        })}
                    </div>
                    <select className="wg-input" id="post-category">
                        {categories.map((category, index) => {
                            return <option value={category.id} key={index}>{category.name}</option>
                        })}
                    </select>
                    <button onClick={handlePublish} className="wg-button mt-2" id="post-publish"><span className="spinner-border spinner-border-sm"></span> Publish</button>
                </div>
            </div>
         </Fragment>
    )
}
