// auto-commit.mjs
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import chokidar from "chokidar";

const run = promisify(exec);
const QUEUE_FILE = "commit-queue.json";
const REPO_PATH = process.cwd();

// --- Queue Helpers ---
function loadQueue() {
    if (!fs.existsSync(QUEUE_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
    } catch {
        return [];
    }
}
function saveQueue(queue) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// --- Git Helper ---
async function git(cmd) {
    try {
        const { stdout, stderr } = await run(`git ${cmd}`);
        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (err) {
        // auto-clean index.lock if it blocks commits
        if (fs.existsSync(".git/index.lock")) {
            fs.unlinkSync(".git/index.lock");
            console.log("⚠️ Removed stale index.lock");
        }
        console.error(`Git failed: git ${cmd}\n${err.stderr}`);
        throw err;
    }
}

// --- Commit Creator ---
async function makeCommit() {
    const message = `Auto-commit at ${new Date().toISOString()}`;
    await git("add .");
    await git(`commit -m "${message}" || echo 'No changes to commit'`);
    return message;
}

// --- Pusher ---
async function pushCommits(queue) {
    if (queue.length === 0) return;
    console.log("🔄 Trying to push queued commits...");
    try {
        await git("push origin main"); // change 'main' if your branch differs
        console.log("✅ Push successful!");
        queue.length = 0;
    } catch {
        console.log("⚠️ Push failed, keeping commits in queue.");
    }
}

// --- Main Logic ---
async function commitAndPush() {
    let queue = loadQueue();
    try {
        const message = await makeCommit();
        queue.push(message);
        saveQueue(queue);
    } catch (e) {
        console.error("Skipping commit due to error:", e.message);
    }
    await pushCommits(queue);
    saveQueue(queue);
}

// --- Watch for file changes ---
chokidar.watch(REPO_PATH, { ignored: /node_modules|\.git/ }).on("all", async (event, path) => {
    console.log(`📂 Change detected: ${event} on ${path}`);
    await commitAndPush();
});

// --- Scheduled commits every 10 minutes ---
setInterval(async () => {
    console.log("⏰ Running scheduled auto-commit (10 min)...");
    await commitAndPush();
}, 10 * 60 * 1000);

console.log("👀 Watching project for changes + auto-committing every 10 minutes...");
