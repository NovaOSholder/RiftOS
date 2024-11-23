function timeAgo(ms) {
	if (!ms) return false;

	const seconds = Math.floor((Date.now() - ms) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	return seconds < 60 ? `${seconds} seconds ago` :
		minutes < 60 ? `${minutes} minutes ago` :
		hours < 24 ? `${hours} hours ago` :
		days < 30 ? `${days} days ago` :
		months < 12 ? `${months} months ago` :
		years === 1 ? `a year ago` :
		`${years} years ago`;
}

function genUID() {
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_=+].,><;|?}{!@#$%^&*()';
	return Array.from({ length: 12 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function isBase64(str) {
	try {
		const base64Pattern = /^[A-Za-z0-9+/=]+$/;

		const validateBase64 = (data) => {
			if (!base64Pattern.test(data)) return false;

			// Pad if needed
			const padding = data.length % 4;
			if (padding > 0) data += '='.repeat(4 - padding);

			atob(data); // Decode to validate
			return true;
		};

		if (validateBase64(str)) return true;

		const base64Prefix = 'data:';
		const base64Delimiter = ';base64,';
		if (str.startsWith(base64Prefix)) {
			const delimiterIndex = str.indexOf(base64Delimiter);
			if (delimiterIndex !== -1) {
				const base64Data = str.substring(delimiterIndex + base64Delimiter.length);
				return validateBase64(base64Data);
			}
		}
		return false;
	} catch {
		return false;
	}
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument;
}

function decodeBase64Content(str) {
	const base64Prefix = ';base64,';
	const prefixIndex = str.indexOf(base64Prefix);
	if (prefixIndex !== -1) {
		str = str.substring(prefixIndex + base64Prefix.length);
	}
	return isBase64(str) ? atob(str) : str;
}

function getFourthDimension() {
	return Date.now();
}

function getBaseFileType(ext) {
	const mimeTypes = {
		music: ['mp3', 'mpeg', 'wav', 'flac'],
		video: ['mp4', 'avi', 'mov', 'mkv'],
		image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
		document: ['txt', 'doc', 'docx', 'pdf', 'html'],
		app: ['app'],
		code: ['cpp', 'py', 'css', 'js', 'json'],
		webpage: ['html']
	};

	for (const [type, extensions] of Object.entries(mimeTypes)) {
		if (extensions.includes(ext)) return type;
	}

	return ext;
}

function basename(str) {
	try {
		const parts = str.split('.');
		return parts.length > 1 ? parts.slice(0, -1).join('.') : str;
	} catch {
		return str;
	}
}

function markdownToHTML(markdown) {
	const rules = [
		{ regex: /(\*\*)(.*?)\1/g, replacement: '<strong>$2</strong>' },
		{ regex: /(\*|_)(.*?)\1/g, replacement: '<em>$2</em>' },
		{ regex: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
		{ regex: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
		{ regex: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
		{ regex: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
		{ regex: /^\s*[-+*] (.*$)/gim, replacement: '<li>$1</li>' },
		{ regex: /```([^`]+)```/g, replacement: '<codeblock>$1</codeblock>' },
		{ regex: /`([^`]+)`/g, replacement: '<code>$1</code>' },
		{ regex: /\[(.*?)\]\((.*?)\)/gim, replacement: '<a href="$2">$1</a>' },
		{ regex: /  \n/g, replacement: '<br>' },
		{ regex: /(<li>.*<\/li>)/gim, replacement: '<ul>$1</ul>' }
	];

	return rules.reduce((html, rule) => html.replace(rule.regex, rule.replacement), markdown).trim();
}

function stringToPastelColor(str) {
	if (!str) return 'rgb(255,255,255)';

	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	const r = (hash >> 24) & 0xFF;
	const g = (hash >> 16) & 0xFF;
	const b = (hash >> 8) & 0xFF;

	return `rgb(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)})`;
}

function getFileExtension(str) {
	try {
		const parts = str.split('.');
		return parts.length > 1 ? parts.pop() : '';
	} catch {
		return '';
	}
}
