export default function AutocompleteTags(except){
    const $ = window.$;
    $.ajax({
        url: window.vars.host + 'api/v1/tagsAutocomplete/' + $('#post-tag').val(),
        method: 'GET',
        data: {except: except},
        complete: function(data){
            if (data.status === 200) {
                let tags = JSON.parse(data.responseText).tags;
                let content = '';
                for (let i = 0; i < tags.length; i++) {
                    content += '<div class="wg-pop-item tag-autocomplete-item"><span class="data">' + tags[i].name + '</span> (' + tags[i].uses + ')</div>'
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
