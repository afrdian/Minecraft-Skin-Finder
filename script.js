const input = document.getElementById("username");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const viewer = document.getElementById("viewer");

const bodyCanvas = document.getElementById("bodyCanvas");
const faceCanvas = document.getElementById("faceCanvas");
const rawCanvas = document.getElementById("rawCanvas");

const playerName = document.getElementById("playerName");
const playerUUID = document.getElementById("playerUUID");
const modelType = document.getElementById("modelType");

const downloadBtn = document.getElementById("downloadBtn");

let skinURL = "";

searchBtn.onclick = search;

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") search();
});

async function proxyFetch(url) {

    const proxy = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;

    const res = await fetch(proxy);

    if (!res.ok) {
        throw new Error("Proxy failed");
    }

    const text = await res.text();

    if (!text || text.trim() === "") {
        throw new Error("Empty response");
    }

    return JSON.parse(text);
}

async function search() {

    error.textContent = "";
    viewer.style.display = "none";
    loading.textContent = "Loading...";

    try {

        const username = input.value.trim();

        if (!username) {
            loading.textContent = "";
            return;
        }

        // Step 1: UUID lookup
        const profile = await proxyFetch(
            `https://api.mojang.com/users/profiles/minecraft/${username}`
        );

        if (!profile || !profile.id) {
            throw new Error("User not found");
        }

        const uuid = profile.id;

        // Step 2: skin data
        const session = await proxyFetch(
            `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
        );

        const texturesBase64 = session.properties.find(p => p.name === "textures").value;

        const textures = JSON.parse(atob(texturesBase64));

        skinURL = textures.textures.SKIN.url;

        const model =
            textures.textures.SKIN.metadata?.model === "slim"
                ? "Alex (Slim)"
                : "Steve (Classic)";

        playerName.textContent = "Player: " + profile.name;
        playerUUID.textContent = "UUID: " + uuid;
        modelType.textContent = "Model: " + model;

        await renderSkin();

        loading.textContent = "";
        viewer.style.display = "block";

    } catch (err) {

        console.error(err);

        loading.textContent = "";
        error.textContent = "Player not found or API error.";

    }
}

function renderSkin() {

    return new Promise((resolve) => {

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = skinURL;

        img.onload = () => {

            const bodyCtx = bodyCanvas.getContext("2d");
            const faceCtx = faceCanvas.getContext("2d");
            const rawCtx = rawCanvas.getContext("2d");

            bodyCtx.imageSmoothingEnabled = false;
            faceCtx.imageSmoothingEnabled = false;
            rawCtx.imageSmoothingEnabled = false;

            bodyCtx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);

            // head
            bodyCtx.drawImage(img, 8, 8, 8, 8, 28, 0, 8, 8);

            // torso
            bodyCtx.drawImage(img, 20, 20, 8, 12, 28, 8, 8, 12);

            // arms
            bodyCtx.drawImage(img, 44, 20, 4, 12, 24, 8, 4, 12);
            bodyCtx.drawImage(img, 36, 52, 4, 12, 36, 8, 4, 12);

            // legs
            bodyCtx.drawImage(img, 4, 20, 4, 12, 28, 20, 4, 12);
            bodyCtx.drawImage(img, 20, 52, 4, 12, 32, 20, 4, 12);

            // face
            faceCtx.clearRect(0, 0, 64, 64);
            faceCtx.drawImage(img, 8, 8, 8, 8, 0, 0, 64, 64);

            // raw texture
            rawCtx.clearRect(0, 0, 256, 256);
            rawCtx.drawImage(img, 0, 0, 256, 256);

            downloadBtn.onclick = () => {

                const a = document.createElement("a");
                a.href = skinURL;
                a.download = "minecraft_skin.png";
                a.click();

            };

            resolve();

        };

        img.onerror = () => {

            error.textContent = "Failed to load skin image.";
            resolve();

        };

    });

}