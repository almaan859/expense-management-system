function sendEmail(to, subject, message) {
  console.log("📧 EMAIL SENT");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Message:", message);
}

module.exports = { sendEmail };

