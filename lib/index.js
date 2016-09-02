import http from 'http';
import fs from 'fs';
import path from 'path';

let server = http.createServer((req, res) => {

	const method = req.method;
	const url = req.url;

	let body = [];

	req.on('error', function(err) {
		console.error(err);
	}).on('data', function(chunk) {
		body.push(chunk);
	}).on('end', function() {
		body = Buffer.concat(body).toString();
	});

	let filePath;
	let stat;
	let contentType;
	
	if (url.startsWith('/static')) {
		filePath = path.join(__dirname, '../', url);
		stat = fs.statSync(filePath);

		if (url.endsWith('.jpg')) {
			contentType = 'image/jpg';
		} else if (url.endsWith('.css')) {
			contentType = 'text/css';
		}
	} else if (url === '/' ||
				url === '' ||
				url === '/index.html') {
		filePath = path.join(__dirname, '../index.html');
		stat = fs.statSync(filePath);
		
		contentType = 'text/html';
	}

	if (stat) {
		res.writeHead(200, {
			'Content-Type': contentType,
			'Content-Length': stat.size
		});

		fs.createReadStream(filePath).pipe(res);
	} else {
		res.statusCode = 404;
		res.end();
	}
}).listen(80);

console.log('Server running at ' + server.address().port);

