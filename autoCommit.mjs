// auto-commit.mjs
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const run = promisify(exec);
const QUEUE_FILE = "commit-queue.json";

// Load queued commits if any
function loadQueue() {
    if (!fs.existsSync(QUEUE_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
    } catch {
        return [];
    }
}

// Save queue to file
function saveQueue(queue) {
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

// Run git command helper
async function git(cmd) {
    try {
        const { stdout, stderr } = await run(`git ${cmd}`);
        if (stdout) console.log(stdout.trim());
        if (stderr) console.error(stderr.trim());
    } catch (err) {
        console.error(`Git command failed: git ${cmd}\n${err.stderr}`);
        throw err;
    }
}

// Create a commit
async function makeCommit() {
    const message = `Auto-commit at ${new Date().toISOString()}`;
    await git("add .");
    await git(`commit -m "${message}" || echo 'No changes to commit'`);
    return message;
}

// Try to push commits
async function pushCommits(queue) {
    if (queue.length === 0) return;

    console.log("🔄 Attempting to push queued commits...");
    try {
        await git("push origin main"); // change branch if not "main"
        console.log("✅ Push successful!");
        queue.length = 0; // clear queue on success
    } catch {
        console.log("⚠️ Push failed, keeping commits in queue.");
    }
}

// Main function
async function main() {
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

main();
