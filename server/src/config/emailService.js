import sendEmail from "./sendEmail.js";
import * as emailTemplates from "./emailTemplates.js";

const ADMIN_EMAIL = process.env.GMAILUSER || "taxprosolution26@gmail.com";

/**
 * Send contact form email to admin
 */
export const sendContactFormEmail = async (contactData) => {
  try {
    const emailContent = emailTemplates.contactFormEmailTemplate(contactData);
    await sendEmail({
      email: ADMIN_EMAIL,
      subject: emailContent.subject,
      message: emailContent.html,
    });
    console.log("Contact form email sent to admin");
  } catch (error) {
    console.error("Error sending contact form email:", error);
    throw error;
  }
};

/**
 * Send service request notification to admin
 */
export const sendServiceRequestEmail = async (requestData) => {
  try {
    const emailContent = emailTemplates.serviceRequestEmailTemplate(requestData);
    await sendEmail({
      email: ADMIN_EMAIL,
      subject: emailContent.subject,
      message: emailContent.html,
    });
    console.log("Service request email sent to admin");
  } catch (error) {
    console.error("Error sending service request email:", error);
    throw error;
  }
};

/**
 * Send lead creation confirmation to client
 */
export const sendLeadCreationEmail = async (leadData) => {
  try {
    const emailContent = emailTemplates.leadCreationEmailTemplate(leadData);
    await sendEmail({
      email: leadData.clientEmail,
      subject: emailContent.subject,
      message: emailContent.html,
    });
    console.log("Lead creation email sent to client");
  } catch (error) {
    console.error("Error sending lead creation email:", error);
    throw error;
  }
};

/**
 * Send RM assignment notification to client
 */
export const sendRmAssignmentEmail = async (assignmentData) => {
  try {
    const emailContent = emailTemplates.rmAssignmentEmailTemplate(assignmentData);
    await sendEmail({
      email: assignmentData.clientEmail,
      subject: emailContent.subject,
      message: emailContent.html,
    });
    console.log("RM assignment email sent to client");
  } catch (error) {
    console.error("Error sending RM assignment email:", error);
    throw error;
  }
};

/**
 * Send lead update to client
 */
export const sendLeadUpdateEmail = async (updateData) => {
  try {
    const emailContent = emailTemplates.leadUpdateEmailTemplate(updateData);
    await sendEmail({
      email: updateData.clientEmail,
      subject: emailContent.subject,
      message: emailContent.html,
    });
    console.log("Lead update email sent to client");
  } catch (error) {
    console.error("Error sending lead update email:", error);
    throw error;
  }
};

/**
 * Send admin notification about lead update
 */
export const sendAdminUpdateNotification = async (updateData) => {
  try {
    const emailContent = emailTemplates.adminUpdateNotificationTemplate(updateData);
    await sendEmail({
      email: ADMIN_EMAIL,
      subject: emailContent.subject,
      message: emailContent.html,
    });
    console.log("Admin update notification sent");
  } catch (error) {
    console.error("Error sending admin update notification:", error);
    throw error;
  }
};
