const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'diego.pedroso15@gmail.com',
    pass: 'phds onnr qhro vugc',
  },
});

const mailBody = (clientName, devName, status, message) => {
  return `
    Olá, ${clientName}!

    Status do ticket: ${status}!

    ${message}

    Atenciosamente,
    ${devName}
  `;
};

const sendEmail = async (req, res) => {
  const { recipient, subject, clientName, devName, status, message} = req.body;

  const mailOptions = {
    from: 'diego.pedroso15@gmail.com',
    to: recipient,
    subject: subject,
    text: mailBody(clientName, devName, status, message),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).json({ message: 'Error sending email.' });
  }
};

module.exports = {
  sendEmail,
};
