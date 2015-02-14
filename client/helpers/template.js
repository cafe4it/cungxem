displayMessage = _.template("<b><%=username%></b> : <%=message%>");
titlePage = _.template("<%=title%> - [Cùng xem]");
playerId = _.template("videoPlayer_<%=id%>");
youtubeWatch = _.template("https://www.youtube.com/watch?v=<%=id%>");

jquerySelectorId = _.template('#<%=id%>');

Template.registerHelper('youtubeDuration', function (duration) {
    return moment.utc(duration * 1000).format("HH:mm:ss")
})