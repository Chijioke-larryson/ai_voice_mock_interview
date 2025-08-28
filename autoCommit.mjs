import simpleGit from "simple-git";
import chokidar from "chokidar";
import isOnline from "is-online";

const git = simpleGit();
const REPO_PATH = process.cwd();

let lastCommit = Date.now();

async function autoCommit(message) {
    const online = await isOnline();
    if (!online) {
        console.log("⚠️ No internet. Will retry later...");
        return;
    }

    try {
        await git.add(".");
        await git.commit(message);
        await git.push();
        console.log(`[+] Auto commit pushed: ${message}`);
        lastCommit = Date.now();
    } catch (err) {
        console.log("[-] Nothing to commit or error:", err.message);
    }
}

// Watch for file changes
chokidar.watch(REPO_PATH, { ignored: /node_modules/ }).on("all", async () => {
    await autoCommit("Auto commit: File change detected");
});

// Scheduled commit every 40 minutes
setInterval(async () => {
    await autoCommit("Scheduled auto commit (40 min)");
}, 40 * 60 * 1000);
