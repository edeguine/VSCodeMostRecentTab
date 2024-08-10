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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log("Hello world");
    console.log('Extension "recent-tabs" is now active!');
    let recentTabs = [];
    const updateTabs = (document) => {
        // Remove existing instance of the document URI
        recentTabs = recentTabs.filter(uri => uri.toString() !== document.uri.toString());
        // Add current document URI at the start of the array
        recentTabs.unshift(document.uri);
        // Move the current tab to the first position
        vscode.commands.executeCommand('moveActiveEditor', { to: 'first', by: 'tab' });
    };
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            updateTabs(editor.document);
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(event => {
        let editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document) {
            updateTabs(event.document);
        }
    }, null, context.subscriptions);
    // Command to manually trigger reordering if needed
    context.subscriptions.push(vscode.commands.registerCommand('recent-tabs.reorder', () => {
        // Manually reorder tabs based on the recentTabs array
        recentTabs.forEach((uri, index) => {
            let editor = vscode.window.visibleTextEditors.find(ed => ed.document.uri.toString() === uri.toString());
            if (editor) {
                vscode.window.showTextDocument(editor.document, { preserveFocus: true, preview: false, viewColumn: editor.viewColumn })
                    .then(() => {
                    vscode.commands.executeCommand('moveActiveEditor', { to: 'position', by: 'tab', value: index + 1 });
                });
            }
        });
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map