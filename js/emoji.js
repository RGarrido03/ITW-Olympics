function getEmoji(country) {
    var data = $.get('https://emoji-api.com/emojis/flag-' + country + '?access_key=b8b47ee7b0a204ed775cbbdff0f5c97c83cc12a5');
    return data[0].character;
}