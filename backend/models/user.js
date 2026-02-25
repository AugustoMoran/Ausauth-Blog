const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: String,
  passwordHash: String,
  refreshTokenJti: {
    type: String,
    default: null,
  },
  lastActivityAt: {
    type: Date,
    default: null,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.passwordHash
    delete returnedObject.refreshTokenJti
    delete returnedObject.lastActivityAt
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', userSchema)
