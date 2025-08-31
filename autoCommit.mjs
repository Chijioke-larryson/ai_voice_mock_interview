import simpleGit from "simple-git";
import chokidar from "chokidar";
import isOnline from "is-online";
import fs from "fs";

const git = simpleGit();
const REPO_PATH = process.cwd();
const QUEUE_FILE = `${REPO_PATH}/.commit_queue.json`;

let lastCommit = Date.now();

// Load commit queue if exists
function loadQueue() {
    if (fs.existsSync(QUEUE_FILE)) {
        return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8"));
    }
    return [];
}

// Save queue to file
function saveQueue(queue) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

async function autoCommit(message) {
    const online = await isOnline();
    let queue = loadQueue();

    if (!online) {
        console.log("⚠️ No internet. Saving commit to queue...");
        queue.push({ message, timestamp: Date.now() });
        saveQueue(queue);
        return;
    }

    // First push any queued commits
    if (queue.length > 0) {
        console.log(`📦 Found ${queue.length} queued commits. Pushing...`);
        for (const commit of queue) {
            try {
                fs.appendFileSync("queued_changes.log", `Replay at ${new Date().toISOString()}\n`);
                await git.add(".");
                await git.commit(commit.message);
                await git.push();
                console.log(`[+] Queued commit pushed: ${commit.message}`);
            } catch (err) {
                console.log("[-] Failed to push queued commit, keeping it in queue:", err.message);
                saveQueue(queue);
                return;
            }
        }
        // Clear queue if successful
        queue = [];
        saveQueue(queue);
    }

    // Now push the new commit
    try {
        await git.add(".");
        await git.commit(message);
        await git.push();
        console.log(`[+] Auto commit pushed: ${message}`);
        lastCommit = Date.now();
    } catch (err) {
        console.log("[-] Push failed, saving commit to queue:", err.message);
        queue.push({ message, timestamp: Date.now() });
        saveQueue(queue);
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

// Retry every 2 minutes if internet comes back
setInterval(async () => {
    await autoCommit("Retry pending commits");
}, 2 * 60 * 1000);
