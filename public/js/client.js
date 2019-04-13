

function previewButtonClick(value) {
    window.location = "http://localhost:3000/view_post/"+ value;
}

function deleteButtonYesClick(value) {
    $.ajax({
        url: '/delete_post/'+value,
        type: 'DELETE',
        success: function(result) {
            window.location = "http://localhost:3000/";
        }
    });
}

/* callback for the no button in the delete confirmation of a post */
function deleteButtonNoClick() {
    window.location = "http://localhost:3000/";
}

/* When the user click on the confirm edit button, send a Ajax put request
* */
function editButtonClick(value) {
    let htmlString = $('.ql-editor').html(); // get the content of the post to edit
    var parameters = {_id: value, body: htmlString}; // create the parameters to send through the Ajax request
    $.ajax({
        url: '/edit_post',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(parameters)
    }).done(function() {
        window.location = "http://localhost:3000/";
    });
}

/* Upload a new post using Ajax request */
function uploadPost() {

    let title = $('#input-post-title').val();
    let htmlString = $('.ql-editor').html();

    var parameters = {title: title, body: htmlString};

    $.ajax({
       url: '/addpost',
       type: 'POST',
       contentType: 'application/json',
       data: JSON.stringify(parameters)
    }). done(function () {
        window.location = "http://localhost:3000/";
    });
}

// Quill editor Section //
/*
    parameters options for the quill toolbar
 */
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    [ 'link', 'image', 'video', 'formula' ],          // add's image support

    ['clean'], // remove formatting button
];

/* Initialize quill using the above parameters*/
var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions,
    },

    theme: 'snow'
});

