function getEmoji(country) {
    country = country.toLowerCase().split(' ').join('-');
    console.log(country, 'Calling API...');
    var emoji = null;

    $.ajax({
        url: 'https://emoji-api.com/emojis/flag-' + country + '?access_key=b8b47ee7b0a204ed775cbbdff0f5c97c83cc12a5',
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data[0]["character"]);
            emoji = data[0]["character"];
        }
    });

    console.log(emoji);
    return emoji;
}