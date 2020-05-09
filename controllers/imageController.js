const connection = require('../database/mysql')
const Image = require('../models/Image')
var time = new Date()

/**
 *  Return all images
 */
exports.show_images = async (req, res) => {

	try{
		const images = await Image.find()
		res.json({success: true, images: images})
	} catch(error){
		res.json({success: false, message: error})
	}
}

/**
 *  Return only one image
 */
exports.show_image = async (req, res) => {
	let photo_id = req.params.photoID

	try{
		const image = await Image.findById(photo_id)
		res.json({ success: true, image: image})
	} catch(error){
		res.json({success: false, message: error})
	}
}

/**
 *  Store image
 */
exports.post_image = async (req, res) => {
	if (!req.file) {
		return res.json({
			success: false,
			Message: 'No file uploaded',
		})
	}

	let image_file = req.file
	let imageData =new Image({
		description: req.body.description,
		photo: 'public/images/uploads/' + image_file.originalname,
		user_id: '5eb562edcfa1cc12c5c844eb', // ID of user logged in and uploaded the particular picha will go here
		created_at: Date.now(),
		updated_at: Date.now(),
	})

	try {
		const image = await imageData.save()
		res.json({ success: true, image: image})
	} catch(error){
		res.json({success: false, message: error})
	}

}

/**
 *  Delete an image
 */
exports.delete_image = (req, res) => {
	let photo_id = req.params.photoID

	let delete_query = 'DELETE FROM photos WHERE id = ?'
	connection.query(delete_query, [photo_id], (err, rows) => {
		if (err) return console.log(err)

		return res.json({
			Message: 'Photo deleted successfully',
			Photo: rows,
		})
	})
}

/**
 *  Editing an image
 */
exports.update_image = (req, res) => {
	let photo_id = req.params.photoID
	let photoDetails = {
		description: req.body.description,
		updated_at: time,
	}

	let update_query = 'UPDATE photos SET ? WHERE id = ?'
	connection.query(update_query, [photoDetails, photo_id], (err, rows) => {
		if (err) return console.log(err)

		return res.json({
			Message: 'Photo updated successfully',
			photo: rows,
		})
	})
}
