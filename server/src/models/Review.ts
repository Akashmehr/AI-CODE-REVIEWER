import mongoose from 'mongoose';

// Define what a Code Review looks like in the database
const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',       // Links to the User model
            required: true,    // Every review must belong to a user
        },
        code: {
            type: String,
            required: true,    // The actual code that was reviewed
        },
        language: {
            type: String,
            required: true,    // Programming language (javascript, python etc)
        },
        feedback: {
            type: String,
            required: true,    // The AI's review/feedback
        },
    },
    {
        timestamps: true,    // Auto adds createdAt and updatedAt
    }
);

export default mongoose.model('Review', reviewSchema);