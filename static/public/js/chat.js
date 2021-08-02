const socket = io();

// get the userID and roomID
let userID = $(".userID").text();

const URL = document.location.href.split("/");
const roomID = URL[4];

const feedback = $("#feedback");
// Join chat room

socket.emit("joinRoom", { userID, roomID });

socket.on("roomInfo", ({ roomInfo, userInfo }) => {
  $(".roomName").text(roomInfo[0].room_name);
  document.title = roomInfo[0].room_name;
  $(".messages ul li").remove();
  // display the previous chat
  if (roomInfo[0].content) {
    roomInfo.forEach((e) => {
      displayMessage(e);
    });
  }
});

socket.on("message", (msg) => {
  displayMessage(msg);
});

// emit typing
$(".message-input").bind("keypress", () => {
  socket.emit("typing");
});

// get the typing
socket.on("typing", (user) => {
  console.log(user);

  feedback.html("<p><i>" + user.username + " is typing... " + "</i></p>");
  setTimeout(function () {
    feedback.html("");
  }, 2500);
});

/**
 *
 * Animation for the chat room
 */
$(".messages").animate({ scrollTop: $(document).height() }, "fast");
$(".content").animate({ scrollTop: $(document).height() }, "fast");
$("#profile-img").click(function () {
  $("#status-options").toggleClass("active");
});
$(".userID").hide();

$(".expand-button").click(function () {
  $("#profile").toggleClass("expanded");
  $("#contacts").toggleClass("expanded");
});

$("#status-options ul li").click(function () {
  $("#profile-img").removeClass();
  $("#status-online").removeClass("active");
  $("#status-away").removeClass("active");
  $("#status-busy").removeClass("active");
  $("#status-offline").removeClass("active");
  $(this).addClass("active");

  if ($("#status-online").hasClass("active")) {
    $("#profile-img").addClass("online");
  } else if ($("#status-away").hasClass("active")) {
    $("#profile-img").addClass("away");
  } else if ($("#status-busy").hasClass("active")) {
    $("#profile-img").addClass("busy");
  } else if ($("#status-offline").hasClass("active")) {
    $("#profile-img").addClass("offline");
  } else {
    $("#profile-img").removeClass();
  }

  $("#status-options").removeClass("active");
});

function newMessage() {
  message = $(".message-input input").val();
  if ($.trim(message) == "") {
    return false;
  }
  socket.emit("chatMessage", message);
}

function displayMessage(msg) {
  let prop;
  let preview;
  let fullname = msg.first_name + " " + msg.last_name;
  if (userID == msg.user_id) {
    prop = "sent";
    preview = "You";
  } else {
    prop = "replies";
    preview = fullname;
  }

  let time = new Date(Date.parse(msg.created_at)).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  $(
    `<li class=${prop}> 
    <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
    <p>` +
      fullname +
      "</br>" +
      msg.content +
      `<span class="created_date">${time}</span>` +
      "</p>  " +
      +"</li>"
  ).appendTo($(".messages ul"));

  // clear after sending

  $(".message-input input").val(null);

  $(".contact.active .preview").html(
    `<span> ${preview}: </span>` + msg.content
  );
  $(".messages").animate({ scrollTop: $(document).height() }, "fast");
}

$(".submit").click(function () {
  newMessage();
});

$(window).on("keydown", function (e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});
