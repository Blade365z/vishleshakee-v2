var SeachedToken = '', BREAK_FLAG = 0, verifiedSearchedUser, page_state;
export const formulateUserSearch = (token, div) => {
    SeachedToken = token;
    localStorage.setItem('smat.searchUser', 1);
    BREAK_FLAG = 0;
    verifiedSearchedUser = 'True';
    $('#' + div + '-modal').modal('show');
    $('#' + div + '-token').text(token);
    $('#' + div).html('');
    $('#LoadMore_UserSearch_' + div).remove();
    $('#' + div).after('<div><button class="btn btn-block bg-vish my-2 LoadMore_UserSearch" id="LoadMore_UserSearch_' + div + '" style="display:none" >Load More</button></div>');
    searchUser(div);
}

$('body').on('click', 'div .LoadMore_UserSearch', function () {
    searchUser(div);
})
//Narendra modi
const searchUser = (div) => {
    $('#' + div).append('<div class="text-center" ><img class="divLoader" src="public/icons/loader.gif" ></div>');
    var clearFlag = localStorage.getItem('smat.searchUser');
    if (BREAK_FLAG == 0) {
        $.ajax({
            url: "UA/userlist",
            method: "get",
            data: {
                token: SeachedToken,
                verified: verifiedSearchedUser,
                clearFlag
            },
            dataType: 'JSON',
            success: function (data) {
                print_users_list(data, div);
                $('.divLoader').parent().css('display', 'none');
                $('#LoadMore_UserSearch_' + div).css('display', 'block');
                localStorage.setItem('smat.searchUser', 0);
                clearFlag = localStorage.getItem('smat.searchUser');

                if (verifiedSearchedUser == 'True') {
                    if (Object.keys(data).length <= 20) {
                        verifiedSearchedUser = 'False';
                        setTimeout(() => {
                            searchUser(div);
                        }, 1000);
                    }
                } else {
                    checkPagingStateTokenUserSearch(div);
                }

            }
        });

    }
}
const checkPagingStateTokenUserSearch = (div) => {
    $.ajax({
        url: "UA/getpagingstate",
        type: 'GET',
        async: false,
        success: function (e) {
            page_state = e;
            if (page_state.trim() === '') {
                BREAK_FLAG = 1;
                $('#LoadMore_UserSearch_' + div).css('display', 'none');
                $('#user_containerList').append('<div> <p class="my-2">No more users found.</p></div> ')
                console.log('<<< END OF LIST >>>');
                return 0;
            }

        }
    });

}
const print_users_list = (data, div) => {
    try {
        console.log('PRINTING USERS...')
        console.log(data);
        console.log(div);
        data.forEach(element => {
            let verified = element.verified == 'True' ? '<span><img class="verifiedIcon" src="public/icons/smat-verified.png"/></span>' : '';
            $('#' + div).append('<div class="row m-2"><span><img class="profilePicSmall" src="' + element['profile_image_url_https'] + '"  /> </span><span class="ml-1"><a class="author_searched pt-1 m-0 font-weight-bold"  title="' + element['author'] + '" title1="' + element['author_id'] + '" title2="' + element['author_screen_name'] + '" title3="' + element['profile_image_url_https'] + '"   >' + element['author'] + '</a> '+verified+'<p class="smat-dash-title pull-text-top m-0 ">@' + element['author_screen_name'] + '</p></span></div>')

        });
    } catch {
        console.log('err')
    }
}

