const AWS = require("aws-sdk");
const ses = new AWS.SES({ region: "us-west-2" });

exports.handler = async (event) => {
  try {
    const { name, email, message } = JSON.parse(event.body || "{}");
    if (!name || !email) {
      return { statusCode: 400, body: "Name and email required." };
    }
    // Send email via SES
    await ses.sendEmail({
      Source: "contact@thoughtfulbites.com",
      Destination: { ToAddresses: ["thoughtfulbitesuci@gmail.com"] },
      Message: {
        Subject: { Data: `Contact Form from ${name}` },
        Body: {
          Text: {
            Data: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
          }
        }
      }
    }).promise();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email sent!" })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
