const {User} = require('../models');
const {AuthenticationError} = require("apollo-server-express");
const {signToken} = require('../utils/auth');

const resolvers = {
    Query:{
        me: async (parent, args, context) => { //replace getSingleUser
            if (context.user){
                const user = await User.findOne( { _id: context.user._id })
                .select("-__v -password")
                .populate("book");
                return user
            }
            throw new AuthenticationError("Not logged in");
        },
        users: async () => {
            return User.find().select("-__v -password").populate("book");
        },
        user: async (parent, { username }) => {
            return User.findOne({username}).select("-__v -password").populate("book");
        }
    },
    Mutation:{
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});
            if (!user){
                throw new AuthenticationError("Invalid email");
            }
            const pw = await user.isCorrectPassword(password);
            if (!pw){
                throw new AuthenticationError("Invalid password");
            }
            const token = signToken(user);
            return {token, user};
        },
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({
                username: username,
                email: email,
                password: password
            });
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async (parent, {bookInput}, context) => {
            if (context.user){
                const book = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {savedBooks: bookInput}},
                    {new: true}
                );
                return book;
            }
            throw new AuthenticationError("Not logged in");
        },
        removeBook: async (parent, {bookId}, context) => {
            if (context.user){
                const book = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: bookId}},
                    {new: true}
                );
                return book;
            }
            throw new AuthenticationError("Not logged in");
        }
    }
}

module.exports = resolvers;