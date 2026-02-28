"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
let statusBarItem;
let totalActiveTime = 0;
let lastFocusTime = null;
let interval;
function activate(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.show();
    // If VS Code starts focused
    if (vscode.window.state.focused) {
        lastFocusTime = Date.now();
    }
    vscode.window.onDidChangeWindowState((state) => {
        if (state.focused) {
            lastFocusTime = Date.now();
        }
        else {
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
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
function pad(num) {
    return num.toString().padStart(2, '0');
}
function deactivate() {
    clearInterval(interval);
}
//# sourceMappingURL=extension.js.map