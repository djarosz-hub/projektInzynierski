import nodemailer from "nodemailer";

const sendEmail = async (subject, emailBody, recipient) => {

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE_NAME,
        auth: {
            user: process.env.EMAIL_SERVICE_USER,
            pass: process.env.EMAIL_SERVICE_PASSWORD
        }
    })
    let tempRecipient = process.env.EMAIL_SERVICE_USER;
    
    // if(recipient) {
    //     tempRecipient = recipient;
    // }

    const options = {
        from: process.env.EMAIL_SERVICE_USER,
        to: tempRecipient,
        subject: subject,
        text: emailBody
    };

    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    })

};

export default sendEmail;