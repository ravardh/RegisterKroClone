const primaryColor = "#0063B0";
const primaryHoverColor = "#004D8C";
const accentColor = "#fbbf24";
const textColor = "#374151";
const lightBg = "#f9fafb";
const successColor = "#10b981";

// Header template
const emailHeader = () => {
  return `
    <div style="background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryHoverColor} 100%); padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">TaxPro Solution</h1>
      <p style="color: ${accentColor}; margin: 5px 0 0 0;">Professional Business Solutions</p>
    </div>
  `;
};

// Footer template
const emailFooter = () => {
  return `
    <div style="background-color: ${lightBg}; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 30px;">
      <p style="color: ${textColor}; font-size: 12px; margin: 0;">
        <strong>TaxPro Solution</strong> | Professional Business Services<br>
        Email: taxprosolution26@gmail.com<br>
        This is an automated email. Please do not reply directly.
      </p>
    </div>
  `;
};

// 1. Contact Form Email (to admin)
export const contactFormEmailTemplate = (contactData) => {
  const { name, email, phone, subject, message } = contactData;
  
  return {
    subject: `New Contact Form Submission - ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${emailHeader()}
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 20px;">New Contact Inquiry</h2>
          
          <div style="background-color: ${lightBg}; padding: 20px; border-radius: 8px; border-left: 4px solid ${accentColor};">
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Email:</strong> <a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none;">${email}</a></p>
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Phone:</strong> <a href="tel:${phone}" style="color: ${primaryColor}; text-decoration: none;">${phone}</a></p>
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #d1d5db; margin: 15px 0;">
            <p style="margin: 0; color: ${textColor}; line-height: 1.6;"><strong>Message:</strong></p>
            <p style="color: ${textColor}; line-height: 1.6; margin-top: 10px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid ${accentColor};">
            <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    `
  };
};

// 2. Service Request Email (to admin)
export const serviceRequestEmailTemplate = (requestData) => {
  const { clientName, clientEmail, serviceName, serviceId, requestDate } = requestData;
  
  return {
    subject: `New Service Request - ${serviceName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${emailHeader()}
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 20px;">New Service Request Received</h2>
          
          <div style="background-color: ${lightBg}; padding: 20px; border-radius: 8px; border-left: 4px solid ${successColor};">
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Client Name:</strong> ${clientName}</p>
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Client Email:</strong> <a href="mailto:${clientEmail}" style="color: ${primaryColor}; text-decoration: none;">${clientEmail}</a></p>
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Service Requested:</strong> ${serviceName}</p>
            <p style="margin: 0 0 15px 0; color: ${textColor};"><strong>Service ID:</strong> <code style="background-color: white; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${serviceId}</code></p>
            <p style="margin: 0; color: ${textColor};"><strong>Request Date:</strong> ${new Date(requestDate).toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid ${primaryColor};">
            <p style="margin: 0; color: #0c4a6e; font-size: 14px;"><strong>Next Steps:</strong> Assign a relationship manager and begin the service process.</p>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    `
  };
};

// 3. Lead Creation Email (to client)
export const leadCreationEmailTemplate = (leadData) => {
  const { clientName, clientEmail, serviceName, serviceId, leadId, createdDate } = leadData;
  const trackingId = serviceId || leadId;
  const responseDeadline = new Date(createdDate);
  responseDeadline.setDate(responseDeadline.getDate() + 2); // 2 days for 24-48 hours
  
  return {
    subject: `Your Service Request Confirmed - Service ID: ${trackingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${emailHeader()}
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 10px;">Welcome, ${clientName}!</h2>
          <p style="color: ${textColor}; margin-bottom: 20px; font-size: 14px;">Thank you for choosing TaxPro Solution for your business needs.</p>
          
          <div style="background: linear-gradient(135deg, ${primaryColor}20 0%, ${accentColor}20 100%); padding: 25px; border-radius: 8px; border-left: 4px solid ${accentColor}; margin-bottom: 20px;">
            <p style="margin: 0 0 15px 0; color: ${textColor}; font-size: 14px;"><strong>Service:</strong></p>
            <p style="margin: 0 0 20px 0; color: ${primaryColor}; font-size: 18px; font-weight: bold;">${serviceName}</p>
            
            <p style="margin: 0 0 15px 0; color: ${textColor}; font-size: 14px;"><strong>Your Service ID:</strong></p>
            <div style="background-color: white; padding: 12px 15px; border-radius: 6px; font-family: monospace; font-size: 16px; font-weight: bold; color: ${primaryColor}; margin-bottom: 20px;">
              ${trackingId}
            </div>
            
            <p style="margin: 0; color: ${textColor}; font-size: 14px; line-height: 1.6;">
              Please save this Service ID for your reference. You'll need it for all future communications regarding this service.
            </p>
          </div>
          
          <div style="background-color: ${lightBg}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: ${primaryColor}; margin-top: 0; font-size: 16px;">What Happens Next?</h3>
            <ul style="color: ${textColor}; margin: 10px 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Our team will review your request immediately</li>
              <li style="margin-bottom: 10px;">You'll receive contact from our Relationship Manager within <strong>24-48 hours</strong></li>
              <li style="margin-bottom: 10px;">They will guide you through the entire process</li>
              <li>Updates will be sent to you regularly</li>
            </ul>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid ${accentColor};">
            <p style="margin: 0; color: #92400e; font-size: 13px;">
              <strong>Timeline:</strong> Expected response by <strong>${responseDeadline.toLocaleDateString()}</strong>
            </p>
          </div>
          
          <p style="margin: 30px 0 0 0; color: ${textColor}; text-align: center; font-size: 14px;">
            If you have any questions, feel free to contact us.
          </p>
        </div>
        
        ${emailFooter()}
      </div>
    `
  };
};

// 4. RM Assignment Email (to client)
export const rmAssignmentEmailTemplate = (assignmentData) => {
  const { clientName, clientEmail, rmName, rmEmail, rmPhone, serviceId, leadId, serviceName } = assignmentData;
  const trackingId = serviceId || leadId;
  
  return {
    subject: `Your Relationship Manager Has Been Assigned - Service ID: ${trackingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${emailHeader()}
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 10px;">Great News, ${clientName}!</h2>
          <p style="color: ${textColor}; margin-bottom: 20px; font-size: 14px;">Your Relationship Manager has been assigned to handle your service request.</p>
          
          <div style="background: linear-gradient(135deg, ${primaryColor}20 0%, ${accentColor}20 100%); padding: 25px; border-radius: 8px; border-left: 4px solid ${successColor}; margin-bottom: 20px;">
            <h3 style="color: ${primaryColor}; margin-top: 0; font-size: 18px; margin-bottom: 15px;">Meet Your Relationship Manager</h3>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <p style="margin: 0 0 12px 0; font-size: 16px; color: ${primaryColor}; font-weight: bold;">${rmName}</p>
              <p style="margin: 0 0 8px 0; color: ${textColor}; font-size: 14px;">
                <strong>Email:</strong> <a href="mailto:${rmEmail}" style="color: ${primaryColor}; text-decoration: none;">${rmEmail}</a>
              </p>
              <p style="margin: 0; color: ${textColor}; font-size: 14px;">
                <strong>Phone:</strong> <a href="tel:${rmPhone}" style="color: ${primaryColor}; text-decoration: none;">${rmPhone}</a>
              </p>
            </div>
          </div>
          
          <div style="background-color: ${lightBg}; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${primaryColor};">
            <h3 style="color: ${primaryColor}; margin-top: 0; font-size: 16px;">Service Details</h3>
            <p style="margin: 10px 0; color: ${textColor};"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 10px 0; color: ${textColor};"><strong>Service ID:</strong> <code style="background-color: white; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${trackingId}</code></p>
          </div>
          
          <div style="background-color: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid ${successColor};">
            <p style="margin: 0; color: #065f46; font-size: 13px;">
              <strong>✓ Assigned:</strong> ${rmName} will contact you shortly to discuss the next steps for your service request.
            </p>
          </div>
          
          <p style="margin: 30px 0 0 0; color: ${textColor}; text-align: center; font-size: 13px;">
            For any urgent matters, you can reach out to ${rmName} directly using the contact details above.
          </p>
        </div>
        
        ${emailFooter()}
      </div>
    `
  };
};

// 5. Lead Update Email (to client)
export const leadUpdateEmailTemplate = (updateData) => {
  const { clientName, clientEmail, serviceId, leadId, serviceName, updateTitle, updateDescription, status, progressPercentage } = updateData;
  const trackingId = serviceId || leadId;
  
  const statusColor = status === "in_progress" ? successColor : status === "pending" ? accentColor : primaryColor;
  const statusLabel = status === "in_progress" ? "In Progress" : status === "pending" ? "Pending" : "Review";
  
  return {
    subject: `Service Update - ${updateTitle} | Service ID: ${trackingId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${emailHeader()}
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 10px;">Update on Your Service Request</h2>
          <p style="color: ${textColor}; margin-bottom: 20px; font-size: 14px;">We have a new update regarding your ${serviceName} service.</p>
          
          <div style="background: linear-gradient(135deg, ${statusColor}20 0%, ${statusColor}40 100%); padding: 25px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 style="color: ${primaryColor}; margin: 0; font-size: 18px;">${updateTitle}</h3>
              <span style="background-color: ${statusColor}; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${statusLabel}</span>
            </div>
            
            <p style="margin: 0; color: ${textColor}; line-height: 1.6;">${updateDescription}</p>
          </div>
          
          <div style="background-color: ${lightBg}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: ${primaryColor}; margin-top: 0; font-size: 16px;">Progress Overview</h3>
            <p style="margin: 0 0 15px 0; color: ${textColor}; font-size: 13px;"><strong>Service ID:</strong> ${trackingId}</p>
            <p style="margin: 0 0 15px 0; color: ${textColor}; font-size: 13px;"><strong>Service:</strong> ${serviceName}</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0 0 10px 0; color: ${textColor}; font-size: 12px;"><strong>Completion Progress</strong></p>
              <div style="background-color: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden;">
                <div style="background: linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%); height: 100%; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
              </div>
              <p style="margin: 10px 0 0 0; color: ${primaryColor}; font-size: 13px; font-weight: bold;">${progressPercentage}% Complete</p>
            </div>
          </div>
          
          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid ${primaryColor};">
            <p style="margin: 0; color: #0c4a6e; font-size: 13px;">
              <strong>Next Steps:</strong> We will keep you updated on the progress. Thank you for your patience.
            </p>
          </div>
          
          <p style="margin: 30px 0 0 0; color: ${textColor}; text-align: center; font-size: 13px;">
            If you have any questions about this update, please contact your Relationship Manager.
          </p>
        </div>
        
        ${emailFooter()}
      </div>
    `
  };
};

// Admin notification for updates
export const adminUpdateNotificationTemplate = (updateData) => {
  const { clientName, serviceId, leadId, serviceName, updateTitle, updateDescription } = updateData;
  const trackingId = serviceId || leadId;
  
  return {
    subject: `Update Notification - ${serviceName} (Service ID: ${trackingId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        ${emailHeader()}
        
        <div style="padding: 30px; background-color: white;">
          <h2 style="color: ${primaryColor}; font-size: 20px; margin-bottom: 20px;">Lead Update Notification</h2>
          
          <div style="background-color: ${lightBg}; padding: 20px; border-radius: 8px; border-left: 4px solid ${primaryColor};">
            <p style="margin: 0 0 12px 0; color: ${textColor};"><strong>Client:</strong> ${clientName}</p>
            <p style="margin: 0 0 12px 0; color: ${textColor};"><strong>Service ID:</strong> <code style="background-color: white; padding: 5px 10px; border-radius: 4px; font-family: monospace;">${trackingId}</code></p>
            <p style="margin: 0 0 12px 0; color: ${textColor};"><strong>Service:</strong> ${serviceName}</p>
            <hr style="border: none; border-top: 1px solid #d1d5db; margin: 15px 0;">
            <p style="margin: 0 0 12px 0; color: ${textColor};"><strong>Update:</strong> ${updateTitle}</p>
            <p style="margin: 0; color: ${textColor}; line-height: 1.6;">${updateDescription}</p>
          </div>
        </div>
        
        ${emailFooter()}
      </div>
    `
  };
};
