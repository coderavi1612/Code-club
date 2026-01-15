require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(cors({
  origin: "*", // or your frontend domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));


const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();
console.log("mysql connected!");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/api/register", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { name, enrollment, phone, email, school, course, year } = req.body;

    if (!name || !enrollment || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO participants
   (name, enrollment, phone, email, school, course, year)
   VALUES (?, ?, ?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE id = id`,
      [name, enrollment, phone, email, school, course, year]
    );

    if (result.insertId === 0) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    // Send mail (await or fire-and-forget)
    const mailSent = await sendMail(
      name,
      enrollment,
      phone,
      email,
      school,
      course,
      year
    );

    if (mailSent) {
      await connection.query(
        `UPDATE participants SET is_mailed = 1 WHERE id = ?`,
        [result.insertId]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    await connection.rollback();

    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Already registered",
      });
    }
    if (e.code === "ER_CHECK_CONSTRAINT_VIOLATED") {
      return res.status(409).json({
        success: false,
        message: "Enter Valid number!",
      });
    }

    console.error(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    connection.release();
  }
});

app.get("/api/getUsers/ravi1612", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM participants");
    res.send(rows);
  } catch (e) {
    // console.log(e);
  }
});
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASS, // The 16-character App Password
  },
});

async function sendMail(name, enrollment, phone, email, school, course, year) {
  try {
    await transporter.sendMail({
      from: '"VibeCode 101 | CODE Club" <code.gsfcu@gmail.com>',
      to: email,
      subject: `${name} has participated in CODE club's event`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VibeCode 101</title>
</head>

<body style="margin:0; padding:0; background:#050505; font-family:Arial, Helvetica, sans-serif; color:#ffffff;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505; padding:20px 0;">
    <tr>
      <td align="center">

        <!-- MAIN CONTAINER -->
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:520px; background:rgba(10,15,20,0.9); border:1px solid rgba(0,255,204,0.3); border-radius:16px; overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="padding:28px 20px; background:#020409;">
              <img src="https://vibecode-101.vercel.app/code-logo.png"
                width="64"
                alt="Code Club"
                style="display:block; margin-bottom:14px;" />

              <h1 style="
                margin:0;
                font-size:28px;
                letter-spacing:2px;
                text-transform:uppercase;
                color:#ffffff;">
                VibeCode 101
              </h1>

              <p style="
                margin-top:8px;
                font-size:13px;
                letter-spacing:3px;
                color:#00c8ff;
                text-transform:uppercase;">
                Idea to MVP
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:24px 22px;">

              <p style="font-size:14px; margin-bottom:12px;">
                Hello <strong style="color:#00ffcc;">${name}</strong>,
              </p>

              <p style="font-size:14px; line-height:1.6; color:#dddddd;">
                <strong style="color:#00ffcc;">SYSTEM ACCESS GRANTED.</strong><br/>
                You are successfully registered for <strong>VibeCode 101</strong>.
              </p>

              <!-- INFO CARD -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin:20px 0; border-left:3px solid #00ffcc; background:#000; padding:14px;">
                <tr>
                  <td style="font-size:12px; color:#00ffcc; text-transform:uppercase; padding-bottom:6px;">
                    Participant Profile
                  </td>
                </tr>

                <tr><td style="font-size:13px; padding:4px 0;">Enrollment: <strong>${enrollment}</strong></td></tr>
                <tr><td style="font-size:13px; padding:4px 0;">Phone: <strong>${phone}</strong></td></tr>
                <tr><td style="font-size:13px; padding:4px 0;">Email: <strong>${email}</strong></td></tr>
                <tr><td style="font-size:13px; padding:4px 0;">School: <strong>${school}</strong></td></tr>
                <tr><td style="font-size:13px; padding:4px 0;">Course: <strong>${course}</strong></td></tr>
                <tr><td style="font-size:13px; padding:4px 0;">Year: <strong>${year}</strong></td></tr>
              </table>

              <!-- EVENT DETAILS -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="margin-bottom:20px;">
                <tr>
                  <td style="font-size:12px; color:#00ffcc; text-transform:uppercase; padding-bottom:8px;">
                    Event Coordinates
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;">📅 <strong>19 Jan 2026</strong></td>
                </tr>
                <tr>
                  <td style="font-size:14px;">⏰ <strong>11:00 AM – 02:00 PM</strong></td>
                </tr>
                <tr>
                  <td style="font-size:14px;">📍 <strong>SOT Auditorium, GSFC University</strong></td>
                </tr>
              </table>

              <!-- STATUS -->


            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center"
              style="padding:16px; background:#020409; font-size:11px; color:#666;">
              © ${new Date().getFullYear()} Code Club · GSFC University<br/>
              This is an automated system message.
            </td>
          </tr>

        </table>
        <!-- END CONTAINER -->

      </td>
    </tr>
  </table>

</body>
</html>

`,
    });

    console.log(`Mail sent to ${email}`);
    return true;
  } catch (e) {
    console.error("Mail failed:", e.message);
    return false;
  }
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
