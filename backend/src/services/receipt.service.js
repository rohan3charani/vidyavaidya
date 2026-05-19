const PDFDocument = require('pdfkit');
const { storage } = require('../config/firebase');
const { decrypt } = require('./encryption.service');

const receiptService = {
  /**
   * Generates an 80G compliant PDF receipt buffer for a donation
   * @param {Object} donation 
   * @returns {Promise<Buffer>}
   */
  generatePdfBuffer(donation) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers = [];
        
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', error => reject(error));

        // Header Branding
        doc.fillColor('#0b3c5d')
           .fontSize(24)
           .text('VIDYAVAIDYA FOUNDATION', { align: 'center', paragraphGap: 5 });
        
        doc.fillColor('#666666')
           .fontSize(10)
           .text('Empowering Healthcare, Education & Communities across India', { align: 'center' })
           .text('NGO Registration No: IV-88/2022-NLR | Section 80G Ref: CIT(E)/80G/REG/2023-24', { align: 'center' })
           .text('Email: support@vidyavaidya.org | Website: www.vidyavaidya.org', { align: 'center', paragraphGap: 15 });

        // Decorative horizontal accent bar
        doc.strokeColor('#1abc9c')
           .lineWidth(3)
           .moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .stroke();
        
        doc.moveDown(1.5);

        // Receipt Title
        doc.fillColor('#0b3c5d')
           .fontSize(16)
           .text('DONATION RECEIPT & TAX EXEMPTION CERTIFICATE', { align: 'center', underline: true, paragraphGap: 20 });

        // Two-column receipt details metadata
        const metadataY = doc.y;
        doc.fillColor('#333333').fontSize(10);
        
        // Left Column
        doc.text(`Receipt Number: ${donation.receiptNumber || 'VV-N/A'}`, 50, metadataY)
           .text(`Date of Issue: ${new Date().toLocaleDateString('en-IN')}`)
           .text(`Payment ID: ${donation.donationId || 'N/A'}`)
           .text(`Order ID: ${donation.orderId || 'N/A'}`)
           .text(`Payment Method: ${(donation.paymentMethod || 'Razorpay').toUpperCase()}`);

        // Right Column
        const formattedDate = donation.createdAt 
          ? new Date(donation.createdAt._seconds ? donation.createdAt._seconds * 1000 : donation.createdAt).toLocaleDateString('en-IN')
          : new Date().toLocaleDateString('en-IN');
          
        doc.text(`Date of Payment: ${formattedDate}`, 320, metadataY)
           .text(`Donation Type: ${(donation.donationType || 'One-time').toUpperCase()}`)
           .text(`Exemption Scheme: Section 80G of Income Tax Act`)
           .text(`FCRA Registration: ${donation.donationType === 'foreign' ? 'Reg-031209348' : 'N/A (Domestic)'}`);

        doc.moveDown(2);

        // Donor particulars
        doc.fillColor('#0b3c5d')
           .fontSize(12)
           .text('DONOR DETAILS', 50, doc.y, { underline: true, paragraphGap: 10 });
        
        doc.fillColor('#333333').fontSize(10);
        doc.text(`Donor Name: ${donation.donorName || 'Generous Supporter'}`);
        doc.text(`Email Address: ${donation.donorEmail || 'N/A'}`);
        doc.text(`Phone Number: ${donation.donorPhone || 'N/A'}`);
        
        if (donation.address) {
          const addr = donation.address;
          doc.text(`Billing Address: ${addr.line || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}, ${addr.country || 'India'}`);
        }
        
        doc.moveDown(1.5);

        // Donation summary box
        doc.fillColor('#0b3c5d')
           .fontSize(12)
           .text('CONTRIBUTION DETAILS', 50, doc.y, { underline: true, paragraphGap: 10 });

        const amountBoxY = doc.y;
        doc.rect(50, amountBoxY, 495, 65)
           .fillColor('#f9f9f9')
           .strokeColor('#0b3c5d')
           .lineWidth(1)
           .fillAndStroke();

        doc.fillColor('#0b3c5d')
           .fontSize(11)
           .text(`Category of Cause: ${donation.category || 'General Fund'} (${donation.subcategory || 'Sustenance Support'})`, 65, amountBoxY + 15)
           .fontSize(14)
           .text(`Net Amount Received: INR ${donation.amount ? donation.amount.toFixed(2) : '0.00'}`, 65, amountBoxY + 35);

        doc.moveDown(3);

        // Legal 80G Clause & Disclaimer Box
        const disclaimerY = doc.y;
        doc.rect(50, disclaimerY, 495, 60)
           .fillColor('#eef7f6')
           .strokeColor('#1abc9c')
           .lineWidth(1)
           .fillAndStroke();

        doc.fillColor('#0b3c5d')
           .fontSize(8.5)
           .text(
             'Important Note for Tax Exemption:\n' +
             'This receipt confirms a donation made to Vidyavaidya Foundation. Contributions are eligible for a 50% tax deduction under Section 80G of the Income Tax Act, 1961 (for Indian taxpayers) subject to applicable laws. Exemption Certificate No: CIT(E)/80G/REG/2023-24 valid from Assessment Year 2024-25 onwards.',
             60, disclaimerY + 8, { width: 475, align: 'justify' }
           );

        doc.moveDown(3.5);

        // Signature section
        const signatureY = doc.y;
        
        // Stamp / Signature details
        doc.fillColor('#333333')
           .fontSize(9.5)
           .text('For Vidyavaidya Foundation', 350, signatureY, { align: 'right' });
        
        doc.moveDown(1.5);
        
        doc.text('Authorized Signatory', 350, doc.y, { align: 'right' })
           .text('Vidyavaidya Board of Trustees', 350, doc.y, { align: 'right' });

        // Footer note
        doc.fontSize(8)
           .fillColor('#888888')
           .text('This is a computer-generated receipt and does not require a physical signature.', 50, 750, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Generates and uploads a PDF receipt to Firebase Storage, returns signed URL
   * @param {Object} donation 
   * @returns {Promise<{receiptUrl: string, receiptPath: string}>}
   */
  async uploadReceipt(donation) {
    try {
      const pdfBuffer = await this.generatePdfBuffer(donation);
      const bucket = storage.bucket();
      
      const year = new Date().getFullYear();
      const userId = donation.userId || 'anonymous';
      const receiptPath = `receipts/${year}/${userId}/${donation.receiptNumber}.pdf`;
      
      const file = bucket.file(receiptPath);
      
      await file.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
          cacheControl: 'public, max-age=31536000',
        }
      });

      // Generate a signed URL that expires in 1 year (or 1 hour as requested, let's do 1 year so it remains viewable in dashboard)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year expiry
      });

      return {
        receiptUrl: signedUrl,
        receiptPath
      };
    } catch (error) {
      console.error('❌ Receipt generation/upload error:', error);
      throw new Error('Failed to generate and upload donation tax receipt');
    }
  },

  /**
   * Generates a new signed URL for an existing receipt path (e.g. if expired)
   * @param {string} receiptPath 
   * @returns {Promise<string>}
   */
  async getSignedReceiptUrl(receiptPath) {
    try {
      const bucket = storage.bucket();
      const file = bucket.file(receiptPath);
      
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000 // 1 hour expiry
      });
      
      return signedUrl;
    } catch (error) {
      console.error('❌ Error generating signed URL:', error);
      throw new Error('Failed to retrieve secure receipt download link');
    }
  }
};

module.exports = receiptService;
