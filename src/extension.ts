import * as vscode from 'vscode';

let statusBarItem: vscode.StatusBarItem;
let totalActiveTime = 0;
let lastFocusTime: number | null = null;
let interval: ReturnType<typeof setInterval>;

export function activate(context: vscode.ExtensionContext) {

    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );

    statusBarItem.show();

    // If VS Code starts focused
    if (vscode.window.state.focused) {
        lastFocusTime = Date.now();
    }

    vscode.window.onDidChangeWindowState((state: vscode.WindowState) => {
        if (state.focused) {
            lastFocusTime = Date.now();
        } else {
            if (lastFocusTime !== null) {
                totalActiveTime += Date.now() - lastFocusTime;
                lastFocusTime = null;
            }
        }
    });

    interval = setInterval(() => {
        let displayTime = totalActiveTime;

        if (lastFocusTime !== null) {
            displayTime += Date.now() - lastFocusTime;
        }

        statusBarItem.text = `⏱ ${formatTime(displayTime)}`;
    }, 1000);

    context.subscriptions.push(statusBarItem);
}

function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num: number): string {
    return num.toString().padStart(2, '0');
}

export function deactivate() {
    clearInterval(interval);
}