require('dotenv').config()
const express = require('express')
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')

const upload = multer()
const app = express()

const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const PORT = process.env.PORT || 8080

app.use(express.static(path.join(__dirname, "..", "build")))
app.use(express.static("public"))

app.post('/sigReqEvents', upload.none(), (req, res, next) => {
	// Message needed to respond to Dropbox Sign webhook requests
	res.status(200).send('Hello API Event Received')
	console.log(req.body.json)
	const event = JSON.parse(req.body.json)

	// Validation of event_hash
	const hash = crypto.createHmac('sha256', process.env.API_KEY).update(event.event.event_time + event.event.event_type).digest('hex').toString()
	console.log(`Hash Key Check: ${hash}`)
	console.log(`Hash from Event: ${event.event.event_hash}`)
	console.log(event.event.event_type)
	console.log(event.signature_request ? event.signature_request : event)

	// Further actions that can be taken based on event type
	// if(event.event.event_type === 'signature_request_downloadable') {
	// 	const sigReqId = event.signature_request.signature_request_id
	// 	console.log(sigReqId)
	// 	hellosign.signatureRequest.download(sigReqId, { file_type: 'zip' },
	// 		(err, res) => {
	// 			const file = fs.createWriteStream(`./Signature Requests/${sigReqId}.zip`)
	// 			res.pipe(file)
	// 			file.on('finish', () => {
	// 				file.close()
	// 			})
 	// 		})
	// }
})

app.listen(PORT, () => {
	console.log(`Listening on PORT: ${PORT}`)
})