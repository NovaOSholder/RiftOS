<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Media Viewer</title>
	<meta name="capabilities" content=".mp4,.mp3,.mpeg,.webm,.jpeg,.png,.jpg,.webp">
	<meta name="nova-icon"
		content="<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='98.86818' height='98.86818' viewBox='0,0,98.86818,98.86818'><g transform='translate(-190.56591,-130.56591)'><g data-paper-data='{&quot;isPaintingLayer&quot;:true}' fill-rule='nonzero' stroke-linecap='butt' stroke-linejoin='miter' stroke-miterlimit='10' stroke-dasharray='' stroke-dashoffset='0' style='mix-blend-mode: normal'><path d='M193.06591,180c0,-25.92098 21.01311,-46.93409 46.93409,-46.93409c25.92098,0 46.93409,21.01311 46.93409,46.93409c0,25.92098 -21.01311,46.93409 -46.93409,46.93409c-25.92098,0 -46.93409,-21.01311 -46.93409,-46.93409z' fill='#e7f4ff' stroke='#4f92c8' stroke-width='5'/><path d='M229.36872,160.64825c4.15023,1.93988 18.10692,8.46344 25.52527,11.93089c2.84482,1.32971 3.40205,3.30243 1.33456,5.00567c-6.30331,5.19279 -19.49818,16.06297 -23.01686,18.96173c-1.68819,1.39076 -3.72218,0.66723 -4.1395,-2.62914c-1.1217,-8.86034 -3.27126,-25.83983 -3.87019,-30.57075c-0.30418,-2.40273 1.88158,-3.76651 4.16672,-2.6984z' fill='#496787' stroke='none' stroke-width='0'/></g></g></svg>">
	<style>
		body {
			justify-content: center;
			align-items: center;
			margin: 0;
			font-size: 12px;
			color: white;
			font-family: Arial, Helvetica, sans-serif;
			box-sizing: border-box;
			background: linear-gradient(to top, #000000 0%, #1b1b1b 100%);
			background-repeat: no-repeat;
			background-size: cover;
			height: 100vh;
		}

		img {
			border-radius: 10px;
			font-size: 14px;
			display: block;
			padding: 10px;
			width: calc(100% - 41px);
			margin: auto;
			object-fit: contain;
			background: #1f1f1f;
			outline: none;
			height: calc(100vh - 62px);
			resize: none;
			background-image: radial-gradient(#181818 50%, transparent 50%);
			background-size: 10px 10px;
			border: none;
		}


		video {
			width: 100%;
			height: calc(100% - 32px);
			object-fit: contain;
			background-image: radial-gradient(#181818 50%, transparent 50%);
			background-size: 10px 10px;
		}

		audio {
			margin: auto;
			display: block;
			margin-top: 20vh;
		}

		nav {
			padding: 5px 10px;
		}

		nav button {
			background: #161616;
			border: 1px solid #282f39;
			border-radius: 5px;
			color: #858585;
			font-size: 10px;
			padding: 2px 10px;
		}

		#nomedia {
			background-color: #161616;
			width: 100%;
			height: 100%;
		}

		#mediaopenbtn {
			font-size: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 2rem;
    border: none;
    background: #393939;
    color: white;
    outline: none;
    cursor: pointer;
    display: block;
    margin: auto;
    margin-top: calc(50% - 150px);
		}
	</style>
</head>

<body>
	<dialog id="nomedia">
		<button id="mediaopenbtn" onclick="openfromfiles()">Open File</button>
	</dialog>

	<nav>
		<button><span id="tils"></span></button>
	</nav>
	<div id="displays">
		<img id="thedisplay" alt="Nova" src="">
	</div>

	<script>

		var disp;
		async function greenflag() {
			try {
				if (myWindow.params.appid == myWindow.appID) {
					openfile(myWindow.params.data)
				}
			} catch (error) {
				document.getElementById("nomedia").showModal()
			}
		}
		async function openfile(fileID) {
			document.getElementById("nomedia").close()
			disp = document.getElementById("displays");
			var file = await window.parent.getFileById(fileID);
			console.log(file, fileID);
			if (file && file.content) {

				document.getElementById("tils").innerText = file.fileName;
				console.log(file)
				const type = file.type || 'application/octet-stream';
				const base64Content = file.content;

				if (window.parent.getbaseflty(file.fileName) == "image") {
					disp.innerHTML = `<img id="thedisplay" alt="Nova" src="">`;
					document.getElementById("thedisplay").src = `${base64Content}`;
				} else if (window.parent.getbaseflty(file.fileName) == "music") {
					disp.innerHTML = `<audio controls>
					<source src="" type="audio/mp3" id="thedisplay">
					Your browser does not support the audio tag.
				</audio>`;
					document.getElementById("thedisplay").src = `${base64Content}`;
				} else if (window.parent.getbaseflty(file.fileName) == "video") {
					disp.innerHTML = `<video controls width="400" height="300" id="thedisplay">
								<source src="" type="video/mp4" id="thesource">
								Your browser does not support the video tag.
							  </video>`;

					var blob = dataURItoBlob(base64Content);
					var videoFile = new File([blob], "video.mp4", { type: "video/mp4" });
					var videoElement = document.getElementById("thesource");
					const base64Video = URL.createObjectURL(videoFile);
					playBase64Chunks(videoElement, base64Video);
				} else {
					document.getElementById("thedisplay").alt = "Please open the files app to read a file from your system memory.";
				}
			} else {
			}
		}

		window.addEventListener('message', async (event) => {

			if (event.data.action === 'loadlocalfile') {
				if (event.data.id === myWindow.windowID) {
					let newAppId = event.data.returned;
					openfile(newAppId);
				}
			}
		});

		function dataURItoBlob(dataURI) {
			var byteString = atob(dataURI.split(',')[1]);
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
			var ab = new ArrayBuffer(byteString.length);
			var ia = new Uint8Array(ab);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ab], { type: mimeString });
		}

		function openfromfiles() {
			currentreqID = window.parent.genUID();
			let appIdToOpen = window.parent.fileTypeAssociations['file'][0] || null;
			window.parent.openlaunchprotocol(appIdToOpen, { "opener": "any", "dir": "/" }, currentreqID, myWindow.windowID);
		}

		function playBase64Chunks(videoElement, base64Video) {
			videoElement.src = base64Video;
			videoElement.addEventListener('loadedmetadata', () => {
				const duration = videoElement.duration;
				const chunkSize = 10; // chunk size in seconds
				let currentTime = 0;

				function playNextChunk() {
					if (currentTime >= duration) {
						console.log("Video finished");
						return;
					}

					const nextTime = Math.min(currentTime + chunkSize, duration);
					videoElement.currentTime = currentTime;
					videoElement.play();

					const playChunkInterval = setInterval(() => {
						if (videoElement.currentTime >= nextTime) {
							videoElement.pause();
							currentTime = nextTime;
							clearInterval(playChunkInterval);
							playNextChunk();
						}
					}, 100);
				}

				playNextChunk();
			});
		}

	</script>
</body>

</html>
