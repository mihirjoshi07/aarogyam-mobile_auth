const User=require("../models/users.js")
const OTP=require("../models/optSchema.js")
const twilio=require("twilio")
const jwt = require('jwt-simple');

const jwtSecret=process.env.JWT_SECRET
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client=twilio(accountSid,authToken)

exports.sendOtp= async(req, res)=>{
    const { phoneNumber } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate 4-digit OTP
    const otpDoc = new OTP({ phoneNumber, otp });

    try {
        await otpDoc.save();
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: '16185075714',
            to: phoneNumber
        });
        res.status(200).send('OTP sent successfully');
    } catch (error) {
        console.error('Failed to send OTP:', error);
        res.status(500).send('Failed to send OTP');
    }
}

exports.verifyOtp=async (req, res) => {
    const { phoneNumber, otp,email } = req.body;

    try {
        const otpDoc = await OTP.findOne({  otp });
        console.log(otpDoc)
        if (otpDoc) {
            await OTP.deleteOne({ _id: otpDoc._id });

            let user = await User.findOne({ phoneNumber });
            if (!user) {
                user = new User({ phoneNumber,email });
                await user.save();
            }

            const token = jwt.encode({ phoneNumber ,timestamp: new Date().toISOString() }, jwtSecret);
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid OTP');
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Internal server error');
    }
};

