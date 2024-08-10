import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log("Hello world");
	console.log('Extension "recent-tabs" is now active!');

	let recentTabs: vscode.Uri[] = [];

	const updateTabs = (document: vscode.TextDocument) => {
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

export function deactivate() { }
