/**
 * This script handles various interactions and controls for video playback and navigation.
 * It provides functionality for stepping through frames or seconds, enabling scroll-based interaction,
 * and handling key events for playback control and settings toggling.
 */
var videoPlayers = {
    "left": videojs('left-video'),
    "right": videojs('right-video')
};
var fps;
videoPlayers["left"].snapshot();
videoPlayers["right"].snapshot();
var controlledPlayers = ["left"];
enableDisableControls(true);
var currentStep = 1;
var currentSeconds = 1;
var canUseQuickCommands = true;
var bUpdateSeconds = true;


window.onload = function () {
    loadVideos();
}

function loadVideos() {
    // Get url parameters from link
    var urlParams = new URLSearchParams(window.location.search);
    var videoPaths = urlParams.getAll('video');

    if (videoPaths.length >= 2) {
        // Load the first video
        loadVideoFromPath(videoPaths[0], "left");
        // Load the second video
        loadVideoFromPath(videoPaths[1], "right");
    }
}


function loadVideoFromPath(videoPath, playerId) {
    sendPathToServer(videoPath);

    function sendPathToServer(path) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "set_video_path", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        // Send the path as JSON data
        xhr.send(JSON.stringify({ path: path }));
    }

    fetch('/video')
        .then(response => response.blob())
        .then(video => {
            var url = URL.createObjectURL(video);
            videoPlayers[playerId].src({ type: "video/mp4", src: url });
        })
        .catch(error => console.error('An error occurred:', error));

    getFPS();

}

document.getElementById('current-seconds').addEventListener('input', function (e) {
    currentSeconds = parseInt(e.target.value);
});

document.getElementById('current-step').addEventListener('input', function (e) {
    currentStep = parseInt(e.target.value);
});



// Function to forward or backward frames
function forwardFrames(direction) {
    controlledPlayers.forEach(index => {
        videoPlayers[index].pause();
        var currentTime = videoPlayers[index].currentTime();
        var newTime = currentTime + currentStep / fps * direction;
        videoPlayers[index].currentTime(newTime);
    });


}

// Function to update the step size
function updateStep(step) {
    if (currentStep + step != 0) {
        currentStep += step;
        document.getElementById('current-step').value = currentStep;
    }
}

// Function to forward or backward seconds
function forwardSeconds(direction) {

    controlledPlayers.forEach(index => {
        videoPlayers[index].play();
        videoPlayers[index].pause();
        var currentTime = videoPlayers[index].currentTime();
        var newTime = currentTime + currentSeconds * direction;
        videoPlayers[index].currentTime(newTime);
    });

}

// Function to update the seconds size
function updateSeconds(step) {
    if (currentSeconds + step != 0) {
        currentSeconds += step;
        document.getElementById('current-seconds').value = currentSeconds;
    }
}

document.addEventListener('keydown', function (event) {

    // Play/pause video with spacebar
    if (event.key === ' ') {
        event.preventDefault();
        if (canUseQuickCommands) {
            controlledPlayers.forEach(index => {
                player = videoPlayers[index];
                if (player.paused()) {
                    player.play();
                } else {
                    player.pause();
                }
            });

        }
    }

    // Toggle fullscreen with 'F' key
    if (event.key === 'f') {
        if (canUseQuickCommands) {
            controlledPlayers.forEach(index => {
                player = videoPlayers[index];
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
            });

        }

    }

    // Skip number of frames/seconds with arrow keys
    if (event.code === "ArrowLeft") {
        if (canUseQuickCommands) {
            
            event.preventDefault();
            if (bUpdateSeconds) {
                forwardSeconds(-1);
            } else {
                forwardFrames(-1);
            }
        }
    }
    if (event.code === "ArrowRight") {
        if (canUseQuickCommands) {
            event.preventDefault();
            if (bUpdateSeconds) {
                forwardSeconds(1);
            } else {
                forwardFrames(1);
            }
        }
    }

    // Add frames/seconds when up arrow is pressed
    if (event.code === "ArrowUp") {
        event.preventDefault();
        if (bUpdateSeconds) {
            updateSeconds(1);
        } else {
            updateStep(1);
        }
    }
    // Subtract frames/seconds when down arrow is pressed
    if (event.code === "ArrowDown") {
        event.preventDefault();
        if (bUpdateSeconds) {
            updateSeconds(-1);
        } else {
            updateStep(-1);
        }
    }
});

function enableDisableControls(value) {
    var buttons = document.querySelectorAll(".buttons-controls");
    buttons.forEach(function (button) {
        button.disabled = value;
    });
    canUseQuickCommands = !value;
}

function toggleLock() {
    var button = document.getElementById("toggleButton");
    if (button.textContent === "Left") {
        button.textContent = "Right";
        controlledPlayers = ['right'];
    } else if (button.textContent === "Right") {
        button.textContent = "🔒";
        controlledPlayers = ['left', 'right'];
    }
    else {
        button.textContent = "Left";
        controlledPlayers = ['left'];
    }
    console.log(controlledPlayers)

}

function syncVideos(){
    let timeLeft = videoPlayers['left'].currentTime();
    let timeRight = videoPlayers['right'].currentTime();

    if(timeLeft > timeRight)
    {
        videoPlayers['right'].currentTime(timeLeft);
    }
    else
    {
        videoPlayers['left'].currentTime(timeRight);

    }

}
