let dragging = false;
let windowData = {};
let novadotcsscache;
const iframeReferences = {};

async function openlaunchprotocol(appid, data, id, winuid) {
    console.log("Open Launch Protocol", appid, data, id);
    const launchData = { appid, data, winuid };
    Gtodo = launchData;
    openfile(launchData.appid, { data: Gtodo });
}

function OLPreturn(fileID, transferID) {
    if (iframeReferences[transferID]) {
        iframeReferences[transferID].postMessage(
            { returned: fileID, id: transferID, action: 'loadlocalfile' },
            '*'
        );
    }
}

async function openfile(x) {
    try {
        if (!x) throw new Error("No app id provided");

        const fileData = await getFileById(x);
        if (!fileData) throw new Error(`File not found: ${x}`);

        fileData.type = ptypext(fileData.fileName);

        switch (fileData.type) {
            case "app":
                await openapp(fileData.fileName, x);
                break;
            case "osl":
                runAsOSL(fileData.content);
                break;
            case "lnk":
                const linkData = JSON.parse(fileData.content);
                openfile(linkData.open);
                break;
            default:
                handleFileByType(fileData, x);
        }
    } catch (error) {
        console.error("Error:", error);
        say(`<h1>Unable to open file</h1>File Error: ${error}`, "failed");
    }
}

function handleFileByType(fileData, unid) {
    const fileExtension = fileData.fileName.substring(fileData.fileName.lastIndexOf('.'));
    let appIdToOpen = fileTypeAssociations[fileExtension]?.[0] ?? fileTypeAssociations['all']?.[0];

    if (appIdToOpen) {
        openlaunchprotocol(appIdToOpen, unid);
    } else {
        console.warn("No associated app to handle this file type.");
    }
}

function flwin(button) {
    const winElement = button.closest(".window");
    const isFullScreen = button.innerHTML === "open_in_full";
    const aspectRatio = winElement.getAttribute("data-aspectratio") || "9/6";

    const sizeStyles = isFullScreen
        ? { width: '100%', height: 'calc(100% - 57px)', left: '0', top: '0' }
        : calculateWindowSize(aspectRatio);

    Object.assign(winElement.style, sizeStyles);
    button.innerHTML = isFullScreen ? "close_fullscreen" : "open_in_full";

    winElement.classList.add("transp2");
    setTimeout(() => winElement.classList.remove("transp2"), 1000);
}

function calculateWindowSize(aspectRatio = "9/6") {
    const [widthFactor, heightFactor] = aspectRatio.split('/').map(Number);
    const aspectRatioValue = widthFactor / heightFactor;
    const maxVW = 90, maxVH = 90;

    let maxWidthPx = (window.innerWidth * maxVW) / 100;
    let maxHeightPx = (window.innerHeight * maxVH) / 100;

    let heightPx = (maxHeightPx * 70) / 100;
    let widthPx = heightPx * aspectRatioValue;

    if (widthPx > maxWidthPx) {
        widthPx = maxWidthPx;
        heightPx = widthPx / aspectRatioValue;
    }

    const offset = 5 * Object.keys(winds).length;
    return {
        left: `calc(50vw - ${widthPx / 2}px + ${offset}px)`,
        top: `calc(50vh - ${heightPx / 2}px + ${offset}px)`,
        width: `${widthPx}px`,
        height: `${heightPx}px`,
    };
}

async function openwindow(title, content, icon, theme, aspectRatio, appid, params) {
    const winuid = genUID();
    const winID = `window${winuid}`;
    winds[`${title}${winuid}`] = 1;

    const winDiv = createWindowDiv(winID, winuid, title, icon, theme, aspectRatio);
    const winContent = createWindowContentDiv();
    const winLoader = createWindowLoaderDiv(content, appid, winuid);

    winDiv.append(winContent, winLoader);
    document.body.appendChild(winDiv);

    setupDragBehavior(winDiv);
    loadIframeContent(winLoader, winContent, content, appid, winuid, title, params);
}
